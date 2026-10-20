import React, { useState } from 'react';
import { X, Link2, Copy, Check, RefreshCw, AlertCircle, FileSpreadsheet, ShieldAlert, Sparkles, ExternalLink, HelpCircle } from 'lucide-react';
import { normalizeGoogleSheetUrl } from '../services/sheetSync';

interface GoogleSheetSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string;
  onSaveAndSync: (url: string, tabName: string, intervalSeconds: number) => Promise<void>;
  isSyncing: boolean;
  lastUpdated: string;
  syncSource: string;
  autoSyncSeconds: number;
  onResetToDefault: () => void;
}

export const GoogleSheetSyncModal: React.FC<GoogleSheetSyncModalProps> = ({
  isOpen,
  onClose,
  currentUrl,
  onSaveAndSync,
  isSyncing,
  lastUpdated,
  syncSource,
  autoSyncSeconds,
  onResetToDefault
}) => {
  const [urlInput, setUrlInput] = useState(currentUrl || '');
  const [tabInput, setTabInput] = useState('สรุปภาพรวม');
  const [interval, setInterval] = useState(autoSyncSeconds || 30);
  const [copied, setCopied] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<{ type: 'success' | 'error' | null; text: string }>({ type: null, text: '' });

  if (!isOpen) return null;

  const handleCopy = () => {
    if (urlInput) {
      navigator.clipboard.writeText(urlInput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApply = async () => {
    setSyncStatusMsg({ type: null, text: '' });
    try {
      await onSaveAndSync(urlInput, tabInput, interval);
      setSyncStatusMsg({ type: 'success', text: 'ซิงค์ข้อมูลจาก Google Sheets เรียบร้อยแล้ว!' });
    } catch (err: any) {
      setSyncStatusMsg({
        type: 'error',
        text: err?.message || 'ไม่สามารถซิงค์ได้ กรุณาตรวจสอบสิทธิ์การแชร์ของชีต'
      });
    }
  };

  const presetTabs = ['สรุปภาพรวม', 'Msc', 'Pia', 'TODAY_10_69'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-white">
                ตั้งค่าเชื่อมโยง Google Sheets (Live Sync)
              </h3>
              <p className="text-xs text-zinc-400">
                วางลิงก์ Google Sheets เพื่ออัพเดทข้อมูลยอดขายแบบเรียลไทม์
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Status Message */}
          {syncStatusMsg.text && (
            <div
              className={`p-3.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 ${
                syncStatusMsg.type === 'success'
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              }`}
            >
              {syncStatusMsg.type === 'success' ? (
                <Check className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{syncStatusMsg.text}</span>
            </div>
          )}

          {/* 1. URL Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <Link2 className="w-4 h-4 text-blue-500" />
                <span>ลิงก์ Google Sheets (แชร์แบบ Anyone with link หรือ Web Publish)</span>
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'คัดลอกแล้ว!' : 'ก็อปลิ้งก์'}</span>
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5.../edit"
                className="w-full px-4 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
            <p className="text-[11px] text-zinc-400">
              รองรับทั้งลิงก์แบบ <code>/edit#gid=...</code>, ลิงก์ <code>/pub?output=csv</code> หรือ <code>/gviz/tq</code>
            </p>
          </div>

          {/* 2. Select Sheet Tab */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
              ชื่อแท็บในชีตที่ต้องการดึง (Sheet Tab Name)
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {presetTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setTabInput(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    tabInput === tab
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={tabInput}
              onChange={(e) => setTabInput(e.target.value)}
              placeholder="หรือพิมพ์ชื่อแท็บเอง..."
              className="w-full px-4 py-2 text-xs bg-zinc-100 dark:bg-zinc-800/60 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
            />
          </div>

          {/* 3. Auto-sync interval */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center justify-between">
              <span>ความถี่การซิงค์อัตโนมัติ (Live Polling Frequency)</span>
              <span className="text-xs font-normal text-emerald-600 dark:text-emerald-400">
                {interval === 0 ? 'ปิดออโต้ซิงค์' : `ทุกๆ ${interval} วินาที`}
              </span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { sec: 10, label: '10 วินาที' },
                { sec: 30, label: '30 วินาที' },
                { sec: 60, label: '1 นาที' },
                { sec: 0, label: 'ปิดออโต้' }
              ].map((opt) => (
                <button
                  key={opt.sec}
                  type="button"
                  onClick={() => setInterval(opt.sec)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold text-center transition-all ${
                    interval === opt.sec
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Instructions Collapsible Guide */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowGuide(!showGuide)}
              className="w-full p-4 bg-zinc-50 dark:bg-zinc-800/40 flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors"
            >
              <span className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-500" />
                วิธีเปิดสิทธิ์ Google Sheets ให้แอปอ่านข้อมูลได้ (สำคัญ!)
              </span>
              <span className="text-xs text-blue-600 dark:text-blue-400">
                {showGuide ? 'ซ่อน' : 'ดูคำแนะนำ'}
              </span>
            </button>

            {showGuide && (
              <div className="p-4 space-y-3 text-xs text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
                <div className="space-y-1.5">
                  <p className="font-bold text-zinc-900 dark:text-white">วิธีที่ 1: แชร์ให้ทุกคนที่มีลิงก์ดูได้ (แนะนำที่สุด)</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>เปิดชีตของคุณใน Google Drive / Google Sheets</li>
                    <li>กดปุ่ม <strong>"แชร์ (Share)"</strong> สีน้ำเงินมุมขวาบน</li>
                    <li>ตรง "การเข้าถึงทั่วไป (General Access)" เปลี่ยนเป็น <strong>"ทุกคนที่มีลิงก์ (Anyone with the link)"</strong> และเลือกสิทธิ์เป็น <strong>"มีสิทธิ์ดู (Viewer)"</strong></li>
                    <li>กด <strong>"คัดลอกลิงก์ (Copy link)"</strong> แล้วนำมาวางในช่องด้านบน</li>
                  </ol>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <p className="font-bold text-zinc-900 dark:text-white">วิธีที่ 2: เผยแพร่ไปยังเว็บ (Publish to Web)</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>ไปที่เมนู <strong>ไฟล์ (File) &gt; แชร์ (Share) &gt; เผยแพร่ไปยังเว็บ (Publish to web)</strong></li>
                    <li>เลือกแท็บที่ต้องการ เช่น <strong>"สรุปภาพรวม"</strong></li>
                    <li>เปลี่ยนรูปแบบจาก "หน้าเว็บ" เป็น <strong>"ค่าที่คั่นด้วยจุลภาค (.csv)"</strong></li>
                    <li>กด "เผยแพร่" แล้วก๊อปลิงก์ CSV มาวางได้เลย</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onResetToDefault}
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 underline"
          >
            กู้คืนข้อมูลชีตต้นฉบับ (Default Dataset)
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              ปิด
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={isSyncing}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'กำลังบันทึกและซิงค์...' : 'บันทึกและซิงค์เดี๋ยวนี้'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
