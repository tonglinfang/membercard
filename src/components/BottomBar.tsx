export function BottomBar({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="h-24" />
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20"
        style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
      >
        {children}
      </div>
    </>
  );
}