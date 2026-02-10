import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AppText from '@/components/AppText';
import AppButton from '@/components/AppButton';
import InputField from '@/components/InputField';
import { COLORS, SPACING, GRADIENTS, BORDERS, SHADOWS } from '@/lib/theme';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = () => {
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
                        Sign in
                    </AppText>
                    <AppText variant="md" color={COLORS.neutral[600]} style={styles.subtitle}>
                        Welcome back to Shop
                    </AppText>
                </View>

                <View style={styles.form}>
                    <InputField
                        label="Email or mobile phone number"
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
                        placeholder=""
                        secureTextEntry
                    />

                    <AppButton
                        title={loading ? "Signing in..." : "Continue"}
                        onPress={handleLogin}
                        loading={loading}
                        variant="primary"
                        style={styles.loginBtn}
                    />

                    <View style={styles.termsBox}>
                        <AppText variant="xs" color={COLORS.neutral[600]} style={styles.terms}>
                            By continuing, you agree to Shop's <AppText variant="xs" color={COLORS.info.DEFAULT}>Conditions of Use</AppText> and <AppText variant="xs" color={COLORS.info.DEFAULT}>Privacy Notice</AppText>.
                        </AppText>
                    </View>

                    <View style={styles.dividerRow}>
                        <View style={styles.divider} />
                        <AppText variant="sm" color={COLORS.neutral[500]} style={styles.dividerText}>
                            New to Shop?
                        </AppText>
                        <View style={styles.divider} />
                    </View>

                    <AppButton
                        title="Create your Shop account"
                        onPress={() => router.push('/(auth)/signup')}
                        variant="outline"
                        style={styles.signupBtn}
                    />
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
        paddingTop: 100,
    },
    header: {
        marginBottom: SPACING['3xl'],
    },
    subtitle: {
        marginTop: SPACING.xs,
    },
    form: {
        gap: SPACING.md,
    },
    loginBtn: {
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
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: SPACING['2xl'],
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.neutral[300],
    },
    dividerText: {
        marginHorizontal: SPACING.md,
    },
    signupBtn: {
        backgroundColor: COLORS.neutral[100],
        borderColor: COLORS.neutral[300],
        borderRadius: 8,
    },
    footer: {
        marginTop: SPACING['3xl'],
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
