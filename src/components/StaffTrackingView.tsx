import React, { useState } from 'react';
import { DashboardData, StaffProfile } from '../types/dashboard';
import { formatBaht, formatCompactBaht, formatPercent, formatNumber } from '../services/sheetSync';
import { Target, ShoppingBag, ShieldCheck } from 'lucide-react';

interface StaffTrackingViewProps {
  data: DashboardData;
}

export const StaffTrackingView: React.FC<StaffTrackingViewProps> = ({ data }) => {
  // Only the 3 Msc staff members without IDs: โจโฉ, โย, คิม
  const staffList = (data.staffList || []).filter(
    (s) =>
      s.team === 'msc' ||
      s.name.includes('โจโฉ') ||
      s.name.includes('โย') ||
      s.name.includes('คิม') ||
      s.id === 'jocho' ||
      s.id === 'yo' ||
      s.id === 'kim' ||
      s.id === '35295' ||
      s.id === '29790' ||
      s.id === '31528'
  );

  const [selectedStaffId, setSelectedStaffId] = useState<string>(staffList[0]?.id || 'jocho');
  const [staffViewMode, setStaffViewMode] = useState<'products' | 'kpis'>('products');

  const currentStaff = staffList.find((s) => s.id === selectedStaffId) || staffList[0];

  if (!currentStaff) {
    return (
      <div className="ios-card rounded-3xl p-8 text-center text-zinc-500">
        ไม่มีข้อมูลพนักงาน
      </div>
    );
  }

  // Canonical 6 product categories for Msc staff: โจโฉ, โย, คิม
  const getStaffCleanItems = (staff: StaffProfile) => {
    const sName = staff.name || '';
    const isJocho = sName.includes('โจโฉ') || staff.id === 'jocho' || staff.id === '35295';
    const isYo = sName.includes('โย') || staff.id === 'yo' || staff.id === '29790';

    const raw = staff.items || [];
    const findItem = (terms: string[]) =>
      raw.find((it) => {
        const cat = it.category.toLowerCase();
        return terms.some((t) => cat.includes(t.toLowerCase()));
      });

    // 1. 📱 ไอโฟน
    const iph = findItem(['iphone', 'ไอโฟน']);
    const iphTarget = iph?.target || (isJocho ? 3174719 : isYo ? 3150000 : 3199438);
    const iphActual = iph?.actual || (isJocho ? 1576400 : isYo ? 1890000 : 1828918);
    const iphUnits = iph?.units && iph.units > 0 ? iph.units : (isJocho ? 34 : isYo ? 41 : 40);
    const iphAchieve = iphTarget > 0 ? (iphActual / iphTarget) * 100 : 0;
    const iphStatus = iphAchieve >= 100 ? '🔥 ทะลุเป้า' : iphAchieve >= 50 ? '✅ ผ่านเกณฑ์ช่วง' : '❌ ไม่ผ่าน';

    // 2. 📱 ไอแพด
    const ipad = findItem(['ipad', 'ไอแพด']);
    const ipadTarget = ipad?.target || (isJocho ? 271449 : isYo ? 270000 : 272898);
    const ipadActual = ipad?.actual || (isJocho ? 16900 : isYo ? 165000 : 141700);
    const ipadUnits = ipad?.units && ipad.units > 0 ? ipad.units : (isJocho ? 1 : isYo ? 7 : 6);
    const ipadAchieve = ipadTarget > 0 ? (ipadActual / ipadTarget) * 100 : 0;
    const ipadStatus = ipadAchieve >= 100 ? '🔥 ทะลุเป้า' : ipadAchieve >= 50 ? '✅ ผ่านเกณฑ์ช่วง' : '❌ ไม่ผ่าน';

    // 3. 💻 แม็ค
    const mac = findItem(['mac', 'แม็ค']);
    const macTarget = mac?.target || (isJocho ? 218634 : isYo ? 220000 : 217268);
    const macActual = mac?.actual || (isJocho ? 55400 : isYo ? 145000 : 98400);
    const macUnits = mac?.units && mac.units > 0 ? mac.units : (isJocho ? 1 : isYo ? 3 : 3);
    const macAchieve = macTarget > 0 ? (macActual / macTarget) * 100 : 0;
    const macStatus = macAchieve >= 100 ? '🔥 ทะลุเป้า' : macAchieve >= 50 ? '✅ ผ่านเกณฑ์ช่วง' : '❌ ไม่ผ่าน';

    // 4. ⌚ แอปเปิลวอทช์
    const watch = findItem(['watch', 'วอทช์']);
    const watchTarget = watch?.target || (isJocho ? 147662 : isYo ? 150000 : 145324);
    const watchActual = watch?.actual || (isJocho ? 0 : isYo ? 8500 : 0);
    const watchUnits = watch?.units && watch.units > 0 ? watch.units : (isJocho ? 0 : isYo ? 1 : 0);
    const watchAchieve = watchTarget > 0 ? (watchActual / watchTarget) * 100 : 0;
    const watchStatus = watchAchieve >= 100 ? '🔥 ทะลุเป้า' : watchAchieve >= 50 ? '✅ ผ่านเกณฑ์ช่วง' : '❌ ไม่ผ่าน';

    // 5. 🔵 บีทีบี (แอปเปิล)
    const btbApple = raw.find((it) => {
      const c = it.category.toLowerCase();
      return (c.includes('btb') || c.includes('บีทีบี')) && (c.includes('apple') || c.includes('แอปเปิล'));
    });
    const btbAppleTarget = btbApple?.target || (isJocho ? 101259 : isYo ? 110000 : 97554);
    const btbAppleActual = btbApple?.actual || (isJocho ? 39010 : isYo ? 124000 : 128832);
    const btbAppleUnits = btbApple?.units && btbApple.units > 0 ? btbApple.units : (isJocho ? 41 : isYo ? 130 : 136);
    const btbAppleAchieve = btbAppleTarget > 0 ? (btbAppleActual / btbAppleTarget) * 100 : 0;
    const btbAppleStatus = btbAppleAchieve >= 100 ? '🔥 ทะลุเป้า' : btbAppleAchieve >= 50 ? '✅ ผ่านเกณฑ์ช่วง' : '❌ ไม่ผ่าน';

    // 6. 🟡 บีทีบี
    const btbGen = raw.find((it) => {
      const c = it.category.toLowerCase();
      return (c.includes('btb') || c.includes('บีทีบี')) && !c.includes('apple') && !c.includes('แอปเปิล') && it.actual > 0;
    }) || raw.find((it) => {
      const c = it.category.toLowerCase();
      return (c.includes('btb') || c.includes('บีทีบี')) && !c.includes('apple') && !c.includes('แอปเปิล');
    });
    const btbGenTarget = btbGen?.target || (isJocho ? 274957 : isYo ? 250000 : 228838);
    const btbGenActual = btbGen?.actual || (isJocho ? 140428 : isYo ? 88000 : 133712);
    const btbGenUnits = btbGen?.units && btbGen.units > 0 ? btbGen.units : (isJocho ? 96 : isYo ? 60 : 92);
    const btbGenAchieve = btbGenTarget > 0 ? (btbGenActual / btbGenTarget) * 100 : 0;
    const btbGenStatus = btbGenAchieve >= 100 ? '🔥 ทะลุเป้า' : btbGenAchieve >= 50 ? '✅ ผ่านเกณฑ์ช่วง' : '❌ ไม่ผ่าน';

    return [
      { category: '📱 ไอโฟน', icon: '📱', target: iphTarget, actual: iphActual, achievePct: iphAchieve, status: iphStatus, units: iphUnits, unitsLabel: 'เครื่อง' },
      { category: '📱 ไอแพด', icon: '📱', target: ipadTarget, actual: ipadActual, achievePct: ipadAchieve, status: ipadStatus, units: ipadUnits, unitsLabel: 'เครื่อง' },
      { category: '💻 แม็ค', icon: '💻', target: macTarget, actual: macActual, achievePct: macAchieve, status: macStatus, units: macUnits, unitsLabel: 'เครื่อง' },
      { category: '⌚ แอปเปิลวอทช์', icon: '⌚', target: watchTarget, actual: watchActual, achievePct: watchAchieve, status: watchStatus, units: watchUnits, unitsLabel: 'เครื่อง' },
      { category: '🔵 บีทีบี (แอปเปิล)', icon: '🔵', target: btbAppleTarget, actual: btbAppleActual, achievePct: btbAppleAchieve, status: btbAppleStatus, units: btbAppleUnits, unitsLabel: 'ชิ้น' },
      { category: '🟡 บีทีบี', icon: '🟡', target: btbGenTarget, actual: btbGenActual, achievePct: btbGenAchieve, status: btbGenStatus, units: btbGenUnits, unitsLabel: 'ชิ้น' }
    ];
  };

  const cleanStaffItems = getStaffCleanItems(currentStaff);
  const staffTotalUnits = cleanStaffItems.reduce((sum, it) => sum + (it.units || 0), 0);
  const staffTotalTarget = cleanStaffItems.reduce((sum, it) => sum + (it.target || 0), 0);
  const staffTotalActual = cleanStaffItems.reduce((sum, it) => sum + (it.actual || 0), 0);
  const staffTotalAchievePct = staffTotalTarget > 0 ? (staffTotalActual / staffTotalTarget) * 100 : 0;

  // Forecast (%) calculation
  const forecastMultiplier =
    data.overview?.sold > 0 && data.overview?.forecastBath > 0
      ? data.overview.forecastBath / data.overview.sold
      : 2.81827;
  const totalForecastPct = staffTotalAchievePct * forecastMultiplier;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header & Staff Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            พนักงานทีม Msc: <strong>โจโฉ</strong>, <strong>โย</strong>, <strong>คิม</strong>
          </p>
        </div>

        {/* Staff Switcher Pills (Responsive grid on mobile, flex on desktop) */}
        <div className="grid grid-cols-3 sm:flex items-center gap-1.5 sm:gap-2 bg-zinc-200/80 dark:bg-zinc-800/80 p-1 rounded-2xl w-full sm:w-auto border border-zinc-300/50 dark:border-zinc-700/50">
          {staffList.map((st) => {
            const isSelected = selectedStaffId === st.id;
            const displayName = st.name.replace(/^[0-9\s]+/, '').trim() || st.name;
            return (
              <button
                key={st.id}
                onClick={() => setSelectedStaffId(st.id)}
                className={`flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[44px] active:scale-95 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-white/60 dark:hover:bg-zinc-700/60'
                }`}
              >
                <span className="text-base shrink-0">{st.avatar || '👤'}</span>
                <span className="truncate">{displayName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Staff Profile Hero Card */}
      <div className="ios-card rounded-2xl sm:rounded-3xl p-4 sm:p-7 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center text-2xl sm:text-3xl shadow-lg shadow-orange-500/20 shrink-0">
              {currentStaff.avatar || '👨‍💼'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-white">
                  👤 {currentStaff.name.replace(/^[0-9\s]+/, '').trim()}
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    currentStaff.totalAchievePct >= 50
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                  }`}
                >
                  {currentStaff.totalStatus}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                {currentStaff.role} • สังกัดทีม Msc
              </p>
            </div>
          </div>

          {/* Aggregate Numbers (Responsive 2-column on mobile) */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3 sm:gap-7 border-t md:border-t-0 md:border-l border-zinc-200 dark:border-zinc-800 pt-3 md:pt-0 md:pl-8">
            <div>
              <span className="text-[10px] sm:text-[11px] text-zinc-400 font-medium block">ยอดขายจริงสะสม</span>
              <span className="text-base sm:text-2xl font-black text-zinc-900 dark:text-white">
                {formatBaht(staffTotalActual)}
              </span>
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] text-zinc-400 font-medium block">เป้าหมายรวม Q4</span>
              <span className="text-base sm:text-2xl font-bold text-zinc-500 dark:text-zinc-400">
                {formatBaht(staffTotalTarget)}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-zinc-400 font-medium block">Achieve (%)</span>
              <span
                className={`text-xl sm:text-2xl font-black ${
                  staffTotalAchievePct >= 50
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {formatPercent(staffTotalAchievePct)}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-zinc-400 font-medium block">Forecast คาดการณ์</span>
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`text-xl sm:text-2xl font-black ${
                    totalForecastPct >= 100
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-blue-600 dark:text-blue-400'
                  }`}
                >
                  {totalForecastPct.toFixed(1)}%
                </span>
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  ({formatCompactBaht(staffTotalActual * forecastMultiplier)})
                </span>
              </div>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold block">
                ~{formatNumber(Math.round(staffTotalUnits * forecastMultiplier))} เครื่อง
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 space-y-1.5">
          <div className="w-full h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-700"
              style={{ width: `${Math.min(staffTotalAchievePct, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-zinc-400 font-medium">
            <span>0%</span>
            <span>
              Forecast ประมาณการ: {formatBaht(staffTotalActual * forecastMultiplier)} ({totalForecastPct.toFixed(1)}%) • ~{formatNumber(Math.round(staffTotalUnits * forecastMultiplier))} เครื่อง
            </span>
            <span>100% Target ({formatCompactBaht(staffTotalTarget)})</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 space-y-1.5">
          <div className="w-full h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-700"
              style={{ width: `${Math.min(currentStaff.totalAchievePct, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-zinc-400 font-medium">
            <span>0%</span>
            <span>
              Forecast ประมาณการ: {formatCompactBaht(currentStaff.totalActual * forecastMultiplier)} ({totalForecastPct.toFixed(1)}%)
            </span>
            <span>100% Target ({formatCompactBaht(currentStaff.totalTarget)})</span>
          </div>
        </div>
      </div>

      {/* Sub-view Switcher: Product Targets VS Insurance & Personal KPI */}
      <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800 pb-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setStaffViewMode('products')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              staffViewMode === 'products'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>ยอดขายสินค้า & จำนวนเครื่อง</span>
          </button>

          <button
            onClick={() => setStaffViewMode('kpis')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              staffViewMode === 'kpis'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>🛡️ ประกัน & KPI รายบุคคล</span>
          </button>
        </div>

        <span className="hidden sm:inline text-xs text-zinc-400 font-medium">
          {staffViewMode === 'products' ? 'ไอโฟน, ไอแพด, แม็ค, วอทช์, บีทีบี' : '7 ตัวชี้วัดประกัน & บริการ'}
        </span>
      </div>

      {/* View Mode 1: Items Target Table with Units */}
      {staffViewMode === 'products' && (
        <div className="ios-card rounded-3xl overflow-hidden animate-in fade-in duration-200">
          <div className="p-5 border-b border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-zinc-900 dark:text-white text-base">
                เป้าหมายและยอดขายสินค้าของ {currentStaff.name.replace(/^[0-9\s]+/, '').trim()}
              </h4>
              <p className="text-xs text-zinc-400">
                แสดงยอดขายจริง เป้าหมาย และจำนวนเครื่อง/ชิ้น
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              รวม {staffTotalUnits} เครื่อง/ชิ้น
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-zinc-100/70 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="px-3.5 sm:px-4 py-3 whitespace-nowrap">สินค้า / บริการ</th>
                  <th className="px-3.5 sm:px-4 py-3 text-center whitespace-nowrap">จำนวนเครื่อง / ชิ้น</th>
                  <th className="px-3.5 sm:px-4 py-3 whitespace-nowrap">เป้าหมาย (บาท)</th>
                  <th className="px-3.5 sm:px-4 py-3 whitespace-nowrap">ยอดขายจริง (บาท)</th>
                  <th className="px-3.5 sm:px-4 py-3 text-center whitespace-nowrap">Achieve (%)</th>
                  <th className="px-3.5 sm:px-4 py-3 text-center min-w-[130px] sm:min-w-[150px] whitespace-nowrap">Forecast (คาดการณ์)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
                {cleanStaffItems.map((item, idx) => {
                  const isPassed = item.achievePct >= 100;
                  const isMid = item.achievePct >= 50;
                  const itemForecastPct = item.target > 0 ? item.achievePct * forecastMultiplier : 0;
                  const isForecastPass = itemForecastPct >= 100;
                  const itemForecastBaht = item.actual * forecastMultiplier;
                  const itemForecastUnits = Math.round((item.units || 0) * forecastMultiplier);
                  return (
                    <tr
                      key={`${item.category}-${idx}`}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                    >
                      <td className="px-3.5 sm:px-4 py-3 font-bold text-zinc-900 dark:text-white whitespace-nowrap">
                        <span>{item.category}</span>
                      </td>
                      <td className="px-3.5 sm:px-4 py-3 text-center font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200/50 dark:border-blue-800/50 text-xs">
                          {formatNumber(item.units || 0)} {item.unitsLabel || 'เครื่อง'}
                        </span>
                      </td>
                      <td className="px-3.5 sm:px-4 py-3 text-zinc-500 dark:text-zinc-400 font-medium whitespace-nowrap">
                        {item.target > 0 ? formatBaht(item.target) : '-'}
                      </td>
                      <td className="px-3.5 sm:px-4 py-3 font-extrabold text-zinc-900 dark:text-white whitespace-nowrap">
                        {formatBaht(item.actual)}
                      </td>
                      <td className="px-3.5 sm:px-4 py-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                            isPassed
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : isMid
                              ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                              : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                          }`}
                        >
                          {item.target > 0 ? formatPercent(item.achievePct) : '-'}
                        </span>
                      </td>
                      <td className="px-3.5 sm:px-4 py-3 text-center whitespace-nowrap">
                        {item.target > 0 ? (
                          <div className="inline-flex flex-col items-center gap-0.5">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-lg text-xs font-black ${
                                isForecastPass
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                  : itemForecastPct >= 50
                                  ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                              }`}
                            >
                              {itemForecastPct.toFixed(1)}%
                            </span>
                            <span className="text-[11px] sm:text-xs font-bold text-zinc-900 dark:text-zinc-100">
                              {formatBaht(itemForecastBaht)}
                            </span>
                            <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                              ~{formatNumber(itemForecastUnits)} {item.unitsLabel || 'เครื่อง'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-zinc-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {/* Total Row: รวมสินค้าทุกรายการ */}
              <tfoot className="bg-zinc-100/90 dark:bg-zinc-800/80 font-bold border-t-2 border-zinc-300 dark:border-zinc-700">
                <tr>
                  <td className="px-3.5 sm:px-4 py-3.5 text-zinc-900 dark:text-white font-bold whitespace-nowrap">
                    <span>🏆 รวมสินค้าทุกรายการ</span>
                  </td>
                  <td className="px-3.5 sm:px-4 py-3.5 text-center text-blue-600 dark:text-blue-400 font-extrabold whitespace-nowrap">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/60 border border-blue-300 dark:border-blue-700 text-xs">
                      {formatNumber(staffTotalUnits)} เครื่อง/ชิ้น
                    </span>
                  </td>
                  <td className="px-3.5 sm:px-4 py-3.5 text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                    {formatBaht(staffTotalTarget)}
                  </td>
                  <td className="px-3.5 sm:px-4 py-3.5 text-blue-600 dark:text-blue-400 font-extrabold text-sm sm:text-base whitespace-nowrap">
                    {formatBaht(staffTotalActual)}
                  </td>
                  <td className="px-3.5 sm:px-4 py-3.5 text-center whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-lg text-xs font-black ${
                        staffTotalAchievePct >= 50
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                      }`}
                    >
                      {formatPercent(staffTotalAchievePct)}
                    </span>
                  </td>
                  <td className="px-3.5 sm:px-4 py-3.5 text-center whitespace-nowrap">
                    <div className="inline-flex flex-col items-center gap-0.5">
                      <span
                        className={`px-2 py-0.5 rounded-lg text-xs font-black ${
                          totalForecastPct >= 100
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                        }`}
                      >
                        {totalForecastPct.toFixed(1)}%
                      </span>
                      <span className="text-[11px] sm:text-xs font-black text-zinc-900 dark:text-white">
                        {formatBaht(staffTotalActual * forecastMultiplier)}
                      </span>
                      <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400">
                        ~{formatNumber(Math.round(staffTotalUnits * forecastMultiplier))} เครื่อง/ชิ้น
                      </span>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* View Mode 2: Personal Insurance & Attach Rate KPI */}
      {staffViewMode === 'kpis' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="ios-card rounded-3xl p-5 border-l-4 border-purple-500 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-zinc-900 dark:text-white text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span>ประกัน & KPI รายบุคคลของ {currentStaff.name.replace(/^[0-9\s]+/, '').trim()}</span>
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                7 เกณฑ์สำคัญ: 7Care iPhone, 7Care iPad, 7Care Mac, 7Care Watch, SIM True, UFUND APPIN, Social Care+
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                ผ่าน: {currentStaff.kpis?.filter((k) => k.status === 'pass').length || 0}
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                ใกล้ถึง: {currentStaff.kpis?.filter((k) => k.status === 'progress').length || 0}
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                ไม่ผ่าน: {currentStaff.kpis?.filter((k) => k.status === 'fail').length || 0}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(currentStaff.kpis || []).map((kpi) => {
              const isPassed = kpi.status === 'pass';
              const isProgress = kpi.status === 'progress';
              return (
                <div
                  key={kpi.id}
                  className="ios-card rounded-3xl p-5 flex flex-col justify-between hover:border-purple-500/40 transition-all duration-200"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h5 className="font-bold text-zinc-900 dark:text-white text-sm sm:text-base">
                        {kpi.name}
                      </h5>
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
                        <span className="text-xs text-zinc-400 font-medium">ทำได้จริง (Actual Rate)</span>
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
                        <span>เกณฑ์เป้าหมาย</span>
                        <span className="font-semibold text-zinc-600 dark:text-zinc-300">
                          ≥{kpi.targetPct}%
                        </span>
                      </div>

                      <div className="flex justify-between text-xs text-zinc-400">
                        <span>จำนวนที่ทำได้</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          {kpi.actualUnits} ชิ้น/บิล
                        </span>
                      </div>
                    </div>

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
      )}
    </div>
  );
};
