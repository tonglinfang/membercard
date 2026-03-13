import React from 'react';

/**
 * LoadingScreen - Full-screen loading indicator shown during LIFF initialization
 * or while the user is being redirected to LINE Login.
 *
 * @param {string} message - Optional status message displayed below the spinner
 */
const LoadingScreen = ({ message = 'Loading...' }) => (
  <div className="loading-screen">
    <div className="loading-spinner" />
    <p className="loading-message">{message}</p>
  </div>
);

export default LoadingScreen;
