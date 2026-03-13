import React from 'react';
import { MEMBER_TYPES } from '../hooks/useMemberCard';

/**
 * Format an ISO date string to a short "MMM D, YYYY" representation.
 */
const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

/**
 * StatusBadge - Renders a coloured pill for a card's status.
 *
 * @param {string} status - "active" | "cancelled" | "expired"
 */
const StatusBadge = ({ status }) => {
  const map = {
    active:    { label: 'Active',    color: '#198754' },
    cancelled: { label: 'Cancelled', color: '#dc3545' },
    expired:   { label: 'Expired',   color: '#6c757d' },
  };
  const { label, color } = map[status] || map.expired;
  return (
    <span className="status-badge" style={{ backgroundColor: color }}>
      {label}
    </span>
  );
};

/**
 * CardHistory - Lists all membership cards (active, cancelled, expired)
 * for the current user.
 *
 * Displays cards in reverse-chronological order. The active card shows a
 * Cancel button; past cards are read-only.
 *
 * @param {Array}    cards     - Full card list from useMemberCard
 * @param {function} onCancel  - Called with a memberId to cancel that card
 */
const CardHistory = ({ cards, onCancel }) => {
  if (!cards || cards.length === 0) {
    return (
      <div className="history-empty">
        <div className="history-empty-icon">📋</div>
        <h3>No Card History</h3>
        <p>Your past and current membership cards will appear here.</p>
      </div>
    );
  }

  // Show most recently applied card first
  const sorted = [...cards].sort(
    (a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)
  );

  return (
    <div className="history-section">
      <h2 className="section-title">Card History</h2>
      <p className="section-desc">{cards.length} card{cards.length !== 1 ? 's' : ''} total</p>

      <ul className="history-list">
        {sorted.map((card) => {
          const typeCfg = MEMBER_TYPES[card.memberType] || MEMBER_TYPES.standard;

          return (
            <li key={card.memberId} className="history-item">
              {/* Coloured accent bar indicating membership type */}
              <div
                className="history-accent"
                style={{ backgroundColor: typeCfg.color }}
              />

              <div className="history-body">
                {/* Header row: member ID + status badge */}
                <div className="history-row history-row-header">
                  <span className="history-member-id">{card.memberId}</span>
                  <StatusBadge status={card.status} />
                </div>

                {/* Name and type */}
                <div className="history-row">
                  <span className="history-name">{card.name}</span>
                  <span
                    className="history-type"
                    style={{ color: typeCfg.color }}
                  >
                    {typeCfg.label}
                  </span>
                </div>

                {/* Dates */}
                <div className="history-row history-row-dates">
                  <span className="history-date-item">
                    <span className="history-date-label">Applied</span>
                    <span className="history-date-value">{fmtDate(card.appliedAt)}</span>
                  </span>
                  <span className="history-date-item">
                    <span className="history-date-label">Expires</span>
                    <span className="history-date-value">{fmtDate(card.expiresAt)}</span>
                  </span>
                </div>

                {/* Cancel button — only shown for active cards */}
                {card.status === 'active' && (
                  <button
                    className="btn btn-danger btn-sm history-cancel-btn"
                    onClick={() => onCancel(card.memberId)}
                  >
                    Cancel Membership
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CardHistory;
