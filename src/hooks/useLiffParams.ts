import { useMemo } from 'react';

export function useLiffParams(): URLSearchParams {
  return useMemo(() => {
    const raw = new URLSearchParams(window.location.search).get('liff.state') ?? '';
    try {
      const decoded = decodeURIComponent(raw);
      const queryStart = decoded.indexOf('?');
      if (queryStart === -1) return new URLSearchParams();
      return new URLSearchParams(decoded.slice(queryStart + 1));
    } catch {
      return new URLSearchParams();
    }
  }, []);
}