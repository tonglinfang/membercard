import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { MEMBER_TYPES } from '../hooks/useMemberCard';

/**
 * Format an ISO date string to "YYYY/MM/DD".
 */
const fmtDate = (iso) => {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}/${m}/${day}`;
};

/**
 * Build the QR code payload — a compact JSON string that can be scanned
 * by a point-of-sale or gate system to verify membership.
 */
const buildQrPayload = (card) =>
  JSON.stringify({
    id:   card.memberId,
    name: card.name,
    type: card.memberType,
    exp:  fmtDate(card.expiresAt),
  });

/**
 * MemberCardView - Renders a visual membership card with a QR code overlay.
 *
 * Features:
 *  - Flip animation to toggle between card face and full-screen QR code
 *  - Member type colour theming via MEMBER_TYPES config
 *  - Cancel / deactivate action with confirmation
 *
 * @param {object}   card      - Membership card data object
 * @param {function} onCancel  - Callback invoked when the user cancels the card
 */
const MemberCardView = ({ card, onCancel }) => {
  // Toggle between compact card view and enlarged QR code view
  const [showQR, setShowQR] = useState(false);

  const typeConfig  = MEMBER_TYPES[card.memberType] || MEMBER_TYPES.standard;
  const qrPayload   = buildQrPayload(card);

  return (
    <div className="card-view-section">
      <h2 className="section-title">My Membership Card</h2>

      {/* ── Physical-style card ── */}
      <div
        className="member-card"
        style={{ '--card-accent': typeConfig.color }}
        onClick={() => setShowQR(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setShowQR(true)}
        title="Tap to show QR code"
      >
        {/* Card header: logo + member type badge */}
        <div className="card-header">
          <div className="card-logo">
            <span className="card-logo-icon">◆</span>
            <span className="card-logo-text">MemberCard</span>
          </div>
          <span className="card-type-badge">{typeConfig.label}</span>
        </div>

        {/* Member name and avatar */}
        <div className="card-identity">
          {card.pictureUrl && (
            <img
              className="card-avatar"
              src={card.pictureUrl}
              alt={card.displayName}
            />
          )}
          <div>
            <p className="card-member-name">{card.name}</p>
            <p className="card-line-name">{card.displayName}</p>
          </div>
        </div>

        {/* Card footer: ID, issue date, expiry */}
        <div className="card-footer">
          <div className="card-field">
            <span className="card-field-label">MEMBER ID</span>
            <span className="card-field-value card-field-mono">{card.memberId}</span>
          </div>
          <div className="card-dates">
            <div className="card-field">
              <span className="card-field-label">ISSUED</span>
              <span className="card-field-value">{fmtDate(card.appliedAt)}</span>
            </div>
            <div className="card-field">
              <span className="card-field-label">EXPIRES</span>
              <span className="card-field-value">{fmtDate(card.expiresAt)}</span>
            </div>
          </div>
        </div>

        {/* Hint to tap the card */}
        <div className="card-tap-hint">Tap to show QR code</div>
      </div>

      {/* Quick info: registered name, email, phone */}
      <div className="card-info-list">
        <div className="card-info-row">
          <span className="card-info-label">Name</span>
          <span className="card-info-value">{card.name}</span>
        </div>
        <div className="card-info-row">
          <span className="card-info-label">Email</span>
          <span className="card-info-value">{card.email}</span>
        </div>
        <div className="card-info-row">
          <span className="card-info-label">Phone</span>
          <span className="card-info-value">{card.phone}</span>
        </div>
      </div>

      {/* Cancel membership button */}
      <button className="btn btn-danger btn-block" onClick={onCancel}>
        Cancel Membership
      </button>

      {/* ── Full-screen QR Code overlay ── */}
      {showQR && (
        <div
          className="qr-overlay"
          onClick={() => setShowQR(false)}
          role="dialog"
          aria-label="Membership QR Code"
        >
          <div
            className="qr-modal"
            onClick={(e) => e.stopPropagation()} // Prevent backdrop click from closing when interacting with modal
          >
            <h3 className="qr-title">Scan to Verify</h3>
            <p className="qr-subtitle">{card.memberId}</p>

            {/* QR code encoding the member verification payload */}
            <div className="qr-code-wrapper">
              <QRCodeSVG
                value={qrPayload}
                size={220}
                level="M"
                includeMargin
                fgColor="#1a1a1a"
              />
            </div>

            <p className="qr-member-name">{card.name}</p>
            <p className="qr-member-type">{typeConfig.label} Member</p>
            <p className="qr-expires">Valid until {fmtDate(card.expiresAt)}</p>

            <button
              className="btn btn-secondary btn-block qr-close-btn"
              onClick={() => setShowQR(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberCardView;
