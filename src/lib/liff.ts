import liff from '@line/liff';

let initPromise: Promise<void> | null = null;

export function initLiff(): Promise<void> {
  if (!initPromise) {
    initPromise = liff.init({
      // 環境変数にLIFF_IDがない場合はモックモード等にできるよう空文字をフォールバックにします
      liffId: import.meta.env.VITE_LIFF_ID || '',
      withLoginOnExternalBrowser: true,
    });
  }
  return initPromise;
}

export function resetInitLiff(): void {
  initPromise = null;
}

export { liff };