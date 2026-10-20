import { DashboardData } from '../types/dashboard';
import { initialDashboardData } from '../data/defaultData';
import { parseGoogleSheetCsv } from './csvParser';

const STORAGE_KEY_URL = 'sales_dashboard_gsheet_url';
const STORAGE_KEY_TAB = 'sales_dashboard_active_tab';
const STORAGE_KEY_INTERVAL = 'sales_dashboard_sync_interval';

export function getSavedSheetUrl(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(STORAGE_KEY_URL) || '';
}

export function saveSheetUrl(url: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_URL, url.trim());
}

export function getSavedSyncInterval(): number {
  if (typeof window === 'undefined') return 30; // default 30s
  const val = localStorage.getItem(STORAGE_KEY_INTERVAL);
  return val ? parseInt(val, 10) : 30;
}

export function saveSyncInterval(seconds: number): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_INTERVAL, String(seconds));
}

// Convert various Google Sheet link formats to standard export URL
export function normalizeGoogleSheetUrl(url: string, tabName?: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  // If it's already a CSV URL, return as is
  if (trimmed.includes('format=csv') || trimmed.includes('output=csv') || trimmed.endsWith('.csv')) {
    return trimmed;
  }

  // Check for spreadsheet ID
  const idMatch = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    const id = idMatch[1];
    if (tabName && tabName.trim()) {
      return `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName.trim())}`;
    }
    const gidMatch = trimmed.match(/[#&?]gid=([0-9]+)/);
    if (gidMatch && gidMatch[1]) {
      return `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${gidMatch[1]}`;
    }
    return `https://docs.google.com/spreadsheets/d/${id}/export?format=csv`;
  }

  return trimmed;
}

export interface FetchResult {
  data: DashboardData;
  rawCsv?: string;
  source: 'live_google_sheet' | 'default' | 'cache';
  error?: string;
}

export async function fetchSheetData(url?: string, tabName?: string): Promise<FetchResult> {
  const targetUrl = url?.trim() || getSavedSheetUrl();
  const isDummyUrl = !targetUrl || targetUrl.includes('1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms');

  // If no URL given or placeholder, load default dataset cleanly
  if (isDummyUrl) {
    try {
      const res = await fetch('/api/sync-sheet');
      if (res.ok) {
        const json = await res.json();
        if (json.csv) {
          const parsed = parseGoogleSheetCsv(json.csv);
          return {
            data: { ...parsed, syncSource: 'default', lastUpdated: new Date().toLocaleTimeString('th-TH') },
            rawCsv: json.csv,
            source: 'default'
          };
        }
      }
    } catch {
      // offline or backend direct
    }
    return { data: initialDashboardData, source: 'default' };
  }

  // 1. Try backend proxy first (/api/sync-sheet) which bypasses browser CORS!
  try {
    const query = new URLSearchParams({
      url: targetUrl,
      ...(tabName ? { sheet: tabName } : {})
    });

    const res = await fetch(`/api/sync-sheet?${query.toString()}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.csv) {
        const parsed = parseGoogleSheetCsv(json.csv);
        parsed.sheetUrl = targetUrl;
        parsed.syncSource = 'live_google_sheet';
        parsed.lastUpdated = new Date().toLocaleTimeString('th-TH');
        return { data: parsed, rawCsv: json.csv, source: 'live_google_sheet' };
      } else if (json.fallbackCsv) {
        const parsed = parseGoogleSheetCsv(json.fallbackCsv);
        parsed.sheetUrl = targetUrl;
        parsed.syncSource = 'cached';
        parsed.lastUpdated = new Date().toLocaleTimeString('th-TH');
        return {
          data: parsed,
          rawCsv: json.fallbackCsv,
          source: 'cache',
          error: json.error
        };
      } else {
        throw new Error(json.error || 'Invalid response from sync API');
      }
    } else {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || `HTTP error ${res.status}`);
    }
  } catch (backendErr: any) {
    console.warn('Backend proxy fetch failed, trying direct browser fetch fallback:', backendErr);

    // 2. Fallback: try direct browser fetch (works if sheet is published to web as CSV)
    try {
      const directUrl = normalizeGoogleSheetUrl(targetUrl, tabName);
      const directRes = await fetch(directUrl);
      if (directRes.ok) {
        const csvText = await directRes.text();
        const parsed = parseGoogleSheetCsv(csvText);
        parsed.sheetUrl = targetUrl;
        parsed.syncSource = 'live_google_sheet';
        parsed.lastUpdated = new Date().toLocaleTimeString('th-TH');
        return { data: parsed, rawCsv: csvText, source: 'live_google_sheet' };
      }
    } catch (directErr) {
      console.warn('Direct fetch failed:', directErr);
    }

    // If both failed, return current data with error notification
    return {
      data: initialDashboardData,
      source: 'cache',
      error: backendErr?.message || 'ไม่สามารถดึงข้อมูลจาก Google Sheets ได้ กรุณาตรวจสอบสิทธิ์การแชร์ (Anyone with link)'
    };
  }

  return { data: initialDashboardData, source: 'cache' };
}

// Format currency helpers
export function formatBaht(num: number): string {
  if (num === undefined || num === null || isNaN(num)) return '฿0';
  return '฿' + num.toLocaleString('th-TH');
}

export function formatCompactBaht(num: number): string {
  if (num === undefined || num === null || isNaN(num)) return '฿0';
  if (Math.abs(num) >= 1_000_000) {
    return `฿${(num / 1_000_000).toFixed(2)}M`;
  }
  if (Math.abs(num) >= 1_000) {
    return `฿${(num / 1_000).toFixed(1)}k`;
  }
  return `฿${num.toLocaleString('th-TH')}`;
}

export function formatNumber(num: number): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return num.toLocaleString('th-TH');
}

export function formatPercent(num: number): string {
  if (num === undefined || num === null || isNaN(num)) return '0.0%';
  return `${num.toFixed(1)}%`;
}
