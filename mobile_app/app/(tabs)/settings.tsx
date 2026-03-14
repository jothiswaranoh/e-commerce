import { useState } from 'react';
import {
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
    ChevronRight,
    Crown,
    LogOut,
    ShieldCheck,
    Sparkles,
} from 'lucide-react-native';
import AppText from '@/components/AppText';
import { BORDERS, COLORS, SHADOWS, SPACING } from '@/lib/theme';
import { useAuth } from '@/context/AuthContext';
import {
    ACCOUNT_SETTINGS,
    APP_SETTINGS,
    ORDER_SETTINGS,
    SUPPORT_SETTINGS,
    UI_TEXT,
} from '@/lib/constants';

type SettingsItem =
    | (typeof ACCOUNT_SETTINGS)[number]
    | (typeof ORDER_SETTINGS)[number]
    | (typeof APP_SETTINGS)[number]
    | (typeof SUPPORT_SETTINGS)[number];

const SECTION_ACCENTS = {
    ACCOUNT: ['#4F46E5', '#0F172A'] as [string, string],
    ORDERS: ['#0F766E', '#0F172A'] as [string, string],
    PREFERENCES: ['#7C2D12', '#111827'] as [string, string],
    SUPPORT: ['#334155', '#020617'] as [string, string],
};

const SECTION_TITLES: Record<keyof typeof SECTION_ACCENTS, string> = {
    ACCOUNT: 'Account',
    ORDERS: 'Orders',
    PREFERENCES: 'Preferences',
    SUPPORT: 'Support',
};

const ITEM_ACCENTS: Record<string, string> = {
    profile: '#818CF8',
    addresses: '#38BDF8',
    payment: '#22C55E',
    orders: '#14B8A6',
    wishlist: '#FB7185',
    notif: '#60A5FA',
    dark: '#A78BFA',
    lang: '#F59E0B',
    help: '#2DD4BF',
    privacy: '#94A3B8',
};

