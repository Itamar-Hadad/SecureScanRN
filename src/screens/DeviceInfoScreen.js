/**
 * DeviceInfoScreen.js
 *
 * Tab 2 of the main app. Shows hardware and software information about the device.
 *
 * Libraries used:
 *  - expo-device      : Device.modelName, Device.manufacturer, Device.osVersion, etc.
 *  - expo-application : Application.nativeApplicationVersion (app version from app.json)
 *  - expo-localization : Localization.locale (device language)
 *  - Platform         : built-in React Native module for OS name and version
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import * as Localization from 'expo-localization';

/** Reusable info row component */
function InfoRow({ icon, label, value }) {
  return (
    <View style={rowStyles.container}>
      <Text style={rowStyles.icon}>{icon}</Text>
      <View style={rowStyles.textContainer}>
        <Text style={rowStyles.label}>{label}</Text>
        <Text style={rowStyles.value}>{value || 'N/A'}</Text>
      </View>
    </View>
  );
}

export default function DeviceInfoScreen() {
  /**
   * Platform.OS returns 'ios' or 'android' — this is a built-in React Native constant.
   * Platform.Version returns the OS version number.
   *
   * expo-device gives more detailed hardware info:
   *   Device.modelName        → e.g. "iPhone 15 Pro", "Pixel 8"
   *   Device.manufacturer     → e.g. "Apple", "Google", "Samsung"
   *   Device.osVersion        → e.g. "17.1", "14"
   *
   * expo-application:
   *   Application.nativeApplicationVersion → "1.0.0" (from app.json)
   *
   * expo-localization:
   *   Localization.locale → e.g. "en-US", "he-IL"
   */

  const osVersion = Device.osVersion || String(Platform.Version);
  const osDisplay = `${Platform.OS === 'ios' ? 'iOS' : 'Android'} ${osVersion}`;

  const locales = Localization.getLocales();
  const locale = locales?.[0]?.languageTag || 'Unknown';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      {/* Device icon */}
      <View style={styles.headerCard}>
        <Text style={styles.headerIcon}>
          {Platform.OS === 'ios' ? '📱' : '🤖'}
        </Text>
        <Text style={styles.headerTitle}>Device Information</Text>
        <Text style={styles.headerSubtitle}>
          {Device.modelName || 'Unknown Device'}
        </Text>
      </View>

      {/* Hardware section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hardware</Text>
        <InfoRow icon="📱" label="Device Model" value={Device.modelName} />
        <InfoRow icon="🏭" label="Manufacturer" value={Device.manufacturer} />
      </View>

      {/* Software section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Software</Text>
        <InfoRow
          icon="💻"
          label="Operating System"
          value={Platform.OS === 'ios' ? 'iOS' : 'Android'}
        />
        <InfoRow icon="🔢" label="OS Version" value={osDisplay} />
        <InfoRow
          icon="📦"
          label="App Version"
          value={Application.nativeApplicationVersion || '1.0.0'}
        />
        <InfoRow icon="🌍" label="Language / Locale" value={locale} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  headerCard: {
    backgroundColor: '#16213e',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.3)',
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#a0a0c0',
  },
  section: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#a0a0c0',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
});

const rowStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  icon: {
    fontSize: 20,
    marginRight: 14,
    width: 28,
    textAlign: 'center',
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: '#7070a0',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  value: {
    fontSize: 15,
    color: '#e0e0f0',
    fontWeight: '500',
  },
});
