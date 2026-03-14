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

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert('Missing Email', 'Please enter your email address.');
      return;
    }

    try {
      setLoading(true);
      await passwordApi.requestReset(email.trim());
      Alert.alert(
        'Check your email',
        'If the account exists, reset instructions have been sent.',
        [
          {
            text: 'Enter reset token',
            onPress: () => router.push('/(auth)/reset-password'),
          },
          {
            text: 'Back to login',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Reset unavailable',
        error instanceof Error ? error.message : 'Please try again.'
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
              Forgot Password
            </AppText>
            <AppText color={COLORS.neutral[500]} style={styles.subtitle}>
              Enter the email address linked to your account.
            </AppText>

            <InputField
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="demo@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Ionicons name="mail-outline" size={20} color={COLORS.primary.DEFAULT} />}
              containerStyle={styles.input}
            />

            <AppButton
              title="Send Reset Instructions"
              onPress={handleSubmit}
              loading={loading}
              fullWidth
              size="lg"
            />

            <Pressable onPress={() => router.push('/(auth)/reset-password')} style={styles.link}>
              <AppText color={COLORS.primary.DEFAULT} weight="semibold">
                Already have a token? Reset password
              </AppText>
            </Pressable>
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
    marginBottom: SPACING.xl,
  },
  link: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
});
