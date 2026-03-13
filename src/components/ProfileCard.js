import React from 'react';

/**
 * Format an ISO date string to a human-readable "Month DD, YYYY" format.
 */
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

/**
 * ProfileCard - Displays the authenticated LINE user's profile information.
 *
 * Shows avatar, display name, user ID, and account status badge.
 *
 * @param {object} profile        - LINE profile object from LIFF getProfile()
 * @param {object|null} activeCard - The user's active membership card (or null)
 */
const ProfileCard = ({ profile, activeCard }) => {
  if (!profile) return null;

  return (
    <div className="profile-section">
      {/* User avatar with LINE green border */}
      <div className="profile-avatar-wrapper">
        <img
          className="profile-avatar"
          src={profile.pictureUrl}
          alt={`${profile.displayName}'s avatar`}
          onError={(e) => {
            // Fallback to a placeholder if the LINE avatar fails to load
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.displayName)}&background=00B900&color=fff&size=96`;
          }}
        />
        <span className="profile-status-dot" title="Online" />
      </div>

      {/* Display name and LINE user ID */}
      <h2 className="profile-name">{profile.displayName}</h2>
      <p className="profile-userid" title="LINE User ID">
        ID: <code>{profile.userId.slice(0, 20)}…</code>
      </p>

      {/* Account linked badge when a membership card exists */}
      <div className="profile-badges">
        <span className="badge badge-line">LINE Verified</span>
        {activeCard && (
          <span className="badge" style={{ backgroundColor: '#198754' }}>
            Active Member
          </span>
        )}
      </div>

      {/* Membership summary card if available */}
      {activeCard && (
        <div className="profile-member-summary">
          <div className="summary-row">
            <span className="summary-label">Member ID</span>
            <span className="summary-value">{activeCard.memberId}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Type</span>
            <span className="summary-value summary-capitalize">{activeCard.memberType}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Expires</span>
            <span className="summary-value">{formatDate(activeCard.expiresAt)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
