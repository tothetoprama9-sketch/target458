import React, { useState } from 'react';
import { DailySalesRecord, DashboardData } from '../types/dashboard';
import { formatBaht, formatCompactBaht, formatNumber, formatPercent } from '../services/sheetSync';
import { Calendar, TrendingUp, Award, Zap, BarChart3, LineChart, ChevronRight, Sparkles } from 'lucide-react';

interface DailySalesViewProps {
  data: DashboardData;
}

export const DailySalesView: React.FC<DailySalesViewProps> = ({ data }) => {
  const records = data.dailyRecords || [];
  const [selectedDay, setSelectedDay] = useState<DailySalesRecord>(records[records.length - 1] || records[0]);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  if (records.length === 0) {
    return (
      <div className="ios-card rounded-3xl p-8 text-center text-zinc-500">
        ไม่มีข้อมูลบันทึกรายวัน
      </div>
    );
  }

  // Calculate statistics
  const totalSalesRecorded = records.reduce((acc, r) => acc + r.sales, 0);
  const totalUnitsRecorded = records.reduce((acc, r) => acc + r.units, 0);
  const avgDailySales = Math.round(totalSalesRecorded / records.length);
  const bestDay = [...records].sort((a, b) => b.sales - a.sales)[0];

  // Chart dimensions
  const svgWidth = 800;
  const svgHeight = 280;
  const paddingX = 40;
  const paddingY = 30;
  const maxSales = Math.max(...records.map((r) => Math.max(r.sales, r.target))) * 1.15;

  const points = records.map((r, idx) => {
    const x = paddingX + (idx / (records.length - 1 || 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - (r.sales / maxSales) * (svgHeight - paddingY * 2);
    return { x, y, record: r };
  });

  // Generate SVG smooth bezier path
  const linePath = points.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = arr[i - 1];
    const cpX = (prev.x + point.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${point.y}, ${point.x} ${point.y}`;
  }, '');

  // Generate SVG area fill path
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`
    : '';

  // Target line path
  const targetY = svgHeight - paddingY - (801280 / maxSales) * (svgHeight - paddingY * 2);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header with View Toggle & Metric Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Calendar className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
              กราฟสรุปยอดขายรายวัน (Daily Sales Trend)
            </h2>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            ข้อมูลเชื่อมโยงจาก TODAY_10_69 อัพเดทตามบิลขายจริงรายวัน
          </p>
        </div>

        {/* Chart View Switcher */}
        <div className="flex items-center gap-1.5 bg-zinc-200/70 dark:bg-zinc-800/80 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setChartType('line')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              chartType === 'line'
                ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            <span>เส้นแนวโน้ม</span>
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              chartType === 'bar'
                ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>กราฟแท่ง</span>
          </button>
        </div>
      </div>

      {/* 2. Key Daily Stats Pills */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="ios-card rounded-2xl p-4">
          <span className="text-xs text-zinc-400 font-medium">ยอดขายเฉลี่ยต่อวัน</span>
          <div className="text-lg sm:text-2xl font-extrabold text-zinc-900 dark:text-white mt-0.5">
            {formatBaht(avgDailySales)}
          </div>
          <span className="text-[11px] text-zinc-400 font-medium">จาก {records.length} วันที่บันทึก</span>
        </div>

        <div className="ios-card rounded-2xl p-4">
          <span className="text-xs text-zinc-400 font-medium">วันที่ขายดีที่สุด (Best Day)</span>
          <div className="text-lg sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {bestDay ? formatCompactBaht(bestDay.sales) : '-'}
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
            🏆 {bestDay?.dateStr} ({bestDay?.units} เครื่อง)
          </span>
        </div>

        <div className="ios-card rounded-2xl p-4">
          <span className="text-xs text-zinc-400 font-medium">จำนวนเครื่องที่ขายได้</span>
          <div className="text-lg sm:text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">
            {formatNumber(totalUnitsRecorded)}
          </div>
          <span className="text-[11px] text-zinc-400 font-medium">เฉลี่ย {Math.round(totalUnitsRecorded / records.length)} เครื่อง/วัน</span>
        </div>

        <div className="ios-card rounded-2xl p-4">
          <span className="text-xs text-zinc-400 font-medium">เป้าหมายเฉลี่ยต่อวัน</span>
          <div className="text-lg sm:text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">
            ฿801,280
          </div>
          <span className="text-[11px] text-zinc-400 font-medium">Pace คำนวณตาม 31 วัน</span>
        </div>
      </div>

      {/* 3. The Interactive SVG Chart Card */}
      <div className="ios-card rounded-3xl p-5 sm:p-7 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <span>ยอดขายสะสมและสปีดรายวัน</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                Live Data
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              แตะหรือวางเมาส์บนจุดกราฟเพื่อดูรายละเอียดของวันนั้น
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
              <span className="text-zinc-600 dark:text-zinc-300">ยอดขายจริง (บาท)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-amber-500 border-t border-dashed border-amber-500 inline-block" />
              <span className="text-zinc-600 dark:text-zinc-300">เกณฑ์เป้าหมายต่อวัน</span>
            </div>
          </div>
        </div>

        {/* SVG Render Container */}
        <div className="w-full overflow-x-auto no-scrollbar">
          <div className="min-w-[650px]">
            {chartType === 'line' ? (
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible">
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#007AFF" stopOpacity="0.4" />
                    <stop offset="85%" stopColor="#007AFF" stopOpacity="0.02" />
                    <stop offset="100%" stopColor="#007AFF" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="lineStrokeGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#007AFF" />
                    <stop offset="50%" stopColor="#5856D6" />
                    <stop offset="100%" stopColor="#34C759" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                {[0.25, 0.5, 0.75, 1].map((ratio, i) => {
                  const y = svgHeight - paddingY - ratio * (svgHeight - paddingY * 2);
                  const labelVal = Math.round(maxSales * ratio);
                  return (
                    <g key={i}>
                      <line
                        x1={paddingX}
                        y1={y}
                        x2={svgWidth - paddingX}
                        y2={y}
                        stroke="currentColor"
                        className="text-zinc-200 dark:text-zinc-800"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={paddingX - 8}
                        y={y + 3}
                        textAnchor="end"
                        className="text-[10px] fill-zinc-400 font-medium"
                      >
                        {formatCompactBaht(labelVal)}
                      </text>
                    </g>
                  );
                })}

                {/* Target Pace Dashed Line */}
                <line
                  x1={paddingX}
                  y1={targetY}
                  x2={svgWidth - paddingX}
                  y2={targetY}
                  stroke="#FF9500"
                  strokeWidth="1.5"
                  strokeDasharray="5 5"
                />
                <text
                  x={svgWidth - paddingX + 5}
                  y={targetY + 3}
                  className="text-[9px] fill-amber-500 font-bold"
                >
                  Target Pace
                </text>

                {/* Area under curve */}
                <path d={areaPath} fill="url(#salesGradient)" />

                {/* Smooth Curve */}
                <path
                  d={linePath}
                  fill="none"
                  stroke="url(#lineStrokeGradient)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Interactive Points */}
                {points.map((pt, i) => {
                  const isSelected = selectedDay.day === pt.record.day;
                  const isHigh = pt.record.sales >= pt.record.target;
                  return (
                    <g
                      key={i}
                      onClick={() => setSelectedDay(pt.record)}
                      className="cursor-pointer group"
                    >
                      {/* Invisible hover area */}
                      <circle cx={pt.x} cy={pt.y} r={16} fill="transparent" />

                      {/* Selected Glow Ring */}
                      {isSelected && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={10}
                          className="stroke-blue-500 animate-ping opacity-50"
                          strokeWidth="2"
                          fill="transparent"
                        />
                      )}

                      {/* Visible Point */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isSelected ? 6 : 4.5}
                        className={`transition-all duration-200 ${
                          isSelected
                            ? 'fill-blue-600 stroke-white dark:stroke-black stroke-2'
                            : isHigh
                            ? 'fill-emerald-500 stroke-white dark:stroke-zinc-900 stroke-2'
                            : 'fill-blue-500 stroke-white dark:stroke-zinc-900 stroke-2'
                        } group-hover:r-7`}
                      />

                      {/* X Axis Labels */}
                      <text
                        x={pt.x}
                        y={svgHeight - 8}
                        textAnchor="middle"
                        className={`text-[9px] font-medium transition-colors ${
                          isSelected
                            ? 'fill-blue-600 dark:fill-blue-400 font-bold'
                            : 'fill-zinc-400 dark:fill-zinc-500'
                        }`}
                      >
                        {pt.record.day}
                      </text>
                    </g>
                  );
                })}
              </svg>
            ) : (
              /* Bar Chart View */
              <div className="h-64 flex items-end gap-2 pt-6 pb-4 px-2 border-b border-zinc-200 dark:border-zinc-800">
                {records.map((r) => {
                  const heightPct = (r.sales / maxSales) * 100;
                  const isSelected = selectedDay.day === r.day;
                  const isOverTarget = r.sales >= r.target;
                  return (
                    <div
                      key={r.day}
                      onClick={() => setSelectedDay(r)}
                      className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
                    >
                      <div className="relative w-full flex items-end justify-center h-full">
                        <div
                          style={{ height: `${heightPct}%` }}
                          className={`w-full max-w-[28px] rounded-t-xl transition-all duration-300 ${
                            isSelected
                              ? 'bg-blue-600 shadow-lg shadow-blue-500/30'
                              : isOverTarget
                              ? 'bg-gradient-to-t from-emerald-500 to-teal-400 group-hover:opacity-90'
                              : 'bg-gradient-to-t from-blue-500/70 to-indigo-500/70 group-hover:from-blue-500 group-hover:to-indigo-500'
                          }`}
                        />
                      </div>
                      <span
                        className={`text-[10px] mt-2 font-medium ${
                          isSelected
                            ? 'text-blue-600 dark:text-blue-400 font-bold'
                            : 'text-zinc-400'
                        }`}
                      >
                        {r.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Selected Day Info Card Banner */}
        <div className="mt-5 p-4 rounded-2xl bg-zinc-100/90 dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
              {selectedDay.day}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-zinc-900 dark:text-white text-sm">
                  {selectedDay.dateStr}
                </span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                    selectedDay.sales >= selectedDay.target
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {selectedDay.sales >= selectedDay.target ? '🔥 ทะลุเป้ารายวัน' : '⚡ กำลังเร่ง'}
                </span>
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                สินค้าขายดีประจำวัน: {selectedDay.topProduct || 'iPhone 16 Series'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div>
              <span className="text-[10px] text-zinc-400 block font-medium">ยอดขายประจำวัน</span>
              <span className="text-base font-extrabold text-zinc-900 dark:text-white">
                {formatBaht(selectedDay.sales)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block font-medium">จำนวนเครื่อง</span>
              <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                {formatNumber(selectedDay.units)} เครื่อง
              </span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block font-medium">ยอดสะสมถึงวันนี้</span>
              <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                {formatCompactBaht(selectedDay.cumulativeSales)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Day-by-Day Table */}
      <div className="ios-card rounded-3xl overflow-hidden">
        <div className="p-5 border-b border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between">
          <h3 className="font-bold text-zinc-900 dark:text-white text-base">
            ตารางยอดขายรายวันแบบละเอียด (TODAY_10_69)
          </h3>
          <span className="text-xs text-zinc-400">
            {records.length} วันทำการ
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-zinc-100/70 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-5 py-3">วันที่</th>
                <th className="px-5 py-3">ยอดขายจริง (บาท)</th>
                <th className="px-5 py-3">เป้าหมายประจำวัน</th>
                <th className="px-5 py-3">สถานะเทียบเป้า</th>
                <th className="px-5 py-3">จำนวนเครื่อง</th>
                <th className="px-5 py-3">ยอดขายสะสม</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
              {records.map((row) => {
                const isOver = row.sales >= row.target;
                const pct = Math.round((row.sales / row.target) * 100);
                return (
                  <tr
                    key={row.day}
                    className="hover:bg-blue-50/50 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-bold text-zinc-900 dark:text-white">
                      {row.dateStr}
                    </td>
                    <td className="px-5 py-3.5 font-extrabold text-zinc-900 dark:text-white">
                      {formatBaht(row.sales)}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-500 dark:text-zinc-400">
                      {formatBaht(row.target)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold ${
                          isOver
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                        }`}
                      >
                        {pct}% {isOver ? '✅' : ''}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-blue-600 dark:text-blue-400 font-semibold">
                      {formatNumber(row.units)} เครื่อง
                    </td>
                    <td className="px-5 py-3.5 text-zinc-700 dark:text-zinc-300 font-medium">
                      {formatBaht(row.cumulativeSales)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
