import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import AppText from '@/components/AppText';
import AppButton from '@/components/AppButton';
import InputField from '@/components/InputField';
import { COLORS, SPACING, BORDERS, SHADOWS } from '@/lib/theme';

export default function SignupScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.replace('/(tabs)');
        }, 1500);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <AppText variant="3xl" weight="bold" color={COLORS.neutral[900]}>
                        Create account
                    </AppText>
                </View>

                <View style={styles.form}>
                    <InputField
                        label="Your name"
                        value={name}
                        onChangeText={setName}
                        placeholder="First and last name"
                    />
                    <InputField
                        label="Mobile number or email"
                        value={email}
                        onChangeText={setEmail}
                        placeholder=""
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <InputField
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="At least 6 characters"
                        secureTextEntry
                    />

                    <AppText variant="xs" color={COLORS.neutral[600]} style={styles.passwordHint}>
                        i Passwords must be at least 6 characters.
                    </AppText>

                    <AppButton
                        title={loading ? "Creating account..." : "Continue"}
                        onPress={handleSignup}
                        loading={loading}
                        variant="primary"
                        style={styles.signupBtn}
                    />

                    <View style={styles.termsBox}>
                        <AppText variant="xs" color={COLORS.neutral[600]} style={styles.terms}>
                            By creating an account, you agree to Shop's <AppText variant="xs" color={COLORS.info.DEFAULT}>Conditions of Use</AppText> and <AppText variant="xs" color={COLORS.info.DEFAULT}>Privacy Notice</AppText>.
                        </AppText>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.loginRow}>
                        <AppText variant="sm">Already have an account? </AppText>
                        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                            <AppText variant="sm" color={COLORS.info.DEFAULT} weight="medium">
                                Sign in
                            </AppText>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.footer}>
                    <View style={styles.footerLinks}>
                        <AppText variant="xs" color={COLORS.info.DEFAULT}>Conditions of Use</AppText>
                        <AppText variant="xs" color={COLORS.info.DEFAULT}>Privacy Notice</AppText>
                        <AppText variant="xs" color={COLORS.info.DEFAULT}>Help</AppText>
                    </View>
                    <AppText variant="xs" color={COLORS.neutral[500]} style={styles.copyright}>
                        © 1996-2023, Shop.com, Inc. or its affiliates
                    </AppText>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.neutral[0],
    },
    scrollContent: {
        padding: SPACING.xl,
        paddingTop: 80,
    },
    header: {
        marginBottom: SPACING['2xl'],
    },
    form: {
        gap: SPACING.md,
    },
    passwordHint: {
        marginTop: -8,
    },
    signupBtn: {
        backgroundColor: COLORS.accent.yellow,
        borderRadius: 8,
        marginTop: SPACING.md,
    },
    termsBox: {
        marginTop: SPACING.md,
    },
    terms: {
        lineHeight: 18,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.neutral[200],
        marginVertical: SPACING.xl,
    },
    loginRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footer: {
        marginTop: 60,
        alignItems: 'center',
    },
    footerLinks: {
        flexDirection: 'row',
        gap: SPACING.xl,
        marginBottom: SPACING.md,
    },
    copyright: {
        marginTop: SPACING.xs,
    },
});
