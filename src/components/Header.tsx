import React from 'react';
import { RefreshCw, Moon, Sun, Link2, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { DashboardData } from '../types/dashboard';

interface HeaderProps {
  data: DashboardData;
  isSyncing: boolean;
  onRefresh: () => void;
  onOpenSyncModal: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  autoSyncSeconds: number;
}

export const Header: React.FC<HeaderProps> = ({
  data,
  isSyncing,
  onRefresh,
  onOpenSyncModal,
  darkMode,
  onToggleDarkMode,
  autoSyncSeconds
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-2xl bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-200/60 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left Brand & Title */}
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0 text-white font-bold text-xl">
              
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white truncate">
                  {data.overview.quarterLabel || 'ภาพรวมยอดขาย Q4'}
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50">
                  📅 {data.overview.month || '10/2569'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-live-dot inline-block" />
                  {data.overview.statusText || 'เชื่อมโยงชีต Data (Live Sync)'}
                </span>
                <span className="hidden md:inline">•</span>
                <span className="hidden md:inline">
                  ซิงค์ล่าสุด {data.lastUpdated}
                </span>
                {autoSyncSeconds > 0 && (
                  <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    ออโต้ {autoSyncSeconds}s
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Action Buttons - iOS style rounded icon buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Copy / Setup Sheet Link Button */}
            <button
              onClick={onOpenSyncModal}
              title="ตั้งค่าลิ้งก์ Google Sheets"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-200 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 active:scale-95 transition-all shadow-sm"
            >
              <Link2 className="w-4 h-4 text-blue-500" />
              <span className="hidden sm:inline">ลิ้งก์ชีต</span>
            </button>

            {/* Sync Now / Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isSyncing}
              title="ซิงค์ข้อมูลเดี๋ยวนี้"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isSyncing ? 'กำลังซิงค์...' : 'รีเฟรช'}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              title={darkMode ? 'เปลี่ยนเป็น Light Mode' : 'เปลี่ยนเป็น Dark Mode'}
              className="p-2 sm:p-2.5 rounded-xl text-zinc-600 dark:text-zinc-300 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 active:scale-95 transition-all"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-700" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
