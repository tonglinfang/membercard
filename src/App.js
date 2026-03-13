import React, { useState } from 'react';
import './App.css';

import { useLiff }       from './hooks/useLiff';
import { useMemberCard } from './hooks/useMemberCard';

import LoadingScreen  from './components/LoadingScreen';
import ProfileCard    from './components/ProfileCard';
import MemberCardView from './components/MemberCardView';
import ApplyForm      from './components/ApplyForm';
import CardHistory    from './components/CardHistory';

// Identifiers for the three bottom-navigation tabs
const TAB = { PROFILE: 'profile', CARD: 'card', HISTORY: 'history' };

/**
 * App - Root component for the LINE Mini App membership card system.
 *
 * Lifecycle:
 *  1. LIFF initializes → user is redirected to LINE Login if not authenticated
 *  2. Profile is loaded from LINE
 *  3. User can apply for a membership card, view it (with QR code), or browse history
 */
function App() {
  const [activeTab,    setActiveTab]    = useState(TAB.CARD);
  const [showApplyForm, setShowApplyForm] = useState(false);

  // LIFF authentication and profile state
  const { isLoading: liffLoading, isLoggedIn, profile, error, logout } = useLiff();

  // Membership card state scoped to the current LINE user
  const {
    cards,
    isLoading: cardLoading,
    applyCard,
    cancelCard,
    getActiveCard,
  } = useMemberCard(profile?.userId);

  // ── Loading / error states ──────────────────────────────────────────────────

  if (liffLoading) {
    return <LoadingScreen message="Initializing LINE Mini App…" />;
  }

  if (error) {
    return (
      <div className="error-screen">
        <div className="error-icon">⚠️</div>
        <h2>Connection Error</h2>
        <p className="error-msg">{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  // LIFF ready but login redirect is in progress
  if (!isLoggedIn || !profile) {
    return <LoadingScreen message="Redirecting to LINE Login…" />;
  }

  // ── Event handlers ──────────────────────────────────────────────────────────

  const activeCard = getActiveCard();

  /**
   * Handle membership application form submission.
   * After a successful apply, navigate the user to the card tab.
   */
  const handleApply = async (formData) => {
    await applyCard(profile, formData);
    setShowApplyForm(false);
    setActiveTab(TAB.CARD);
  };

  /**
   * Cancel a membership card after user confirmation.
   */
  const handleCancel = (memberId) => {
    if (window.confirm('Are you sure you want to cancel this membership card?')) {
      cancelCard(memberId);
    }
  };

  /** Switch tabs and reset the apply form state. */
  const goTo = (tab) => {
    setActiveTab(tab);
    setShowApplyForm(false);
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="app">

      {/* ── Fixed top header ── */}
      <header className="app-header">
        <div className="header-inner">
          <span className="header-logo">◆</span>
          <h1 className="header-title">MemberCard</h1>
          <button className="header-logout" onClick={logout} aria-label="Logout">
            Sign out
          </button>
        </div>
      </header>

      {/* ── Scrollable main content ── */}
      <main className="app-main">

        {/* Profile tab */}
        {activeTab === TAB.PROFILE && (
          <ProfileCard profile={profile} activeCard={activeCard} />
        )}

        {/* My Card tab */}
        {activeTab === TAB.CARD && (
          <>
            {showApplyForm ? (
              /* Application form */
              <ApplyForm
                profile={profile}
                isLoading={cardLoading}
                onSubmit={handleApply}
                onCancel={() => setShowApplyForm(false)}
              />
            ) : activeCard ? (
              /* Active card with QR code */
              <MemberCardView
                card={activeCard}
                onCancel={() => handleCancel(activeCard.memberId)}
              />
            ) : (
              /* No card — prompt to apply */
              <div className="no-card-screen">
                <div className="no-card-icon">🪪</div>
                <h2>No Active Membership</h2>
                <p>Apply for a membership card and enjoy exclusive benefits.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowApplyForm(true)}
                >
                  Apply Now
                </button>
              </div>
            )}
          </>
        )}

        {/* History tab */}
        {activeTab === TAB.HISTORY && (
          <CardHistory cards={cards} onCancel={handleCancel} />
        )}

      </main>

      {/* ── Fixed bottom navigation ── */}
      <nav className="bottom-nav" aria-label="Main navigation">
        <button
          className={`nav-item ${activeTab === TAB.PROFILE ? 'nav-active' : ''}`}
          onClick={() => goTo(TAB.PROFILE)}
          aria-label="Profile"
        >
          <span className="nav-icon">👤</span>
          <span className="nav-label">Profile</span>
        </button>

        <button
          className={`nav-item ${activeTab === TAB.CARD ? 'nav-active' : ''}`}
          onClick={() => goTo(TAB.CARD)}
          aria-label="My Card"
        >
          <span className="nav-icon">🪪</span>
          <span className="nav-label">My Card</span>
          {/* Badge: show dot when an active card exists */}
          {activeCard && <span className="nav-badge" />}
        </button>

        <button
          className={`nav-item ${activeTab === TAB.HISTORY ? 'nav-active' : ''}`}
          onClick={() => goTo(TAB.HISTORY)}
          aria-label="History"
        >
          <span className="nav-icon">📋</span>
          <span className="nav-label">History</span>
          {/* Badge: card count */}
          {cards.length > 0 && (
            <span className="nav-count">{cards.length}</span>
          )}
        </button>
      </nav>

    </div>
  );
}

export default App;
