export function LoadingScreen() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50" role="status" aria-label="読み込み中">
      <div className="w-8 h-8 border-4 border-[#00B900] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function ErrorScreen({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col h-screen items-center justify-center gap-4 px-8 text-center bg-gray-50" role="alert">
      <p className="text-5xl" aria-hidden="true">⚠️</p>
      <p className="text-gray-700 font-medium">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 px-8 py-3 bg-[#00B900] text-white font-bold rounded-xl active:bg-[#009900] transition-colors"
        >
          再試行
        </button>
      )}
    </div>
  );
}