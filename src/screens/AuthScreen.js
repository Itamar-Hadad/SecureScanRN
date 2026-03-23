/**
 * AuthScreen.js
 *
 * The password entry screen shown after a QR code is resolved.
 *
 * Displays the user's email and asks for a password.
 * Sends the password to the backend for validation.
 *
 * React Native concepts used:
 *  - TextInput       : text input field (like <input> in HTML)
 *  - KeyboardAvoidingView : moves the UI up when the keyboard appears
 *  - Platform        : lets you check if the app is running on iOS or Android
 *  - TouchableOpacity: a pressable element that dims when touched
 *  - ScrollView      : scrollable container (in case screen is too small)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useAppContext } from '../context/AppContext';
import { validatePassword } from '../api/apiService';

export default function AuthScreen({ navigation }) {
  const { qrConfig, userData, isLoading, setLoading } = useAppContext();

  // Local state: only this component needs to know the current password input value
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(null); // inline error message

  const isSignInEnabled = password.length >= 4 && !isLoading;

  async function handleSignIn() {
    if (!isSignInEnabled) return;

    setAuthError(null);
    setLoading(true);

    try {
      const result = await validatePassword(
        qrConfig.baseUrl,
        userData.user_id,
        password,
      );

      if (result.success) {
        // Navigate to Success screen, passing no data (it's all in context)
        navigation.navigate('Success');
      } else {
        // Navigate to Error screen, passing the error message as a route param
        navigation.navigate('Error', { errorMessage: result.error });
      }
    } catch (err) {
      setAuthError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    /**
     * KeyboardAvoidingView automatically shifts the screen content upward
     * when the on-screen keyboard appears, so the input isn't hidden.
     *
     * behavior="padding" works best on iOS.
     * On Android, the system handles this automatically (behavior="height").
     */
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled" // Allows tapping buttons while keyboard is open
      >
        {/* Lock icon */}
        <Text style={styles.icon}>🔒</Text>

        <Text style={styles.title}>Authentication</Text>
        <Text style={styles.subtitle}>Enter your password to continue</Text>

        {/* User email (read-only display) */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Signing in as</Text>
          <Text style={styles.emailText}>{userData?.email || 'Unknown'}</Text>
        </View>

        {/* Password input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#606080"
            value={password}
            onChangeText={setPassword}    // Called on every keystroke
            secureTextEntry={true}        // Hides characters (shows dots)
            autoCapitalize="none"         // Don't auto-capitalize the first letter
            autoCorrect={false}           // Don't suggest corrections
            returnKeyType="done"          // Shows "Done" on the keyboard's return key
            onSubmitEditing={handleSignIn} // Pressing "Done" triggers sign in
          />
        </View>

        {/* Inline error message (alternative to navigating to Error screen) */}
        {authError && (
          <Text style={styles.inlineError}>{authError}</Text>
        )}

        {/* Sign In button */}
        <TouchableOpacity
          style={[styles.button, !isSignInEnabled && styles.buttonDisabled]}
          onPress={handleSignIn}
          disabled={!isSignInEnabled}
          activeOpacity={0.8} // How transparent the button becomes when pressed
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={isLoading}
        >
          <Text style={styles.backButtonText}>← Scan Different QR Code</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  container: {
    flexGrow: 1,          // Allows the ScrollView content to grow to fill space
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  icon: {
    fontSize: 56,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#a0a0c0',
    marginBottom: 32,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(108, 99, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.3)',
  },
  cardLabel: {
    fontSize: 12,
    color: '#a0a0c0',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  emailText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 13,
    color: '#a0a0c0',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    backgroundColor: '#16213e',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  inlineError: {
    color: '#ff6b6b',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 8,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: '#6c63ff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#6c63ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,  // Android shadow
  },
  buttonDisabled: {
    backgroundColor: '#3a3a5a',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 24,
    padding: 8,
  },
  backButtonText: {
    color: '#6c63ff',
    fontSize: 14,
  },
});
