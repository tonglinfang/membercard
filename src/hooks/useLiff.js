import { useState, useEffect } from 'react';
import liff from '@line/liff';

// Read LIFF ID from environment variable; set REACT_APP_LIFF_ID in .env
const LIFF_ID = process.env.REACT_APP_LIFF_ID || 'YOUR_LIFF_ID_HERE';

/**
 * useLiff - Custom hook for LIFF SDK initialization and user authentication.
 *
 * Initializes LIFF on mount, redirects unauthenticated users to LINE Login,
 * and fetches the user profile after successful login.
 */
export const useLiff = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        // Initialize LIFF SDK with the app's LIFF ID
        await liff.init({ liffId: LIFF_ID });

        if (!liff.isLoggedIn()) {
          // Redirect to LINE Login if the user is not authenticated
          liff.login();
          return;
        }

        // Fetch the authenticated user's LINE profile
        const userProfile = await liff.getProfile();
        setProfile(userProfile);
        setIsLoggedIn(true);
      } catch (err) {
        setError(err.message || 'Failed to initialize LIFF');
      } finally {
        setIsLoading(false);
      }
    };

    initializeLiff();
  }, []);

  /**
   * Log out the current user and clear local profile state.
   */
  const logout = () => {
    liff.logout();
    setIsLoggedIn(false);
    setProfile(null);
    window.location.reload();
  };

  return { isLoading, isLoggedIn, profile, error, logout };
};
