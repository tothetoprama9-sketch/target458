import React from 'react';
import { ActiveTab } from '../types/dashboard';
import { LayoutDashboard, TrendingUp, Building2, ShieldAlert, Settings, ShoppingBag } from 'lucide-react';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  onOpenSyncModal: () => void;
  isSyncing: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  onOpenSyncModal,
  isSyncing,
}) => {
  const navItems = [
    {
      id: 'overview' as ActiveTab,
      label: 'ภาพรวม',
      icon: LayoutDashboard,
    },
    {
      id: 'daily' as ActiveTab,
      label: 'กราฟ',
      icon: TrendingUp,
    },
    {
      id: 'msc' as ActiveTab,
      label: 'ทีม Msc',
      icon: Building2,
      badge: '3 คน',
    },
    {
      id: 'pia' as ActiveTab,
      label: 'ทีม Pia',
      icon: ShoppingBag,
      badge: '4 คน',
    },
    {
      id: 'services' as ActiveTab,
      label: 'ประกัน',
      icon: ShieldAlert,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border-t border-zinc-200/80 dark:border-zinc-800/80 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)] safe-area-bottom"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl min-h-[48px] transition-all duration-150 active:scale-90 relative ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 font-medium'
              }`}
            >
              {/* Active Pill Background Accent */}
              {isActive && (
                <span className="absolute inset-x-2 inset-y-1 bg-blue-50 dark:bg-blue-950/50 rounded-xl -z-10 animate-in fade-in zoom-in-95 duration-150" />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {item.badge && (
                  <span
                    className={`absolute -top-1.5 -right-3 text-[9px] px-1 py-0.2 rounded-full font-bold leading-tight ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              <span className="text-[10px] mt-1 tracking-tight leading-none">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Quick Sync Sheet Modal Trigger */}
        <button
          onClick={onOpenSyncModal}
          title="ซิงค์ Google Sheets"
          className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl min-h-[48px] text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 active:scale-90 transition-all duration-150"
        >
          <Settings className={`w-5 h-5 stroke-[1.8] ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
          <span className="text-[10px] mt-1 tracking-tight leading-none">
            {isSyncing ? 'กำลังซิงค์' : 'ชีต'}
          </span>
        </button>
      </div>
    </nav>
  );
};
