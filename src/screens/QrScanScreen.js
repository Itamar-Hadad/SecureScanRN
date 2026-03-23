/**
 * QrScanScreen.js
 *
 * The main QR code scanning screen.
 *
 * Flow:
 *  1. Request camera permission from the device.
 *  2. Open the camera with a barcode scanner overlay.
 *  3. When a QR code is detected, parse its content.
 *  4. Send the token to the backend (/qr/resolve).
 *  5. Navigate to the Auth screen with the returned user data.
 *
 * React Native / Expo concepts used:
 *  - expo-camera / CameraView  : access the device camera
 *  - useState                  : local component state
 *  - useEffect                 : side effects (permission request)
 *  - useCallback               : memoize a function to avoid re-creation on every render
 *  - useRef                    : store a mutable value without triggering re-render
 *  - ActivityIndicator         : built-in loading spinner
 *  - Alert                     : native dialog box
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useFocusEffect } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import { parseQrCode } from '../utils/qrParser';
import { resolveQrToken } from '../api/apiService';

export default function QrScanScreen({ navigation }) {
  // permission: object with { granted: bool }
  // requestPermission: function to ask the user for camera access
  const [permission, requestPermission] = useCameraPermissions();

  const { setQrConfig, setUserData, isLoading, setLoading } = useAppContext();

  // Prevents processing multiple QR codes at the same time
  const isProcessingRef = useRef(false);

  // Cooldown flag — scanning is disabled briefly when the screen regains focus
  // so the camera doesn't instantly re-scan the same QR code still in frame
  const [scanEnabled, setScanEnabled] = useState(false);

  // Ask for camera permission when the screen first loads
  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  // Reset the processing lock every time this screen comes back into focus.
  // Without this, navigating back from Error/Auth leaves isProcessingRef=true
  // and the camera silently ignores all QR codes.
  useFocusEffect(
    useCallback(() => {
      isProcessingRef.current = false;
      setLoading(false);
      setScanEnabled(false);
      // Short delay before enabling scanning so the camera doesn't
      // instantly re-scan the same QR code that's still in frame
      const timer = setTimeout(() => setScanEnabled(true), 1200);
      return () => clearTimeout(timer);
    }, [])
  );

  /**
   * Called by CameraView every time a barcode is detected.
   * useCallback prevents this function from being recreated on every render,
   * which would cause the camera to re-register the handler unnecessarily.
   */
  const handleBarCodeScanned = useCallback(async ({ data }) => {
    // If we're already processing a QR code, ignore this scan
    if (isProcessingRef.current || isLoading) return;

    // Parse the raw QR text into { baseUrl, token }
    const config = parseQrCode(data);

    if (!config) {
      // Lock while alert is showing so the camera doesn't keep re-triggering
      isProcessingRef.current = true;
      Alert.alert(
        'Invalid QR Code',
        'This QR code is not a valid SecureScan code. Please try another.',
        [{ text: 'OK', onPress: () => { isProcessingRef.current = false; } }],
      );
      return;
    }

    // Lock processing so we don't scan again while waiting
    isProcessingRef.current = true;
    setLoading(true);
    setQrConfig(config);

    try {
      // Call the backend to resolve the QR token to user info
      const result = await resolveQrToken(config.baseUrl, config.token);

      if (result.success) {
        setUserData(result.data);
        // Navigate to Auth screen — user data is now in context
        navigation.navigate('Auth');
      } else {
        Alert.alert('Error', result.error || 'Failed to resolve QR code.');
        isProcessingRef.current = false; // Unlock scanning so user can retry
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred.');
      isProcessingRef.current = false;
    } finally {
      setLoading(false);
    }
  }, [isLoading]);

  // ─── Render States ────────────────────────────────────────────────────────

  // Still waiting to know if permission was granted
  if (!permission) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#6c63ff" />
        <Text style={styles.statusText}>Requesting camera permission...</Text>
      </View>
    );
  }

  // User denied camera permission
  if (!permission.granted) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorIcon}>📷</Text>
        <Text style={styles.errorTitle}>Camera Access Required</Text>
        <Text style={styles.errorBody}>
          SecureScan needs camera access to scan QR codes.
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ─── Main Camera UI ───────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* CameraView fills the screen and scans barcodes in real-time */}
      <CameraView
        style={StyleSheet.absoluteFillObject} // Stretch to fill the parent View
        facing="back"                          // Use the rear camera
        onBarcodeScanned={scanEnabled && !isLoading ? handleBarCodeScanned : undefined}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],  // Only look for QR codes, ignore other barcodes
        }}
      />

      {/* Dark overlay with a transparent cut-out in the middle */}
      <View style={styles.overlay}>
        <View style={styles.overlayTop} />
        <View style={styles.overlayMiddle}>
          <View style={styles.overlaySide} />
          {/* The scanning frame — this is the transparent window */}
          <View style={styles.scanFrame}>
            {/* Corner decorations */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <View style={styles.overlaySide} />
        </View>
        <View style={styles.overlayBottom}>
          {isLoading ? (
            <>
              <ActivityIndicator size="large" color="#6c63ff" />
              <Text style={styles.loadingText}>Connecting to server...</Text>
            </>
          ) : (
            <Text style={styles.instructionText}>
              Point your camera at a SecureScan QR code
            </Text>
          )}
        </View>
      </View>

      {/* Top title bar */}
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>SecureScan</Text>
      </View>
    </View>
  );
}

const SCAN_FRAME_SIZE = 260;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a2e',
    padding: 30,
  },
  statusText: {
    color: '#a0a0c0',
    marginTop: 16,
    fontSize: 15,
  },
  errorIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorBody: {
    fontSize: 15,
    color: '#a0a0c0',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#6c63ff',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Camera overlay pieces
  overlay: {
    flex: 1,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  overlayMiddle: {
    flexDirection: 'row', // Arrange children side by side
    height: SCAN_FRAME_SIZE,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  scanFrame: {
    width: SCAN_FRAME_SIZE,
    height: SCAN_FRAME_SIZE,
    borderRadius: 4,
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 30,
  },
  instructionText: {
    color: '#ffffff',
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 40,
    opacity: 0.85,
  },
  loadingText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 15,
  },

  // Corner brackets on the scan frame
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#6c63ff',
    borderWidth: 3,
  },
  topLeft: {
    top: 0, left: 0,
    borderRightWidth: 0, borderBottomWidth: 0,
    borderTopLeftRadius: 4,
  },
  topRight: {
    top: 0, right: 0,
    borderLeftWidth: 0, borderBottomWidth: 0,
    borderTopRightRadius: 4,
  },
  bottomLeft: {
    bottom: 0, left: 0,
    borderRightWidth: 0, borderTopWidth: 0,
    borderBottomLeftRadius: 4,
  },
  bottomRight: {
    bottom: 0, right: 0,
    borderLeftWidth: 0, borderTopWidth: 0,
    borderBottomRightRadius: 4,
  },
  titleBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
    paddingBottom: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  titleText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
