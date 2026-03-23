/**
 * SplashScreen.js
 *
 * The first screen the user sees when the app launches.
 * Shows the app name and branding, then automatically navigates
 * to the QR scanner after a short delay.
 *
 * React Native Concepts used here:
 *  - View         : a container (like a <div> in HTML)
 *  - Text         : displays text
 *  - StyleSheet   : defines styles (like CSS but as a JavaScript object)
 *  - useEffect    : runs code after the component mounts (appears on screen)
 *  - Animated     : React Native's built-in animation system
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';

export default function SplashScreen({ navigation }) {
  // useRef creates a value that persists across re-renders without causing re-renders.
  // Here we use it to store an Animated.Value for the fade-in effect.
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Run a parallel animation: fade in + scale up simultaneously
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,          // Final opacity: fully visible
        duration: 800,       // 800 milliseconds
        useNativeDriver: true, // Runs on the native thread for better performance
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,          // Final scale: normal size
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // After 2 seconds, navigate to the QR scanner
    const timer = setTimeout(() => {
      // 'replace' removes SplashScreen from the navigation stack,
      // so pressing Back won't return to it.
      navigation.replace('QrScan');
    }, 2000);

    // Cleanup: cancel the timer if the component unmounts before it fires
    return () => clearTimeout(timer);
  }, []); // Empty array means this runs only once when the component mounts

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* QR icon made with Unicode character */}
        <Text style={styles.icon}>⬛</Text>
        <Text style={styles.title}>SecureScan</Text>
        <Text style={styles.subtitle}>Secure QR Authentication</Text>
      </Animated.View>

      <Animated.Text style={[styles.poweredBy, { opacity: fadeAnim }]}>
        Powered by Unixi
      </Animated.Text>
    </View>
  );
}

// StyleSheet.create() is React Native's equivalent of CSS.
// Styles are written as JavaScript objects with camelCase property names.
const styles = StyleSheet.create({
  container: {
    flex: 1,                    // Fill the entire screen (like height: 100%, width: 100%)
    backgroundColor: '#1a1a2e',
    alignItems: 'center',       // Center children horizontally
    justifyContent: 'center',   // Center children vertically
  },
  content: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#a0a0c0',
    marginTop: 8,
    letterSpacing: 1,
  },
  poweredBy: {
    position: 'absolute',   // Positioned relative to the parent container
    bottom: 40,
    color: '#606080',
    fontSize: 13,
  },
});
