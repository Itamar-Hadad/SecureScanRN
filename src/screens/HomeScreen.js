/**
 * HomeScreen.js
 *
 * Tab 1 of the main app. Displays the authenticated user's profile information.
 *
 * Concepts:
 *  - FlatList   : efficient scrollable list (like RecyclerView in Android)
 *  - useContext : access shared app state
 *  - formatDate : custom utility to format ISO date strings
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useAppContext } from '../context/AppContext';
import { formatDate } from '../utils/dateFormatter';

/**
 * A single info row (label + value pair).
 * This is a small "child component" defined in the same file.
 * In React Native, you can define multiple components per file.
 */
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

export default function HomeScreen() {
  const { userData } = useAppContext();

  if (!userData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noDataText}>No user data available.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      {/* Header card with user's name */}
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          {/* Show initials inside a circle, like many apps do */}
          <Text style={styles.avatarText}>
            {getInitials(userData.full_name)}
          </Text>
        </View>
        <Text style={styles.fullName}>{userData.full_name}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {userData.account_status?.toUpperCase() || 'UNKNOWN'}
          </Text>
        </View>
      </View>

      {/* Info section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Information</Text>

        <InfoRow icon="✉️" label="Email" value={userData.email} />
        <InfoRow icon="🏢" label="Company" value={userData.company} />
        <InfoRow icon="🏬" label="Department" value={userData.department} />
        <InfoRow icon="🪪" label="User ID" value={userData.user_id} />
        <InfoRow
          icon="📅"
          label="Account Created"
          value={formatDate(userData.account_creation_date)}
        />
      </View>
    </ScrollView>
  );
}

/** Returns the first letter of each word in a name, up to 2 letters. */
function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a2e',
  },
  noDataText: {
    color: '#a0a0c0',
    fontSize: 16,
  },
  headerCard: {
    backgroundColor: '#16213e',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.3)',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,        // Makes it a circle (half of width/height)
    backgroundColor: '#6c63ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  fullName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  statusBadge: {
    backgroundColor: 'rgba(74, 222, 128, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.4)',
  },
  statusText: {
    color: '#4ade80',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
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
    flexDirection: 'row',     // Place icon and text side by side
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
