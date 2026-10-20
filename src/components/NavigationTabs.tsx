import React from 'react';
import { ActiveTab } from '../types/dashboard';
import { LayoutDashboard, TrendingUp, Users, ShieldAlert, Settings, Building2 } from 'lucide-react';

interface NavigationTabsProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { id: 'overview' as ActiveTab, label: 'สรุปภาพรวม', icon: LayoutDashboard },
    { id: 'daily' as ActiveTab, label: 'กราฟสรุปรายวัน', icon: TrendingUp },
    { id: 'msc' as ActiveTab, label: 'Msc', icon: Building2, badge: 'โจโฉ, โย, คิม' },
    { id: 'pia' as ActiveTab, label: 'Pia', icon: Building2, badge: 'จิ๊บ, เมย์, วา, สตาร์' },
    { id: 'services' as ActiveTab, label: 'ประกัน & KPI', icon: ShieldAlert },
    { id: 'sync' as ActiveTab, label: 'ซิงค์ Google Sheets', icon: Settings },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-3 sm:mt-6">
      {/* iOS Segmented Control container */}
      <div className="p-1.5 bg-zinc-200/70 dark:bg-zinc-800/80 rounded-2xl backdrop-blur-xl border border-zinc-300/40 dark:border-zinc-700/40 flex items-center overflow-x-auto no-scrollbar scroll-smooth gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-3.5 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                isActive
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm shadow-black/10 scale-[1.01]'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-white/40 dark:hover:bg-zinc-700/40'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isActive 
                    ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300' 
                    : 'bg-zinc-300/60 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
