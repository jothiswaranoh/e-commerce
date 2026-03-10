import { View, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { ChevronRight, LogOut } from 'lucide-react-native';
import AppText from '@/components/AppText';
import { COLORS, SPACING, BORDERS, SHADOWS } from '@/lib/theme';
import {
    ACCOUNT_SETTINGS,
    ORDER_SETTINGS,
    APP_SETTINGS,
    SUPPORT_SETTINGS,
    UI_TEXT,
} from '@/lib/constants';

export default function SettingsScreen() {
    const router = useRouter();
    const [settings, setSettings] = useState<Record<string, boolean>>({
        notif: true,
        dark: false,
    });

    const toggleSetting = (id: string) => {
        setSettings((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleLogout = () => {
        Alert.alert(
            UI_TEXT.SIGN_OUT,
            UI_TEXT.LOGOUT_CONFIRM,
            [
                { text: UI_TEXT.CANCEL, style: 'cancel' },
                {
                    text: UI_TEXT.SIGN_OUT,
                    style: 'destructive',
                    onPress: () => router.replace('/(auth)/login')
                },
            ]
        );
    };

    const handlePress = (item: any) => {
        if (item.type === 'link' && item.route) {
            router.push(item.route as any);
        }
    };

    const renderSettingItem = (item: any) => {
        const IconComponent = item.icon;
        return (
            <TouchableOpacity
                key={item.id}
                style={styles.settingItem}
                activeOpacity={item.type === 'link' ? 0.7 : 1}
                onPress={() => handlePress(item)}
            >
                <View style={styles.settingIconContainer}>
                    <IconComponent size={22} color={COLORS.info.DEFAULT} />
                </View>
                <View style={styles.settingContent}>
                    <AppText variant="md" weight="medium">
                        {item.title}
                    </AppText>
                    {item.subtitle && (
                        <AppText variant="sm" color={COLORS.neutral[500]}>
                            {item.subtitle}
                        </AppText>
                    )}
                </View>
                {item.type === 'toggle' ? (
                    <Switch
                        value={settings[item.id]}
                        onValueChange={() => toggleSetting(item.id)}
                        trackColor={{ false: COLORS.neutral[300], true: COLORS.info.DEFAULT }}
                        thumbColor={COLORS.neutral[0]}
                    />
                ) : (
                    <ChevronRight size={20} color={COLORS.neutral[400]} />
                )}
            </TouchableOpacity>
        );
    };

    const renderSection = (title: string, items: any) => (
        <View style={styles.section}>
            <AppText variant="sm" weight="bold" color={COLORS.neutral[500]} style={styles.sectionTitle}>
                {title}
            </AppText>
            <View style={styles.sectionCard}>
                {items.map((item: any, index: number) => (
                    <View key={item.id}>
                        {renderSettingItem(item)}
                        {index < items.length - 1 && <View style={styles.divider} />}
                    </View>
                ))}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <AppText variant="2xl" weight="bold">Settings</AppText>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Card */}
                <TouchableOpacity
                    style={styles.profileCard}
                    activeOpacity={0.9}
                    onPress={() => router.push('/profile')}
                >
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <AppText variant="xl" weight="bold" color={COLORS.neutral[0]}>
                                ST
                            </AppText>
                        </View>
                    </View>
                    <View style={styles.profileInfo}>
                        <AppText variant="lg" weight="bold">Stark</AppText>
                        <AppText variant="sm" color={COLORS.neutral[500]}>stark@example.com</AppText>
                    </View>
                    <ChevronRight size={20} color={COLORS.neutral[400]} />
                </TouchableOpacity>

                {renderSection('ACCOUNT', ACCOUNT_SETTINGS)}
                {renderSection('ORDERS', ORDER_SETTINGS)}
                {renderSection('APP PREFERENCES', APP_SETTINGS)}
                {renderSection('SUPPORT', SUPPORT_SETTINGS)}

                {/* Logout Button */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    activeOpacity={0.8}
                    onPress={handleLogout}
                >
                    <LogOut size={20} color={COLORS.error.DEFAULT} />
                    <AppText variant="md" weight="bold" color={COLORS.error.DEFAULT}>
                        {UI_TEXT.SIGN_OUT}
                    </AppText>
                </TouchableOpacity>

                <AppText variant="sm" color={COLORS.neutral[400]} style={styles.version}>
                    Shop v1.0.0
                </AppText>

                <View style={{ height: SPACING['2xl'] }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.neutral[100],
    },
    header: {
        padding: SPACING.xl,
        backgroundColor: COLORS.neutral[0],
        borderBottomWidth: 1,
        borderBottomColor: COLORS.neutral[200],
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: SPACING.lg,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.neutral[0],
        borderRadius: BORDERS.radius.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.xl,
        ...SHADOWS.sm,
    },
    avatarContainer: {
        marginRight: SPACING.md,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.info.DEFAULT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInfo: {
        flex: 1,
    },
    section: {
        marginBottom: SPACING.lg,
    },
    sectionTitle: {
        marginBottom: SPACING.sm,
        marginLeft: SPACING.xs,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sectionCard: {
        backgroundColor: COLORS.neutral[0],
        borderRadius: BORDERS.radius.md,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.neutral[200],
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.lg,
        gap: SPACING.md,
    },
    settingIconContainer: {
        width: 40,
        height: 40,
        borderRadius: BORDERS.radius.md,
        backgroundColor: COLORS.neutral[100],
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingContent: {
        flex: 1,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.neutral[200],
        marginLeft: 68,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        backgroundColor: COLORS.neutral[0],
        borderRadius: BORDERS.radius.lg,
        padding: SPACING.lg,
        marginTop: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.error.light,
    },
    version: {
        textAlign: 'center',
        marginTop: SPACING.xl,
    },
});
