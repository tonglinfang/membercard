import { useEffect, useState } from 'react';
import { initLiff, resetInitLiff, liff } from '../lib/liff';
import type { LineProfile } from '../types/line';

type LiffState = {
  ready: boolean;
  loggedIn: boolean;
  profile: LineProfile | null;
  error: string | null;
  isInClient: boolean;
};

export function useLiff(): LiffState & { retry: () => void } {
  const [state, setState] = useState<LiffState>({
    ready: false,
    loggedIn: false,
    profile: null,
    error: null,
    isInClient: false,
  });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    // IDが未設定、またはデフォルト値の場合はモックモード
    const liffId = import.meta.env.VITE_LIFF_ID;
    if (!liffId || liffId === 'your_liff_id_here') {
      console.warn('VITE_LIFF_ID is not set. Using mock mode.');
      setState({
        ready: true,
        loggedIn: true,
        profile: {
          userId: 'mock_user',
          displayName: 'ゲストユーザー',
          pictureUrl: 'https://ui-avatars.com/api/?name=Guest&background=random',
        },
        error: null,
        isInClient: false,
      });
      return;
    }

    initLiff()
      .then(async () => {
        if (cancelled) return;
        const loggedIn = liff.isLoggedIn();
        const isInClient = liff.isInClient();

        if (!loggedIn) {
          liff.login();
          return;
        }

        const profile = await liff.getProfile();
        if (!cancelled) {
          setState({ ready: true, loggedIn, profile, error: null, isInClient });
        }
      })
      .catch((e: Error) => {
        console.error('LIFF init error:', e);
        if (!cancelled) {
          setState(s => ({ ...s, ready: true, error: `LIFF初期化エラー: ${e.message}` }));
        }
      });

    return () => { cancelled = true; };
  }, [attempt]);

  const retry = () => {
    resetInitLiff();
    setState({ ready: false, loggedIn: false, profile: null, error: null, isInClient: false });
    setAttempt(n => n + 1);
  };

  return { ...state, retry };
}