import { useState, useEffect, useCallback } from 'react';

// localStorage key prefix; actual key is scoped per LINE user ID
const STORAGE_KEY = 'mc_cards';

// Membership type options with display labels and validity period
export const MEMBER_TYPES = {
  standard: { label: 'Standard',  color: '#6c757d', months: 12 },
  silver:   { label: 'Silver',    color: '#adb5bd', months: 12 },
  gold:     { label: 'Gold',      color: '#ffc107', months: 12 },
  platinum: { label: 'Platinum',  color: '#0dcaf0', months: 24 },
};

/**
 * Generate a unique member ID in the format "MC-<timestamp>-<random>".
 */
const generateMemberId = () => {
  const ts  = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `MC-${ts}-${rnd}`;
};

/**
 * Calculate an expiry date by adding `months` to today.
 * Returns an ISO 8601 string.
 */
const calcExpiryDate = (months) => {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString();
};

/**
 * useMemberCard - Manages membership card CRUD operations backed by localStorage.
 *
 * @param {string|null} userId - LINE user ID; loading is skipped when null.
 */
export const useMemberCard = (userId) => {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Storage key scoped to the current LINE user
  const storageKey = userId ? `${STORAGE_KEY}_${userId}` : null;

  // Load persisted cards whenever the user ID becomes available
  useEffect(() => {
    if (!storageKey) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setCards(JSON.parse(raw));
    } catch {
      // Ignore malformed stored data
    }
  }, [storageKey]);

  /** Persist the card list and update state. */
  const persist = useCallback(
    (updatedCards) => {
      if (!storageKey) return;
      localStorage.setItem(storageKey, JSON.stringify(updatedCards));
      setCards(updatedCards);
    },
    [storageKey]
  );

  /**
   * Submit a new membership card application.
   * Simulates a 1-second network delay before saving.
   *
   * @param {object} profile  - LINE profile ({ userId, displayName, pictureUrl })
   * @param {object} formData - Form values ({ name, email, phone, memberType })
   * @returns {Promise<object>} The newly created card object
   */
  const applyCard = (profile, formData) => {
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const memberType = formData.memberType || 'standard';
        const months     = MEMBER_TYPES[memberType]?.months ?? 12;

        const newCard = {
          memberId:    generateMemberId(),
          lineUserId:  profile.userId,
          displayName: profile.displayName,
          pictureUrl:  profile.pictureUrl,
          name:        formData.name,
          email:       formData.email,
          phone:       formData.phone,
          memberType,
          status:      'active',
          appliedAt:   new Date().toISOString(),
          expiresAt:   calcExpiryDate(months),
        };

        persist([...cards, newCard]);
        setIsLoading(false);
        resolve(newCard);
      }, 1000);
    });
  };

  /**
   * Cancel (deactivate) a membership card by its member ID.
   *
   * @param {string} memberId - The ID of the card to cancel
   */
  const cancelCard = (memberId) => {
    const updated = cards.map((c) =>
      c.memberId === memberId ? { ...c, status: 'cancelled' } : c
    );
    persist(updated);
  };

  /**
   * Return the first card with "active" status, or null if none exists.
   */
  const getActiveCard = () => cards.find((c) => c.status === 'active') ?? null;

  return { cards, isLoading, applyCard, cancelCard, getActiveCard };
};
