import { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AppText from '@/components/AppText';
import AppButton from '@/components/AppButton';
import InputField from '@/components/InputField';
import { BORDERS, COLORS, SHADOWS, SPACING } from '@/lib/theme';
import { passwordApi } from '@/lib/api';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!token.trim()) {
      Alert.alert('Missing Token', 'Paste the reset token from your email.');
      return;
    }

    if (!password || password.length < 6) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match', 'Please re-enter your password.');
      return;
    }

    try {
      setLoading(true);
      await passwordApi.resetPassword({
        token: token.trim(),
        password,
        password_confirmation: confirmPassword,
      });
      Alert.alert('Password reset', 'You can now sign in with your new password.', [
        {
          text: 'Go to login',
          onPress: () => router.replace('/(auth)/login'),
        },
      ]);
    } catch (error) {
      Alert.alert(
        'Reset failed',
        error instanceof Error ? error.message : 'Unable to reset password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460'] as [string, string, string]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <AppText variant="2xl" weight="bold" color={COLORS.neutral[900]} style={styles.title}>
              Reset Password
            </AppText>
            <AppText color={COLORS.neutral[500]} style={styles.subtitle}>
              Paste the token from your email and choose a new password.
            </AppText>

            <InputField
              label="Reset Token"
              value={token}
              onChangeText={setToken}
              placeholder="Paste token"
              autoCapitalize="none"
              leftIcon={<Ionicons name="key-outline" size={20} color={COLORS.primary.DEFAULT} />}
              containerStyle={styles.input}
            />

            <InputField
              label="New Password"
              value={password}
              onChangeText={setPassword}
              placeholder="At least 6 characters"
              secureTextEntry={!showPassword}
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color={COLORS.primary.DEFAULT} />}
              rightIcon={
                <Pressable onPress={() => setShowPassword((value) => !value)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={COLORS.primary.DEFAULT}
                  />
                </Pressable>
              }
              containerStyle={styles.input}
            />

            <InputField
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Re-enter password"
              secureTextEntry={!showConfirmPassword}
              leftIcon={<Ionicons name="shield-checkmark-outline" size={20} color={COLORS.primary.DEFAULT} />}
              rightIcon={
                <Pressable onPress={() => setShowConfirmPassword((value) => !value)}>
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={COLORS.primary.DEFAULT}
                  />
                </Pressable>
              }
              containerStyle={styles.input}
            />

            <AppButton
              title="Reset Password"
              onPress={handleSubmit}
              loading={loading}
              fullWidth
              size="lg"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f3460',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  card: {
    backgroundColor: COLORS.neutral[0],
    borderRadius: BORDERS.radius.xl,
    padding: SPACING.xl,
    ...SHADOWS.lg,
  },
  title: {
    marginBottom: SPACING.sm,
  },
  subtitle: {
    marginBottom: SPACING.xl,
  },
  input: {
    marginBottom: SPACING.lg,
  },
});
