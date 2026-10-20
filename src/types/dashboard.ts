export interface MetricOverview {
  month: string;
  statusText: string;
  quarterLabel: string;
  target: number;
  sold: number;
  diff: number;
  achievePct: number;
  forecastBath: number;
  forecastPct: number;
  units: number;
  unitsLabel: string;
}

export interface CategoryMetric {
  id: string;
  name: string;
  rawName: string;
  icon: string;
  categoryGroup: 'apple' | 'it' | 'btb' | 'other';
  target: number;
  sold: number;
  diff: number;
  achievePct: number;
  forecastBath: number;
  forecastPct: number;
  units: number;
  unitsLabel: string;
}

export interface ProtectionKPI {
  id: string;
  name: string;
  targetPct: number;
  actualUnits: number;
  actualPct: number;
  status: 'pass' | 'fail' | 'progress';
  statusText: string;
}

export interface StaffItemTarget {
  category: string;
  icon: string;
  target: number;
  actual: number;
  achievePct: number;
  status: string;
  units?: number;
  unitsLabel?: string;
}

export interface StaffProfile {
  id: string;
  code?: string;
  name: string;
  shortName?: string;
  role: string;
  branch: string;
  team?: 'msc' | 'pia';
  avatar?: string;
  items: StaffItemTarget[];
  totalTarget: number;
  totalActual: number;
  totalAchievePct: number;
  totalStatus: string;
  kpis?: ProtectionKPI[];
}

export interface DailySalesRecord {
  day: number;
  dateStr: string;
  sales: number;
  target: number;
  cumulativeSales: number;
  cumulativeTarget: number;
  units: number;
  topProduct?: string;
}

export interface DashboardData {
  overview: MetricOverview;
  categories: CategoryMetric[];
  protectionKPIs: ProtectionKPI[];
  staffList: StaffProfile[];
  dailyRecords: DailySalesRecord[];
  lastUpdated: string;
  syncSource: 'live_google_sheet' | 'cached' | 'default';
  sheetUrl?: string;
}

export type ActiveTab = 'overview' | 'daily' | 'msc' | 'pia' | 'staff' | 'services' | 'sync';
