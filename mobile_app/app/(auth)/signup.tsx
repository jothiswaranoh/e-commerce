import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import AppText from '@/components/AppText';
import InputField from '@/components/InputField';
import { COLORS, SPACING, BORDERS, SHADOWS } from '@/lib/theme';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460'] as [string, string, string]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
        <View style={styles.decorativeCircle3} />
        
        <View style={styles.topGlow} />
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/*logo*/}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={[COLORS.primary.DEFAULT, '#a855f7'] as [string, string]}
                style={styles.logoGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="cube-outline" size={32} color="#fff" />
              </LinearGradient>

              <View style={styles.logoGlow} />
            </View>
            
            <AppText variant="3xl" weight="bold" color="#fff" style={styles.brandName}>
              ShopHub
            </AppText>
            <AppText color="rgba(255,255,255,0.7)" style={styles.tagline}>
              Premium Shopping Experience
            </AppText>
          </View>

          <View style={styles.card}>
            <View style={styles.cardContent}>
              <AppText variant="2xl" weight="bold" color={COLORS.neutral[900]} style={styles.title}>
                Create Account
              </AppText>
              <AppText color={COLORS.neutral[500]} style={styles.subtitle}>
                Join us for an amazing shopping experience
              </AppText>

              <View style={styles.inputContainer}>
                <InputField
                  label="Full Name"
                  value={name}
                  onChangeText={setName}
                  placeholder="First and last name"
                  leftIcon={<Ionicons name="person-outline" size={20} color={COLORS.primary.DEFAULT} />}
                  containerStyle={styles.inputField}
                />
              </View>

              <View style={styles.inputContainer}>
                <InputField
                  label="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="demo@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  leftIcon={<Ionicons name="mail-outline" size={20} color={COLORS.primary.DEFAULT} />}
                  containerStyle={styles.inputField}
                />
              </View>

              <View style={styles.inputContainer}>
                <InputField
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="At least 6 characters"
                  secureTextEntry={!showPassword}
                  leftIcon={<Ionicons name="lock-closed-outline" size={20} color={COLORS.primary.DEFAULT} />}
                  rightIcon={
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color={COLORS.primary.DEFAULT}
                      />
                    </Pressable>
                  }
                  containerStyle={styles.inputField}
                />
              </View>

              <AppText variant="xs" color={COLORS.neutral[500]} style={styles.passwordHint}>
                Passwords must be at least 6 characters.
              </AppText>

              <Pressable 
                style={({ pressed }) => [
                  styles.premiumButton,
                  pressed && styles.premiumButtonPressed,
                ]}
                onPress={handleSignup}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#7c3aed', '#a855f7', '#6366f1'] as [string, string, string]}
                  style={styles.premiumButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <View style={styles.premiumButtonContent}>
                      <AppText weight="bold" color="#fff" style={styles.premiumButtonText}>
                        Create Account
                      </AppText>
                      <View style={styles.premiumButtonIcon}>
                        <Ionicons name="arrow-forward" size={16} color="#fff" />
                      </View>
                    </View>
                  )}
                </LinearGradient>

                <View style={styles.premiumButtonGlow} />
              </Pressable>

              <View style={styles.termsBox}>
                <AppText variant="xs" color={COLORS.neutral[500]} style={styles.terms}>
                  By creating an account, you agree to ShopHub's{' '}
                  <AppText variant="xs" color={COLORS.primary.DEFAULT}>
                    Conditions of Use
                  </AppText>{' '}
                  and{' '}
                  <AppText variant="xs" color={COLORS.primary.DEFAULT}>
                    Privacy Notice
                  </AppText>.
                </AppText>
              </View>

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <AppText color={COLORS.neutral[400]} style={styles.orText}>
                  Or continue with
                </AppText>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialRow}>
                <Pressable style={styles.socialBtn}>
                  <Ionicons name="logo-google" size={20} color={COLORS.neutral[900]} />
                  <AppText color={COLORS.neutral[900]} style={styles.socialText}>Google</AppText>
                </Pressable>

                <Pressable style={styles.socialBtn}>
                  <Ionicons name="logo-apple" size={20} color={COLORS.neutral[900]} />
                  <AppText color={COLORS.neutral[900]} style={styles.socialText}>Apple</AppText>
                </Pressable>
              </View>

              <Pressable onPress={() => router.push('/(auth)/login')} style={styles.loginContainer}>
                <AppText color={COLORS.neutral[500]}>
                  Already have an account?{' '}
                  <AppText color={COLORS.primary.DEFAULT} weight="bold">
                    Sign in
                  </AppText>
                </AppText>
              </Pressable>
            </View>
          </View>

          <AppText color="rgba(255,255,255,0.5)" style={styles.footer}>
            © 2025 ShopHub. All rights reserved.
          </AppText>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(124, 58, 237, 0.3)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: 100,
    left: -80,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(236, 72, 153, 0.2)',
  },
  decorativeCircle3: {
    position: 'absolute',
    top: '30%',
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  topGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING['2xl'],
  },

  logoSection: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: SPACING.xl,
  },
  logoContainer: {
    position: 'relative',
  },
  logoGradient: {
    width: 70,
    height: 70,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.primaryGlow,
  },
  logoGlow: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    backgroundColor: 'rgba(124, 58, 237, 0.3)',
    borderRadius: 25,
    zIndex: -1,
  },
  brandName: {
    marginTop: SPACING.lg,
    letterSpacing: 1,
  },
  tagline: {
    marginTop: SPACING.xs,
    fontSize: 14,
    letterSpacing: 0.5,
  },

  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: BORDERS.radius['2xl'],
    ...SHADOWS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  cardContent: {
    padding: SPACING.xl,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.xl,
  },

  inputContainer: {
    marginBottom: SPACING.sm,
  },
  inputField: {
    marginBottom: 0,
  },

  passwordHint: {
    marginTop: -4,
    marginBottom: SPACING.md,
  },

  premiumButton: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'visible',
    marginTop: SPACING.sm,
  },
  premiumButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  premiumButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: SPACING.xl,
    borderRadius: 12,
  },
  premiumButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumButtonText: {
    fontSize: 15,
    letterSpacing: 0.5,
  },
  premiumButtonIcon: {
    marginLeft: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 3,
    borderRadius: 8,
  },
  premiumButtonGlow: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    backgroundColor: 'rgba(124, 58, 237, 0.3)',
    borderRadius: 14,
    zIndex: -1,
  },

  termsBox: {
    marginTop: SPACING.md,
  },
  terms: {
    lineHeight: 18,
    textAlign: 'center',
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.neutral[300],
  },
  orText: {
    marginHorizontal: SPACING.md,
    fontSize: 13,
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
    backgroundColor: COLORS.neutral[50],
    borderRadius: BORDERS.radius.lg,
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
  },
  socialText: {
    marginLeft: 8,
    fontWeight: '600',
  },

  loginContainer: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },

  footer: {
    textAlign: 'center',
    marginTop: SPACING.xl,
    fontSize: 12,
  },
});

