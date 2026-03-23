/**
 * AppNavigator.js
 *
 * Defines the entire navigation structure of the app.
 *
 * React Navigation concepts:
 *
 *  NavigationContainer:
 *    The root wrapper that must surround ALL navigation code.
 *    It holds the navigation state and makes it available to the whole app.
 *
 *  Stack Navigator (createNativeStackNavigator):
 *    Like a stack of cards. Each time you navigate to a screen, it's pushed
 *    onto the top of the stack. Going back pops the top card off.
 *    This is used for the main flow: Splash → QrScan → Auth → Success/Error → MainApp
 *
 *  Bottom Tab Navigator (createBottomTabNavigator):
 *    Shows a tab bar at the bottom of the screen with multiple tabs.
 *    Used inside MainApp for Home and Device Info tabs.
 *
 * Navigation structure:
 *   Stack:
 *     Splash        (auto-navigates after 2s)
 *     QrScan        (start destination after splash)
 *     Auth          (after QR resolved)
 *     Success       (on auth success, auto-navigates to MainApp)
 *     Error         (on auth failure)
 *     MainApp       (contains the Tab navigator)
 *       Tab:
 *         Home
 *         DeviceInfo
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, Platform } from 'react-native';

import SplashScreen from '../screens/SplashScreen';
import QrScanScreen from '../screens/QrScanScreen';
import AuthScreen from '../screens/AuthScreen';
import SuccessScreen from '../screens/SuccessScreen';
import ErrorScreen from '../screens/ErrorScreen';
import HomeScreen from '../screens/HomeScreen';
import DeviceInfoScreen from '../screens/DeviceInfoScreen';

// Create the navigator instances
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * The bottom tab navigator used inside the main authenticated area.
 * This is a component itself — it's nested inside the Stack navigator.
 */
function MainAppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        // Tab bar appearance
        tabBarStyle: {
          backgroundColor: '#16213e',
          borderTopColor: 'rgba(108, 99, 255, 0.3)',
          borderTopWidth: 1,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 80 : 60,
        },
        tabBarActiveTintColor: '#6c63ff',   // Color of active tab icon + label
        tabBarInactiveTintColor: '#606080', // Color of inactive tab
        headerStyle: {
          backgroundColor: '#1a1a2e',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          headerTitle: 'My Profile',
          // tabBarIcon is a function that returns a component
          // 'focused' is true when this tab is currently selected
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="DeviceInfo"
        component={DeviceInfoScreen}
        options={{
          title: 'Device',
          headerTitle: 'Device Info',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>📱</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * The root navigator — a Stack that contains all screens.
 */
export default function AppNavigator() {
  return (
    /**
     * NavigationContainer MUST wrap all navigation.
     * It's placed here (not in App.js) to keep App.js clean.
     */
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,  // Hide the default header for all screens
                               // (we build our own headers in each screen)
          contentStyle: { backgroundColor: '#1a1a2e' },
          animation: 'slide_from_right', // Screen transition animation
        }}
      >
        {/* Screens are listed in order. The FIRST screen is the initial route. */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="QrScan" component={QrScanScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Success" component={SuccessScreen} />
        <Stack.Screen name="Error" component={ErrorScreen} />

        {/* MainApp hosts the tab navigator — nested navigators work like this */}
        <Stack.Screen name="MainApp" component={MainAppTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
