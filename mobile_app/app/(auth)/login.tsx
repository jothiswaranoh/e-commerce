import { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import AppText from '@/components/AppText';
import AppButton from '@/components/AppButton';
import InputField from '@/components/InputField';
import { COLORS, SPACING } from '@/lib/theme';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)');
    }, 1200);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {/* LOGO */}
        <View style={styles.logoRow}>
          <View style={styles.logoBox}>
            <Ionicons name="cube-outline" size={26} color="#fff" />
          </View>
          <AppText variant="xl" weight="bold" color={COLORS.primary.DEFAULT}>
            ShopHub
          </AppText>
        </View>

        {/* TITLE */}
        <AppText variant="3xl" weight="bold" style={styles.title}>
          Welcome Back
        </AppText>
        <AppText color={COLORS.neutral[500]} style={styles.subtitle}>
          Sign in to your account to continue shopping
        </AppText>

        {/* EMAIL */}
        <InputField
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          placeholder="demo@example.com"
          keyboardType="email-address"
          leftIcon={<Ionicons name="mail-outline" size={20} color={COLORS.neutral[400]} />}
        />

        {/* PASSWORD */}
        <InputField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry={!showPassword}
          leftIcon={<Ionicons name="lock-closed-outline" size={20} color={COLORS.neutral[400]} />}
          rightIcon={
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={COLORS.neutral[400]}
              />
            </Pressable>
          }
        />

        {/* REMEMBER ME */}
        <Pressable
          style={styles.rememberRow}
          onPress={() => setRemember(!remember)}
        >
          <View style={[styles.checkbox, remember && styles.checked]} />
          <AppText>Remember me</AppText>
        </Pressable>

        {/* SIGN IN */}
        <AppButton
          title={loading ? 'Signing in...' : 'Sign In'}
          onPress={handleLogin}
          loading={loading}
          style={styles.signInBtn}
        />

        {/* DIVIDER */}
        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <AppText color={COLORS.neutral[500]} style={styles.orText}>
            Or continue with
          </AppText>
          <View style={styles.line} />
        </View>

        {/* SOCIAL */}
        <View style={styles.socialRow}>
          <Pressable style={styles.socialBtn}>
            <Ionicons name="logo-google" size={18} />
            <AppText style={styles.socialText}>Google</AppText>
          </Pressable>

          <Pressable style={styles.socialBtn}>
            <Ionicons name="logo-github" size={18} />
            <AppText style={styles.socialText}>GitHub</AppText>
          </Pressable>
        </View>

        {/* SIGN UP */}
        <Pressable onPress={() => router.push('/(auth)/signup')}>
          <AppText style={styles.signupText}>
            New here? Create an account
          </AppText>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[0],
  },
  content: {
    padding: SPACING.xl,
    paddingTop: 80,
  },

  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  logoBox: {
    backgroundColor: COLORS.primary.DEFAULT,
    padding: 10,
    borderRadius: 12,
    marginRight: 10,
  },

  title: {
    marginTop: SPACING.md,
  },
  subtitle: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.xl,
  },

  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.neutral[400],
    marginRight: 8,
  },
  checked: {
    backgroundColor: COLORS.primary.DEFAULT,
  },

  signInBtn: {
    marginTop: SPACING.md,
    borderRadius: 25,
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.neutral[300],
  },
  orText: {
    marginHorizontal: SPACING.md,
  },

  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialBtn: {
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    borderRadius: 14,
  },
  socialText: {
    marginLeft: 6,
    fontWeight: '600',
  },

  signupText: {
    textAlign: 'center',
    marginTop: SPACING.xl,
    color: COLORS.info.DEFAULT,
  },
});