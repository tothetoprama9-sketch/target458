import React, { useState } from 'react';
import { DashboardData } from '../types/dashboard';
import { ShieldAlert, CheckCircle2, AlertTriangle, XCircle, Search, Filter } from 'lucide-react';

interface ServicesKPIViewProps {
  data: DashboardData;
}

export const ServicesKPIView: React.FC<ServicesKPIViewProps> = ({ data }) => {
  const [filter, setFilter] = useState<'all' | 'pass' | 'progress' | 'fail'>('all');
  const [search, setSearch] = useState('');

  const kpis = data.protectionKPIs || [];

  const filtered = kpis.filter((k) => {
    if (filter !== 'all' && k.status !== filter) return false;
    if (search && !k.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const passCount = kpis.filter((k) => k.status === 'pass').length;
  const progressCount = kpis.filter((k) => k.status === 'progress').length;
  const failCount = kpis.filter((k) => k.status === 'fail').length;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header and Stat Counters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
              🛡️ ประกัน & อัตราพ่วงบริการ (Attach Rate KPIs)
            </h2>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            เกณฑ์เปอร์เซ็นต์ขั้นต่ำของประกัน 7Care, Care+, SIM True, Film และ Gadget
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-zinc-200/70 dark:bg-zinc-800/80 p-1 rounded-2xl self-start sm:self-auto overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'all'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            ทั้งหมด ({kpis.length})
          </button>
          <button
            onClick={() => setFilter('pass')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'pass'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            ✅ ผ่าน ({passCount})
          </button>
          <button
            onClick={() => setFilter('progress')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'progress'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-amber-600 dark:text-amber-400'
            }`}
          >
            🤘 ใกล้ถึง ({progressCount})
          </button>
          <button
            onClick={() => setFilter('fail')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'fail'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            ❌ ไม่ผ่าน ({failCount})
          </button>
        </div>
      </div>

      {/* 2. Search & Overview Banner */}
      <div className="ios-card rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
          <input
            type="text"
            placeholder="ค้นหาประกัน / บริการ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-zinc-900 dark:text-white"
          />
        </div>
        <div className="flex items-center gap-3 text-xs text-zinc-500 self-end sm:self-auto">
          <span>อัตราผ่านเฉลี่ย: <strong className="text-zinc-900 dark:text-white">{Math.round((passCount / kpis.length) * 100)}%</strong></span>
          <span>•</span>
          <span>ชิ้นส่วนพ่วงรวม: <strong className="text-purple-600 dark:text-purple-400">{kpis.reduce((acc, k) => acc + k.actualUnits, 0)} รายการ</strong></span>
        </div>
      </div>

      {/* 3. Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((kpi) => {
          const isPassed = kpi.status === 'pass';
          const isProgress = kpi.status === 'progress';
          return (
            <div
              key={kpi.id}
              className="ios-card rounded-3xl p-5 flex flex-col justify-between hover:border-purple-500/40 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h4 className="font-bold text-zinc-900 dark:text-white text-base">
                    {kpi.name}
                  </h4>
                  <span
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap ${
                      isPassed
                        ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
                        : isProgress
                        ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300'
                        : 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300'
                    }`}
                  >
                    {kpi.statusText}
                  </span>
                </div>

                <div className="space-y-2 my-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-zinc-400 font-medium">อัตราพ่วงจริง (Actual Rate)</span>
                    <span
                      className={`text-2xl font-black ${
                        isPassed
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : isProgress
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {kpi.actualPct}%
                    </span>
                  </div>

                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>เกณฑ์เป้าหมาย (Target)</span>
                    <span className="font-semibold text-zinc-600 dark:text-zinc-300">
                      ≥{kpi.targetPct}%
                    </span>
                  </div>

                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>จำนวนที่ขายได้</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {kpi.actualUnits} ชิ้น/บิล
                    </span>
                  </div>
                </div>

                {/* Progress bar compared to target */}
                <div className="space-y-1">
                  <div className="w-full h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isPassed
                          ? 'bg-emerald-500'
                          : isProgress
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{
                        width: `${Math.min((kpi.actualPct / kpi.targetPct) * 100, 100)}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-zinc-400 font-medium">
                    <span>0%</span>
                    <span>เป้าหมาย {kpi.targetPct}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
