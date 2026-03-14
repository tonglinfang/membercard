import type { LineProfile } from '../types/line';
import { liff } from '../lib/liff';
import { LogOut } from 'lucide-react';

export function UserHeader({ profile }: { profile: LineProfile }) {
  const handleLogout = () => {
    if (confirm('ログアウトしますか？')) {
      liff.logout();
      window.location.reload();
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-sm z-10 sticky top-0">
      <div className="flex items-center gap-3">
        {profile.pictureUrl ? (
          <img
            src={profile.pictureUrl}
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
            alt={profile.displayName}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
            {profile.displayName.charAt(0)}
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-bold text-gray-800 text-sm">{profile.displayName}</span>
          <span className="text-xs text-gray-500">LINEログイン中</span>
        </div>
      </div>
      
      {/* 外部ブラウザなどで実行している場合のみログアウトを表示 */}
      {!liff.isInClient() && (
        <button 
          onClick={handleLogout}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          title="ログアウト"
        >
          <LogOut className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}