export default function SettingsScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [settings, setSettings] = useState<Record<string, boolean>>({
        notif: true,
        dark: false,
    });

    const toggleSetting = (id: string) => {
        setSettings((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleLogout = () => {
        Alert.alert(UI_TEXT.SIGN_OUT, UI_TEXT.LOGOUT_CONFIRM, [
            { text: UI_TEXT.CANCEL, style: 'cancel' },
            {
                text: UI_TEXT.SIGN_OUT,
                style: 'destructive',
                onPress: async () => {
                    await logout();
                    router.replace('/(auth)/login');
                },
            },
        ]);
    };

    const avatarLabel = (user?.name || user?.email || 'U')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('')
        .slice(0, 2);

    const handlePress = (item: SettingsItem) => {
        if (item.type === 'link' && 'route' in item && item.route) {
            router.push(item.route as any);
        }
    };

    const renderSettingItem = (item: SettingsItem, isLast: boolean) => {
        const IconComponent = item.icon;
        const iconTint = ITEM_ACCENTS[item.id] || COLORS.info.DEFAULT;

        return (
            <View key={item.id}>
                <TouchableOpacity
                    style={styles.settingItem}
                    activeOpacity={item.type === 'link' ? 0.82 : 1}
                    onPress={() => handlePress(item)}
                >
                    <LinearGradient
                        colors={['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.08)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.settingIconShell}
                    >
                        <View style={[styles.settingIconCore, { backgroundColor: `${iconTint}22` }]}>
                            <IconComponent size={20} color={iconTint} />
                        </View>
                    </LinearGradient>

                    <View style={styles.settingContent}>
                        <AppText variant="md" weight="semibold" color={COLORS.neutral[0]}>
                            {item.title}
                        </AppText>
                        {'subtitle' in item && item.subtitle ? (
                            <AppText variant="sm" color="rgba(255,255,255,0.64)">
                                {item.subtitle}
                            </AppText>
                        ) : null}
                    </View>

                    {item.type === 'toggle' ? (
                        <Switch
                            value={settings[item.id]}
                            onValueChange={() => toggleSetting(item.id)}
                            trackColor={{
                                false: 'rgba(148,163,184,0.35)',
                                true: 'rgba(96,165,250,0.55)',
                            }}
                            thumbColor={settings[item.id] ? '#F8FAFC' : '#CBD5E1'}
                            ios_backgroundColor="rgba(148,163,184,0.2)"
                        />
                    ) : (
                        <View style={styles.chevronShell}>
                            <ChevronRight size={18} color="rgba(255,255,255,0.72)" />
                        </View>
                    )}
                </TouchableOpacity>
                {!isLast ? <View style={styles.divider} /> : null}
            </View>
        );
    };

    const renderSection = (
        title: keyof typeof SECTION_ACCENTS,
        eyebrow: string,
        items: readonly SettingsItem[],
    ) => (
        <View style={styles.section} key={title}>
            <View style={styles.sectionHeader}>
                <AppText variant="sm" weight="bold" color="#00000074" style={styles.sectionEyebrow}>
                    {eyebrow}
                </AppText>
                <AppText variant="xl" weight="bold" color="#343739">
                    {SECTION_TITLES[title]}
                </AppText>
            </View>

            <LinearGradient
                colors={SECTION_ACCENTS[title]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sectionCard}
            >
                {items.map((item, index) => renderSettingItem(item, index === items.length - 1))}
            </LinearGradient>
        </View>
    );

    return (
        <LinearGradient
            colors={['#7598bb', '#E2E8F0', '#CBD5E1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.screen}
        >
            <StatusBar barStyle="dark-content" />

            <View style={styles.orbOne} />
            <View style={styles.orbTwo} />

            <SafeAreaView style={styles.container} edges={['top']}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <View>
                            <AppText variant="sm" weight="bold" color={COLORS.neutral[500]} style={styles.headerEyebrow}>
                                ACCOUNT HUB
                            </AppText>
                            <AppText variant="3xl" weight="bold">
                                Settings
                            </AppText>
                        </View>
                    </View>

                    <LinearGradient
                        colors={['#111827', '#1E293B', '#312E81']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.heroCard}
                    >
                        <View style={styles.heroTopRow}>
                            <View style={styles.heroStatus}>
                                <ShieldCheck size={14} color="#86EFAC" />
                                <AppText variant="xs" weight="semibold" color="#DCFCE7">
                                    Protected
                                </AppText>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.profileCard}
                            activeOpacity={0.9}
                            onPress={() => router.push('/profile')}
                        >
                            <LinearGradient
                                colors={['#A5B4FC', '#7C3AED']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.avatar}
                            >
                                <AppText variant="xl" weight="bold" color={COLORS.neutral[0]}>
                                    {avatarLabel}
                                </AppText>
                            </LinearGradient>

                            <View style={styles.profileContent}>
                                <AppText variant="xl" weight="bold" color={COLORS.neutral[0]}>
                                    {user?.name || 'Guest User'}
                                </AppText>
                                <AppText variant="sm" color="rgba(255,255,255,0.72)">
                                    {user?.email || 'Sign in to sync your account'}
                                </AppText>
                            </View>

                            <View style={styles.profileChevron}>
                                <ChevronRight size={20} color={COLORS.neutral[0]} />
                            </View>
                        </TouchableOpacity>

                        <View style={styles.statsRow}>
                            <View style={styles.statCard}>
                                <AppText variant="xl" weight="bold" color={COLORS.neutral[0]}>
                                    5
                                </AppText>
                                <AppText variant="xs" weight="medium" color="rgba(255,255,255,0.64)">
                                    Active orders
                                </AppText>
                            </View>
                            <View style={styles.statCard}>
                                <AppText variant="xl" weight="bold" color={COLORS.neutral[0]}>
                                    9
                                </AppText>
                                <AppText variant="xs" weight="medium" color="rgba(255,255,255,0.64)">
                                    Delivered items
                                </AppText>
                            </View>
                            <View style={styles.statCard}>
                                <AppText variant="xl" weight="bold" color={COLORS.neutral[0]}>
                                    3
                                </AppText>
                                <AppText variant="xs" weight="medium" color="rgba(255,255,255,0.64)">
                                    Saved wallets
                                </AppText>
                            </View>
                        </View>
                    </LinearGradient>

                    {renderSection('ACCOUNT', 'IDENTITY', ACCOUNT_SETTINGS)}
                    {renderSection('ORDERS', 'SHOPPING', ORDER_SETTINGS)}
                    {renderSection('PREFERENCES', 'EXPERIENCE', APP_SETTINGS)}
                    {renderSection('SUPPORT', 'TRUST', SUPPORT_SETTINGS)}

                    <TouchableOpacity
                        style={styles.logoutButton}
                        activeOpacity={0.88}
                        onPress={handleLogout}
                    >
                        <View style={styles.logoutIcon}>
                            <LogOut size={18} color="#B91C1C" />
                        </View>
                        <View style={styles.logoutContent}>
                            <AppText variant="md" weight="bold">
                                {UI_TEXT.SIGN_OUT}
                            </AppText>
                            <AppText variant="sm" color={COLORS.neutral[500]}>
                                End this session on this device
                            </AppText>
                        </View>
                        <ChevronRight size={18} color={COLORS.neutral[400]} />
                    </TouchableOpacity>

                    <AppText variant="sm" color={COLORS.neutral[500]} style={styles.version}>
                        ShopHub v1.0.0
                    </AppText>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    orbOne: {
        position: 'absolute',
        top: 120,
        right: -40,
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(255,255,255,0.35)',
    },
    orbTwo: {
        position: 'absolute',
        top: 340,
        left: -60,
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: 'rgba(191,219,254,0.28)',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING['3xl'],
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: SPACING.xl,
        paddingTop: SPACING.md,
    },
    headerEyebrow: {
        letterSpacing: 1.2,
        marginBottom: SPACING.xs,
    },
    headerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: BORDERS.radius.full,
        backgroundColor: 'rgba(255,255,255,0.72)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.8)',
    },
    heroCard: {
        borderRadius: 32,
        padding: SPACING.xl,
        marginBottom: SPACING['2xl'],
        ...SHADOWS.lg,
    },
    heroTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.xl,
        gap: SPACING.sm,
    },
    heroPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: BORDERS.radius.full,
        backgroundColor: 'rgba(222, 19, 19, 0.08)',
    },
    heroStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: BORDERS.radius.full,
        backgroundColor: 'rgba(34,197,94,0.12)',
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 26,
        padding: SPACING.lg,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    profileContent: {
        flex: 1,
    },
    profileMeta: {
        marginTop: SPACING.xs,
        lineHeight: 18,
    },
    profileChevron: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.12)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        gap: SPACING.sm,
        marginTop: SPACING.lg,
    },
    statCard: {
        flex: 1,
        paddingVertical: SPACING.md,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.06)',
        alignItems: 'center',
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionHeader: {
        marginBottom: SPACING.md,
        paddingHorizontal: SPACING.xs,
    },
    sectionEyebrow: {
        letterSpacing: 1.2,
        marginBottom: 6,
    },
    sectionCard: {
        borderRadius: 28,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        ...SHADOWS.md,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 82,
        gap: SPACING.md,
    },
    settingIconShell: {
        width: 52,
        height: 52,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingIconCore: {
        width: 42,
        height: 42,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingContent: {
        flex: 1,
        gap: 2,
    },
    chevronShell: {
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.08)',
        marginLeft: 68,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
        padding: SPACING.lg,
        borderRadius: 24,
        backgroundColor: 'rgb(255, 255, 255)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.92)',
        ...SHADOWS.sm,
    },
    logoutIcon: {
        width: 44,
        height: 44,
        borderRadius: 16,
        backgroundColor: '#FEE2E2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutContent: {
        flex: 1,
    },
    version: {
        textAlign: 'center',
        marginTop: SPACING.xl,
    },
});
