/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DashboardData, ActiveTab } from './types/dashboard';
import { initialDashboardData } from './data/defaultData';
import { fetchSheetData, getSavedSheetUrl, saveSheetUrl, getSavedSyncInterval, saveSyncInterval } from './services/sheetSync';
import { Header } from './components/Header';
import { NavigationTabs } from './components/NavigationTabs';
import { OverviewView } from './components/OverviewView';
import { DailySalesView } from './components/DailySalesView';
import { TeamBranchView } from './components/TeamBranchView';
import { StaffTrackingView } from './components/StaffTrackingView';
import { ServicesKPIView } from './components/ServicesKPIView';
import { GoogleSheetSyncModal } from './components/GoogleSheetSyncModal';
import { CheckCircle2, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<DashboardData>(initialDashboardData);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sales_app_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncModalOpen, setSyncModalOpen] = useState<boolean>(false);
  const [autoSyncSeconds, setAutoSyncSeconds] = useState<number>(() => getSavedSyncInterval());
  const [currentUrl, setCurrentUrl] = useState<string>(() => {
    const saved = getSavedSheetUrl();
    if (saved && !saved.includes('1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms')) {
      return saved;
    }
    if (saved && saved.includes('1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms')) {
      saveSheetUrl('');
    }
    return '';
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Sync dark mode class with <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('sales_app_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('sales_app_theme', 'light');
    }
  }, [darkMode]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Perform sync from Google Sheet
  const handleSync = useCallback(async (customUrl?: string, tabName?: string, silent: boolean = false) => {
    setIsSyncing(true);
    try {
      const urlToUse = customUrl !== undefined ? customUrl : currentUrl;
      const result = await fetchSheetData(urlToUse, tabName);

      if (result.data) {
        setData(result.data);
      }

      if (result.error) {
        if (!silent) {
          showToast(result.error, 'error');
        }
      } else {
        if (!silent) {
          showToast(`ซิงค์ข้อมูลสำเร็จ (${result.data.lastUpdated})`, 'success');
        }
      }
    } catch (err: any) {
      if (!silent) {
        showToast(err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ Google Sheets', 'error');
      }
    } finally {
      setIsSyncing(false);
    }
  }, [currentUrl]);

  // Initial load: Attempt sync if user previously saved a custom URL or load backend initial
  useEffect(() => {
    handleSync(undefined, undefined, true);
  }, []);

  // Background Live Polling timer
  useEffect(() => {
    if (autoSyncSeconds <= 0) return;

    const intervalId = setInterval(() => {
      handleSync(undefined, undefined, true);
    }, autoSyncSeconds * 1000);

    return () => clearInterval(intervalId);
  }, [autoSyncSeconds, handleSync]);

  const handleSaveAndSync = async (url: string, tabName: string, intervalSeconds: number) => {
    saveSheetUrl(url);
    saveSyncInterval(intervalSeconds);
    setCurrentUrl(url);
    setAutoSyncSeconds(intervalSeconds);
    await handleSync(url, tabName, false);
    setSyncModalOpen(false);
  };

  const handleResetToDefault = () => {
    setData(initialDashboardData);
    saveSheetUrl('');
    setCurrentUrl('');
    showToast('รีเซ็ตกลับเป็นข้อมูลชีตต้นฉบับแล้ว', 'info');
    setSyncModalOpen(false);
  };

  const handleSyncBranchTab = async (branchTab: string) => {
    showToast(`กำลังดึงข้อมูลแท็บ "${branchTab}" จาก Google Sheets...`, 'info');
    await handleSync(currentUrl, branchTab, false);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col transition-colors selection:bg-blue-500 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`px-4 py-2.5 rounded-2xl shadow-xl backdrop-blur-xl border flex items-center space-x-2 text-xs sm:text-sm font-semibold ${
              toast.type === 'success'
                ? 'bg-emerald-500/90 text-white border-emerald-400/30'
                : toast.type === 'error'
                ? 'bg-rose-500/90 text-white border-rose-400/30'
                : 'bg-zinc-800/90 text-white border-zinc-700/50'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
            {toast.type === 'info' && <Sparkles className="w-4 h-4 shrink-0 text-amber-300" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* iOS App Bar Header */}
      <Header
        data={data}
        isSyncing={isSyncing}
        onRefresh={() => handleSync(undefined, undefined, false)}
        onOpenSyncModal={() => setSyncModalOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        autoSyncSeconds={autoSyncSeconds}
      />

      {/* Segmented Navigation Tabs */}
      <NavigationTabs
        activeTab={activeTab === 'sync' ? 'overview' : activeTab}
        onChangeTab={(tab) => {
          if (tab === 'sync') {
            setSyncModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
      />

      {/* Main View Area (Mobile Optimized) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 mt-4 sm:mt-6">
        {activeTab === 'overview' && (
          <OverviewView
            data={data}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'daily' && (
          <DailySalesView data={data} />
        )}

        {activeTab === 'msc' && (
          <TeamBranchView
            branchId="msc"
            data={data}
            onSyncBranchTab={handleSyncBranchTab}
            isSyncing={isSyncing}
          />
        )}

        {activeTab === 'pia' && (
          <TeamBranchView
            branchId="pia"
            data={data}
            onSyncBranchTab={handleSyncBranchTab}
            isSyncing={isSyncing}
          />
        )}

        {activeTab === 'staff' && (
          <StaffTrackingView data={data} />
        )}

        {activeTab === 'services' && (
          <ServicesKPIView data={data} />
        )}
      </main>

      {/* Google Sheets Sync Settings Modal */}
      <GoogleSheetSyncModal
        isOpen={syncModalOpen}
        onClose={() => setSyncModalOpen(false)}
        currentUrl={currentUrl}
        onSaveAndSync={handleSaveAndSync}
        isSyncing={isSyncing}
        lastUpdated={data.lastUpdated}
        syncSource={data.syncSource}
        autoSyncSeconds={autoSyncSeconds}
        onResetToDefault={handleResetToDefault}
      />
    </div>
  );
}
