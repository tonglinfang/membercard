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

    const liffId = import.meta.env.VITE_LIFF_ID;
    console.log('Using LIFF ID:', liffId);

    // モックモードの判定（IDが未設定またはプレースホルダの場合）
    if (!liffId || liffId === 'your_liff_id_here' || liffId === '') {
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

        if (!liff.isLoggedIn()) {
          console.log('Not logged in, initiating login...');
          liff.login();
          return;
        }

        try {
          const profile = await liff.getProfile();
          const isInClient = liff.isInClient();
          
          console.log('LIFF initialized, profile obtained:', profile.displayName);
          
          if (!cancelled) {
            setState({ 
              ready: true, 
              loggedIn: true, 
              profile, 
              error: null, 
              isInClient 
            });
          }
        } catch (err: any) {
          console.error('Failed to get profile:', err);
          throw new Error(`プロフィールの取得に失敗しました: ${err.message}`);
        }
      })
      .catch((e: Error) => {
        console.error('LIFF Error:', e);
        if (!cancelled) {
          setState(s => ({ ...s, ready: true, error: `LIFFエラー: ${e.message}` }));
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