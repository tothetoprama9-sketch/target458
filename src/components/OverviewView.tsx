import React, { useState } from 'react';
import { DashboardData, CategoryMetric } from '../types/dashboard';
import { formatBaht, formatCompactBaht, formatPercent, formatNumber } from '../services/sheetSync';
import { Target, TrendingUp, Sparkles, CheckCircle2, AlertTriangle, ArrowUpRight, Smartphone, Laptop, Watch, Headphones, ChevronRight, ShieldCheck } from 'lucide-react';

interface OverviewViewProps {
  data: DashboardData;
  onSelectCategory?: (category: CategoryMetric) => void;
  onNavigateToTab?: (tab: any) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ data, onNavigateToTab }) => {
  const [filterGroup, setFilterGroup] = useState<'all' | 'apple' | 'it' | 'btb'>('all');
  const { overview, categories, protectionKPIs } = data;

  const filteredCategories = categories.filter((c) => {
    if (filterGroup === 'all') return true;
    return c.categoryGroup === filterGroup;
  });

  // KPI pass/fail counts
  const passedKPIs = protectionKPIs.filter((k) => k.status === 'pass').length;
  const progressKPIs = protectionKPIs.filter((k) => k.status === 'progress').length;
  const failedKPIs = protectionKPIs.filter((k) => k.status === 'fail').length;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Main Hero Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6">
        {/* Main Grand Card: Total Sales vs Target (Col span 8) */}
        <div className="lg:col-span-8 ios-card rounded-2xl sm:rounded-3xl p-4 sm:p-8 relative overflow-hidden flex flex-col justify-between">
          {/* Subtle iOS background glow */}
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-32 -bottom-20 w-52 h-52 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3 sm:mb-4">
              <div className="flex items-center space-x-2">
                <span className="p-2 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                  <Target className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    ยอดขายรวมทุกหมวดหมู่ (All Target)
                  </h2>
                  <p className="text-[11px] sm:text-xs text-zinc-400 dark:text-zinc-500">
                    {overview.quarterLabel}
                  </p>
                </div>
              </div>

              {/* Forecast Badge */}
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Forecast จบเดือน: {formatPercent(overview.forecastPct)}</span>
              </div>
            </div>

            {/* Big Numbers & Activity Ring */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-2 mb-4 sm:mb-6">
              <div>
                <span className="text-[11px] sm:text-xs font-medium text-zinc-500 dark:text-zinc-400">ขายได้จริงแล้ว (Actual Sold)</span>
                <div className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-0.5">
                  {formatBaht(overview.sold)}
                </div>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                    📦 รวม {formatNumber(overview.units)} {overview.unitsLabel || 'เครื่อง'}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    เป้า {formatBaht(overview.target)}
                  </span>
                </div>
              </div>

              {/* Progress Metric Ring & Percent */}
              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-200/60 dark:border-zinc-800">
                {/* Custom iOS Activity Circular Progress */}
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-zinc-200 dark:stroke-zinc-800"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-blue-500 transition-all duration-1000 ease-out"
                      strokeWidth="10"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * Math.min(overview.achievePct, 100)) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-white">
                      {formatPercent(overview.achievePct)}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-semibold text-zinc-400 uppercase">Achieve</span>
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <div>
                    <span className="text-[10px] sm:text-[11px] text-zinc-400 dark:text-zinc-500 font-medium block">ห่างจากเป้าหมาย</span>
                    <span className="text-sm sm:text-lg font-bold text-amber-600 dark:text-amber-400">
                      {formatBaht(overview.diff)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-[11px] text-zinc-400 dark:text-zinc-500 font-medium block">ประมาณการสิ้นเดือน (Forecast)</span>
                    <span className="text-sm sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      {formatBaht(overview.forecastBath)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 6 Core Metrics Grid matching Google Sheet row exactly */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4 p-4 rounded-2xl bg-zinc-100/80 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60">
              <div className="space-y-0.5">
                <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">All (Target)</span>
                <div className="text-base sm:text-lg font-black text-zinc-900 dark:text-white">
                  {formatBaht(overview.target)}
                </div>
              </div>

              <div className="space-y-0.5">
                <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">ขายไป (Sold)</span>
                <div className="text-base sm:text-lg font-black text-blue-600 dark:text-blue-400">
                  {formatBaht(overview.sold)}
                </div>
              </div>

              <div className="space-y-0.5">
                <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">จำนวนเครื่อง</span>
                <div className="text-base sm:text-lg font-black text-zinc-900 dark:text-white">
                  {formatNumber(overview.units)} {overview.unitsLabel || 'เครื่อง'}
                </div>
              </div>

              <div className="space-y-0.5 pt-2 border-t border-zinc-200/50 dark:border-zinc-700/50">
                <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">ห่างจากเป้า</span>
                <div className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400">
                  {formatBaht(overview.diff)}
                </div>
              </div>

              <div className="space-y-0.5 pt-2 border-t border-zinc-200/50 dark:border-zinc-700/50">
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Achieve (%)</span>
                <div className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">
                  {formatPercent(overview.achievePct)}
                </div>
              </div>

              <div className="space-y-0.5 pt-2 border-t border-zinc-200/50 dark:border-zinc-700/50">
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Forecast (Bath) / %</span>
                <div className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">
                  {formatCompactBaht(overview.forecastBath)}{' '}
                  <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">({formatPercent(overview.forecastPct)})</span>
                </div>
              </div>
            </div>

            {/* iOS Smooth Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="w-full h-3 bg-zinc-200/80 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 transition-all duration-700 ease-out"
                  style={{ width: `${Math.min(overview.achievePct, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-zinc-400 font-medium px-1">
                <span>0%</span>
                <span>เป้า 100% ({formatCompactBaht(overview.target)})</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  Forecast {formatPercent(overview.forecastPct)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Side Bento Card: Performance Highlights & Attach Rate (Col span 4) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card: Protection & Care Rate Summary */}
          <div className="ios-card rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="p-2 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">KPI ประกัน & บริการ</h3>
                  <p className="text-xs text-zinc-400">Attach Rate Overview</p>
                </div>
              </div>
              {onNavigateToTab && (
                <button
                  onClick={() => onNavigateToTab('services')}
                  className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center"
                >
                  ดูทั้งหมด <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              )}
            </div>

            {/* KPI Status Counters */}
            <div className="grid grid-cols-3 gap-2 my-2 text-center">
              <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/40">
                <span className="text-lg sm:text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {passedKPIs}
                </span>
                <span className="block text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                  ✅ ผ่านเกณฑ์
                </span>
              </div>
              <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-800/40">
                <span className="text-lg sm:text-xl font-extrabold text-amber-600 dark:text-amber-400">
                  {progressKPIs}
                </span>
                <span className="block text-[11px] font-medium text-amber-700 dark:text-amber-300">
                  🤘 ใกล้ถึงเป้า
                </span>
              </div>
              <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/50 dark:border-rose-800/40">
                <span className="text-lg sm:text-xl font-extrabold text-rose-600 dark:text-rose-400">
                  {failedKPIs}
                </span>
                <span className="block text-[11px] font-medium text-rose-700 dark:text-rose-300">
                  ❌ ไม่ผ่าน
                </span>
              </div>
            </div>

            {/* Quick KPI items preview */}
            <div className="space-y-2 mt-2 pt-2 border-t border-zinc-200/60 dark:border-zinc-800">
              {protectionKPIs.slice(0, 3).map((kpi) => (
                <div key={kpi.id} className="flex items-center justify-between text-xs">
                  <span className="truncate max-w-[170px] text-zinc-600 dark:text-zinc-300 font-medium">
                    {kpi.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-zinc-900 dark:text-white">{kpi.actualPct}%</span>
                    <span className="text-[10px] text-zinc-400">({kpi.actualUnits} ชิ้น)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Team Switcher Teaser */}
          <div className="ios-card rounded-3xl p-5 flex items-center justify-between bg-gradient-to-r from-blue-600/5 to-indigo-600/5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                ติดตามรายทีม & สาขา
              </span>
              <p className="text-sm font-semibold text-zinc-900 dark:text-white mt-0.5">
                ข้อมูลทีม Msc & Pia
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                เปรียบเทียบยอดขายและเป้าหมายรายคน
              </p>
            </div>
            {onNavigateToTab && (
              <div className="flex gap-1.5">
                <button
                  onClick={() => onNavigateToTab('msc')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm border border-zinc-200 dark:border-zinc-700 active:scale-95 transition-transform"
                >
                  Msc
                </button>
                <button
                  onClick={() => onNavigateToTab('pia')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-zinc-200 dark:border-zinc-700 active:scale-95 transition-transform"
                >
                  Pia
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Category Cards Section with Filter Pills */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              สรุปยอดขายแยกตามกลุ่มสินค้า
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              แตะการ์ดเพื่อดูรายละเอียดและอัตราเปรียบเทียบเป้าหมาย
            </p>
          </div>

          {/* Filter Pills (Smooth scroll on mobile, flex on desktop) */}
          <div className="flex items-center gap-1.5 bg-zinc-200/70 dark:bg-zinc-800/80 p-1 rounded-2xl overflow-x-auto no-scrollbar scroll-smooth w-full sm:w-auto -mx-1 px-1 sm:mx-0">
            <button
              onClick={() => setFilterGroup('all')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-h-[40px] shrink-0 active:scale-95 ${
                filterGroup === 'all'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              ทั้งหมด ({categories.length})
            </button>
            <button
              onClick={() => setFilterGroup('apple')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-h-[40px] shrink-0 active:scale-95 ${
                filterGroup === 'apple'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
               Apple
            </button>
            <button
              onClick={() => setFilterGroup('it')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-h-[40px] shrink-0 active:scale-95 ${
                filterGroup === 'it'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              💻 IT & Phone
            </button>
            <button
              onClick={() => setFilterGroup('btb')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-h-[40px] shrink-0 active:scale-95 ${
                filterGroup === 'btb'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              🟡 BTB
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((item, idx) => {
            const isHighAchieve = item.achievePct >= 70;
            const isModerate = item.achievePct >= 40 && item.achievePct < 70;
            const progressColor = isHighAchieve
              ? 'from-emerald-500 to-teal-400'
              : isModerate
              ? 'from-blue-500 to-indigo-500'
              : 'from-amber-500 to-rose-500';

            return (
              <div
                key={`${item.id}-${idx}`}
                className="ios-card rounded-3xl p-5 hover:border-blue-500/40 transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-2xl p-2 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 shadow-inner">
                        {item.icon}
                      </span>
                      <div>
                        <h4 className="font-bold text-zinc-900 dark:text-white text-base group-hover:text-blue-500 transition-colors">
                          {item.name}
                        </h4>
                        <span className="inline-flex items-center text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                          📦 {formatNumber(item.units)} {item.unitsLabel}
                        </span>
                      </div>
                    </div>

                    {/* Achieve % pill */}
                    <div className="text-right">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-xl text-xs font-bold ${
                          isHighAchieve
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : isModerate
                            ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                            : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        {formatPercent(item.achievePct)}
                      </span>
                    </div>
                  </div>

                  {/* Numbers Details */}
                  <div className="space-y-1.5 my-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">ขายได้จริง</span>
                      <span className="text-lg font-extrabold text-zinc-900 dark:text-white">
                        {formatBaht(item.sold)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>เป้าหมาย (Target)</span>
                      <span>{formatBaht(item.target)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>ห่างจากเป้า</span>
                      <span className="text-amber-600 dark:text-amber-400 font-medium">
                        {formatBaht(item.diff)}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1 my-3">
                    <div className="w-full h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${progressColor} transition-all duration-500`}
                        style={{ width: `${Math.min(item.achievePct, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer: Forecast */}
                <div className="pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-xs">
                  <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    Forecast:
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCompactBaht(item.forecastBath)}{' '}
                    <span className="text-[10px] font-semibold text-zinc-400">
                      ({formatPercent(item.forecastPct)})
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
