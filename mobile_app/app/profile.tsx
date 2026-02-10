import { View, StyleSheet, ScrollView, TouchableOpacity, Image, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { ArrowLeft, Camera, User, Mail, Phone, MapPin, Check } from 'lucide-react-native';
import AppText from '@/components/AppText';
import AppButton from '@/components/AppButton';
import InputField from '@/components/InputField';
import { COLORS, SPACING, BORDERS, SHADOWS } from '@/lib/theme';

export default function ProfileScreen() {
    const router = useRouter();
    const [name, setName] = useState('John Doe');
    const [email, setEmail] = useState('john.doe@example.com');
    const [phone, setPhone] = useState('+1 (555) 000-0000');
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            router.back();
        }, 1000);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <ArrowLeft size={24} color={COLORS.neutral[900]} />
                </TouchableOpacity>
                <AppText variant="lg" weight="bold">Edit Profile</AppText>
                <View style={{ width: 44 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                    {/* Avatar Section */}
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatar}>
                                <AppText variant="3xl" weight="bold" color={COLORS.neutral[0]}>
                                    JD
                                </AppText>
                            </View>
                            <TouchableOpacity style={styles.cameraButton}>
                                <Camera size={20} color={COLORS.neutral[0]} />
                            </TouchableOpacity>
                        </View>
                        <AppText variant="md" weight="semibold" style={styles.changeLabel}>
                            Change Profile Picture
                        </AppText>
                    </View>

                    {/* Form */}
                    <View style={styles.formCard}>
                        <InputField
                            label="Full Name"
                            value={name}
                            onChangeText={setName}
                            placeholder="Your name"
                            leftIcon={<User size={20} color={COLORS.neutral[400]} />}
                        />
                        <InputField
                            label="Email Address"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="your.email@example.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            leftIcon={<Mail size={20} color={COLORS.neutral[400]} />}
                        />
                        <InputField
                            label="Phone Number"
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="+1 (000) 000-0000"
                            keyboardType="phone-pad"
                            leftIcon={<Phone size={20} color={COLORS.neutral[400]} />}
                        />
                    </View>

                    {/* Security Note */}
                    <View style={styles.noteBox}>
                        <AppText variant="sm" color={COLORS.neutral[500]} style={{ textAlign: 'center' }}>
                            Your data is encrypted and never shared with third parties.
                        </AppText>
                    </View>

                    <AppButton
                        title={saving ? "Saving Changes..." : "Save Changes"}
                        onPress={handleSave}
                        loading={saving}
                        variant="primary"
                        size="lg"
                        fullWidth
                        style={styles.saveButton}
                    />

                    <View style={{ height: 40 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.neutral[50],
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.lg,
        backgroundColor: COLORS.neutral[0],
        ...SHADOWS.sm,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: BORDERS.radius.full,
        backgroundColor: COLORS.neutral[100],
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: SPACING.xl,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: SPACING['2xl'],
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.primary.DEFAULT,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.md,
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.accent.DEFAULT,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: COLORS.neutral[0],
    },
    changeLabel: {
        marginTop: SPACING.md,
        color: COLORS.primary.DEFAULT,
    },
    formCard: {
        backgroundColor: COLORS.neutral[0],
        borderRadius: BORDERS.radius.xl,
        padding: SPACING.xl,
        ...SHADOWS.sm,
        gap: SPACING.md,
    },
    noteBox: {
        marginTop: SPACING.xl,
        paddingHorizontal: SPACING.xl,
    },
    saveButton: {
        marginTop: SPACING['2xl'],
    },
});
