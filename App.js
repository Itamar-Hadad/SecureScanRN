/**
 * App.js
 *
 * The root component of the entire React Native application.
 * This is the entry point — React Native renders this component first.
 *
 * Its only job is to:
 *  1. Wrap the app in AppProvider (global state)
 *  2. Render AppNavigator (all screens and navigation)
 *
 * Keeping App.js small and delegating to other files is a best practice.
 */

import React from 'react';
import { AppProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    /**
     * AppProvider makes the shared state (qrConfig, userData, etc.)
     * available to every screen in the app.
     *
     * AppNavigator contains all the screens and the navigation logic.
     */
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
}
