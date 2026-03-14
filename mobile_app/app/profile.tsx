import { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
    ArrowLeft,
    Camera,
    Check,
    Mail,
    Phone,
    ShieldCheck,
    Sparkles,
    User,
} from 'lucide-react-native';
import AppText from '@/components/AppText';
import { BORDERS, COLORS, SHADOWS, SPACING } from '@/lib/theme';
import { useAuth } from '@/context/AuthContext';

type FieldProps = {
    label: string;
    value: string;
    onChangeText: (value: string) => void;
    placeholder: string;
    icon: React.ReactNode;
    keyboardType?: 'default' | 'email-address' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
};

function Field({
    label,
    value,
    onChangeText,
    placeholder,
    icon,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
}: FieldProps) {
    const [focused, setFocused] = useState(false);

    return (
        <View style={styles.fieldBlock}>
            <AppText variant="sm" weight="bold" color="#CBD5E1" style={styles.fieldLabel}>
                {label}
            </AppText>
            <View style={[styles.fieldShell, focused && styles.fieldShellFocused]}>
                <View style={styles.fieldIcon}>{icon}</View>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="rgba(203,213,225,0.45)"
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    style={styles.fieldInput}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                />
            </View>
        </View>
    );
}

export default function ProfileScreen() {
    const router = useRouter();
    const { user, updateProfile, refreshUser } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('+1 (555) 000-0000');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setName(user?.name ?? '');
        setEmail(user?.email ?? '');
    }, [user]);

    useEffect(() => {
        refreshUser().catch(() => undefined);
    }, []);

    const handleSave = async () => {
        try {
            setSaving(true);
            await updateProfile({
                name: name.trim(),
                email: email.trim(),
            });
            router.back();
        } catch (error) {
            Alert.alert(
                'Unable to save profile',
                error instanceof Error ? error.message : 'Please try again.'
            );
        } finally {
            setSaving(false);
        }
    };

    const avatarLabel = (user?.name || name || user?.email || email || 'U')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('')
        .slice(0, 2);

    return (
        <LinearGradient
            colors={['#F8FAFC', '#E2E8F0', '#CBD5E1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.screen}
        >
            <StatusBar barStyle="dark-content" />
            <View style={styles.orbOne} />
            <View style={styles.orbTwo} />

            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
                        <ArrowLeft size={22} color={COLORS.neutral[900]} />
                    </TouchableOpacity>

                    <View style={styles.headerTitleWrap}>
                        <AppText variant="xl" weight="bold">
                            Edit Profile
                        </AppText>
                    </View>
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.flex}
                >
                    <ScrollView
                        style={styles.flex}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <LinearGradient
                            colors={['#111827', '#1E293B', '#312E81']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.heroCard}
                        >
                            <View style={styles.heroTopRow}>
                                <View style={styles.heroPill}>
                                    <ShieldCheck size={14} color="#86EFAC" />
                                    <AppText variant="xs" weight="bold" color="#DCFCE7">
                                        Verified account
                                    </AppText>
                                </View>
                            </View>

                            <View style={styles.avatarSection}>
                                <View style={styles.avatarWrap}>
                                    <LinearGradient
                                        colors={['#A5B4FC', '#7C3AED']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.avatar}
                                    >
                                        <AppText variant="3xl" weight="bold" color={COLORS.neutral[0]}>
                                            {avatarLabel}
                                        </AppText>
                                    </LinearGradient>
                                    <TouchableOpacity style={styles.cameraButton} activeOpacity={0.85}>
                                        <Camera size={18} color={COLORS.neutral[0]} />
                                    </TouchableOpacity>
                                </View>

                                <AppText variant="xl" weight="bold" color={COLORS.neutral[0]} style={styles.heroName}>
                                    {name || 'Your profile'}
                                </AppText>
                            </View>
                            <View style={styles.heroStats}>
                                <View style={styles.heroStatCard}>
                                    <AppText variant="lg" weight="bold" color={COLORS.neutral[0]}>
                                        100%
                                    </AppText>
                                    <AppText variant="xs" color="rgba(255,255,255,0.62)">
                                        Profile score
                                    </AppText>
                                </View>
                            </View>
                        </LinearGradient>

                        <LinearGradient
                            colors={['#0F172A', '#1E293B']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.formCard}
                        >
                            <View style={styles.formHeader}>
                                <View>
                                    <AppText variant="sm" weight="bold" color="#94A3B8" style={styles.formEyebrow}>
                                        PERSONAL DETAILS
                                    </AppText>
                                    <AppText variant="xl" weight="bold" color={COLORS.neutral[0]}>
                                        Identity
                                    </AppText>
                                </View>
                                <View style={styles.formBadge}>
                                    <Check size={14} color="#34D399" />
                                    <AppText variant="xs" weight="bold" color="#A7F3D0">
                                        Encrypted
                                    </AppText>
                                </View>
                            </View>

                            <Field
                                label="Full Name"
                                value={name}
                                onChangeText={setName}
                                placeholder="Your name"
                                icon={<User size={18} color="#A5B4FC" />}
                            />
                            <Field
                                label="Email Address"
                                value={email}
                                onChangeText={setEmail}
                                placeholder="your.email@example.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                icon={<Mail size={18} color="#7DD3FC" />}
                            />
                            <Field
                                label="Phone Number"
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="+1 (000) 000-0000"
                                keyboardType="phone-pad"
                                icon={<Phone size={18} color="#6EE7B7" />}
                            />
                        </LinearGradient>

                        <View style={styles.noteBox}>
                            <View style={styles.noteIcon}>
                                <ShieldCheck size={18} color="#166534" />
                            </View>
                            <View style={styles.noteContent}>
                                <AppText variant="sm" weight="bold">
                                    Your data stays protected
                                </AppText>
                                <AppText variant="sm" color={COLORS.neutral[500]}>
                                    Identity details are encrypted and used only for checkout, delivery, and support.
                                </AppText>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.saveButton}
                            activeOpacity={0.9}
                            onPress={handleSave}
                            disabled={saving}
                        >
                            <LinearGradient
                                colors={saving ? ['#94A3B8', '#64748B'] : ['#A5B4FC', '#7C3AED', '#312E81']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.saveButtonGradient}
                            >
                                <View style={styles.saveButtonContent}>
                                    <View style={styles.saveButtonTextWrap}>
                                        <AppText variant="lg" weight="bold" color={COLORS.neutral[0]}>
                                            {saving ? 'Saving Changes...' : 'Save Changes'}
                                        </AppText>
                                        <AppText variant="sm" color="rgba(255,255,255,0.72)">
                                            Update your account details
                                        </AppText>
                                    </View>
                                    <View style={styles.saveButtonIcon}>
                                        <Check size={18} color="#312E81" />
                                    </View>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
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
    flex: {
        flex: 1,
    },
    orbOne: {
        position: 'absolute',
        top: 110,
        right: -40,
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(255,255,255,0.35)',
    },
    orbTwo: {
        position: 'absolute',
        top: 360,
        left: -70,
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: 'rgba(191,219,254,0.28)',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.md,
        paddingBottom: SPACING.lg,
    },
    headerButton: {
        width: 46,
        height: 46,
        borderRadius: 23,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.72)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.88)',
    },
    headerTitleWrap: {
        flex: 1,
        marginLeft: SPACING.md,
    },
    headerEyebrow: {
        letterSpacing: 1.2,
        marginBottom: 4,
    },
    headerBadge: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.72)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.88)',
    },
    scrollContent: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING['3xl'],
    },
    heroCard: {
        borderRadius: 32,
        padding: SPACING.xl,
        marginBottom: SPACING.xl,
        ...SHADOWS.lg,
    },
    heroTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: SPACING.sm,
        marginBottom: SPACING.xl,
    },
    heroPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: BORDERS.radius.full,
        backgroundColor: 'rgba(34,197,94,0.12)',
    },
    heroPillMuted: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: BORDERS.radius.full,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    avatarSection: {
        alignItems: 'center',
    },
    avatarWrap: {
        position: 'relative',
        marginBottom: SPACING.md,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraButton: {
        position: 'absolute',
        right: 2,
        bottom: 2,
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F59E0B',
        borderWidth: 3,
        borderColor: '#0F172A',
    },
    heroName: {
        marginBottom: 4,
    },
    heroStats: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginTop: SPACING.xl,
    },
    heroStatCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: SPACING.md,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    formCard: {
        borderRadius: 30,
        padding: SPACING.xl,
        ...SHADOWS.md,
    },
    formHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.lg,
        gap: SPACING.md,
    },
    formEyebrow: {
        letterSpacing: 1.2,
        marginBottom: 6,
    },
    formBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: BORDERS.radius.full,
        backgroundColor: 'rgba(16,185,129,0.12)',
    },
    fieldBlock: {
        marginBottom: SPACING.lg,
    },
    fieldLabel: {
        marginBottom: SPACING.sm,
        letterSpacing: 0.5,
    },
    fieldShell: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 60,
        paddingHorizontal: SPACING.md,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    fieldShellFocused: {
        borderColor: 'rgba(165,180,252,0.75)',
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    fieldIcon: {
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.06)',
        marginRight: SPACING.md,
    },
    fieldInput: {
        flex: 1,
        color: COLORS.neutral[0],
        fontSize: 16,
        paddingVertical: SPACING.md,
    },
    noteBox: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginTop: SPACING.xl,
        padding: SPACING.lg,
        borderRadius: 24,
        backgroundColor: 'rgb(255, 255, 255)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.9)',
        ...SHADOWS.sm,
    },
    noteIcon: {
        width: 42,
        height: 42,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DCFCE7',
    },
    noteContent: {
        flex: 1,
        gap: 2,
    },
    saveButton: {
        marginTop: SPACING.xl,
        borderRadius: 26,
        overflow: 'hidden',
        ...SHADOWS.lg,
    },
    saveButtonGradient: {
        position: 'relative',
        minHeight: 82,
        borderRadius: 26,
        justifyContent: 'center',
        paddingHorizontal: SPACING.lg,
    },
    saveButtonGlow: {
        position: 'absolute',
        top: 10,
        left: 12,
        width: 120,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.16)',
    },
    saveButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    saveButtonTextWrap: {
        flex: 1,
        gap: 2,
    },
    saveButtonIcon: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
