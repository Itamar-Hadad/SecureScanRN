/**
 * SuccessScreen.js
 *
 * Shown after successful authentication.
 * Displays a confirmation message and automatically navigates
 * to the main application after 2 seconds.
 *
 * Concepts:
 *  - useEffect with cleanup  : start a timer that clears itself if screen unmounts
 *  - navigation.replace      : replace current screen (can't go back to it)
 *  - Animated                : smooth fade + scale-in animation
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import { useAppContext } from '../context/AppContext';

export default function SuccessScreen({ navigation }) {
  const { userData } = useAppContext();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Spring animation: bouncy scale-up + fade in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-navigate to the main app after 2 seconds
    const timer = setTimeout(() => {
      // 'replace' means we remove Success from the stack.
      // This prevents the user from pressing Back to return here.
      navigation.replace('MainApp');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f3460" />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.checkmark}>✓</Text>
        <Text style={styles.title}>Authentication Successful</Text>
        <Text style={styles.name}>{userData?.full_name}</Text>
        <Text style={styles.email}>{userData?.email}</Text>
        <Text style={styles.redirectText}>Redirecting to app...</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f3460',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  content: {
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 80,
    color: '#4ade80',
    marginBottom: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  name: {
    fontSize: 20,
    color: '#a0f0c0',
    fontWeight: '600',
    marginBottom: 6,
  },
  email: {
    fontSize: 14,
    color: '#80c0a0',
    marginBottom: 40,
  },
  redirectText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    fontStyle: 'italic',
  },
});
