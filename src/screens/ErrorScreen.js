/**
 * ErrorScreen.js
 *
 * Shown when authentication fails.
 * Offers two options:
 *  1. Retry: go back to the password screen
 *  2. Scan Again: go all the way back to QR scanner and reset session
 *
 * Concepts:
 *  - route.params    : data passed from the previous screen during navigation
 *  - navigation.pop  : go back one screen in the stack
 *  - navigation.popToTop: go all the way back to the first screen in the stack
 */

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useAppContext } from '../context/AppContext';

export default function ErrorScreen({ navigation, route }) {
  const { resetSession } = useAppContext();

  // route.params contains data passed from AuthScreen when navigating here
  const errorMessage = route.params?.errorMessage || 'Authentication failed. Please try again.';

  function handleRetry() {
    // Go back to the Auth screen so the user can try a different password.
    // navigation.goBack() or navigation.pop() both work here.
    navigation.goBack();
  }

  function handleScanAgain() {
    // Clear all session data (user info, config, etc.)
    resetSession();
    // Go back to the very first screen in the stack (QrScan)
    navigation.popToTop();
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2d0a0a" />

      <Text style={styles.errorIcon}>✗</Text>
      <Text style={styles.title}>Sign In Failed</Text>
      <Text style={styles.errorMessage}>{errorMessage}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.scanButton} onPress={handleScanAgain}>
          <Text style={styles.scanButtonText}>Scan Different QR Code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2d0a0a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  errorIcon: {
    fontSize: 80,
    color: '#ff6b6b',
    marginBottom: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  errorMessage: {
    fontSize: 15,
    color: '#ffaaaa',
    textAlign: 'center',
    marginBottom: 50,
    lineHeight: 22,
    maxWidth: 300,
  },
  buttonContainer: {
    width: '100%',
    gap: 12, // Space between buttons (React Native 0.71+)
  },
  retryButton: {
    backgroundColor: '#ff6b6b',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
  scanButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  scanButtonText: {
    color: '#ffffff',
    fontSize: 15,
  },
});
