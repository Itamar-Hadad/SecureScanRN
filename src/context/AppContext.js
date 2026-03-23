/**
 * AppContext.js
 *
 * Global state management using React Context.
 *
 * This replaces the Android ViewModel + SharedViewModel pattern.
 * Any screen in the app can read from or write to this shared state
 * by calling the useAppContext() hook.
 *
 * State stored here:
 *  - qrConfig    : { baseUrl, token } parsed from the QR code
 *  - userData    : user profile returned from /qr/resolve
 *  - isLoading   : whether a network request is in progress
 *  - errorMessage: general error messages for display
 *
 * Functions exposed:
 *  - setQrConfig, setUserData, setLoading, setErrorMessage, resetSession
 */

import React, { createContext, useContext, useState } from 'react';

// 1. Create the context object
const AppContext = createContext(null);

/**
 * AppProvider wraps the entire app (in App.js) so all screens can access shared state.
 */
export function AppProvider({ children }) {
  const [qrConfig, setQrConfig] = useState(null);       // { baseUrl, token }
  const [userData, setUserData] = useState(null);        // user profile from API
  const [isLoading, setLoading] = useState(false);       // network loading indicator
  const [errorMessage, setErrorMessage] = useState(null); // error string or null

  /**
   * Clears all state so the user can start over from the QR scan screen.
   */
  function resetSession() {
    setQrConfig(null);
    setUserData(null);
    setLoading(false);
    setErrorMessage(null);
  }

  // The value object is what all consumers will receive
  const value = {
    qrConfig,
    setQrConfig,
    userData,
    setUserData,
    isLoading,
    setLoading,
    errorMessage,
    setErrorMessage,
    resetSession,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * Custom hook — instead of writing useContext(AppContext) everywhere,
 * screens just call useAppContext().
 */
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used inside AppProvider');
  }
  return context;
}
