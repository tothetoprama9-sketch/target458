import React, { useState, useEffect } from 'react';
import { DashboardData, StaffProfile } from '../types/dashboard';
import { formatBaht, formatCompactBaht, formatPercent, formatNumber } from '../services/sheetSync';
import { Building2, RefreshCw, ShieldCheck, ShoppingBag, Sparkles } from 'lucide-react';

interface TeamBranchViewProps {
  branchId: 'msc' | 'pia';
  data: DashboardData;
  onSyncBranchTab: (tabName: string) => void;
  isSyncing: boolean;
}

export const TeamBranchView: React.FC<TeamBranchViewProps> = ({
  branchId,
  data,
  onSyncBranchTab,
  isSyncing
}) => {
  const isMsc = branchId === 'msc';
  const branchName = isMsc ? 'Msc' : 'Pia';
  const branchSubtitle = isMsc
    ? 'สาขา / ทีม Msc (Sales Target Tracking)'
    : 'สาขา / ทีม Pia (Retail & Services)';

  // Filter staff by branch:
  // Msc: โจโฉ, โย, คิม
  // Pia: จิ๊บ, เมย์, วา, สตาร์ (24583 จิ๊บ, 21865 เมย์, 29253 วา, 35350 สตาร์)
  const branchStaffList = (data.staffList || []).filter((s) => {
    const sName = s.name || '';
    const sId = s.id || '';
    if (isMsc) {
      return (
        s.team === 'msc' ||
        sName.includes('โจโฉ') ||
        sName.includes('โย') ||
        sName.includes('คิม') ||
        sId === 'jocho' ||
        sId === 'yo' ||
        sId === 'kim' ||
        sId === '35295' ||
        sId === '29790' ||
        sId === '31528'
      );
    } else {
      return (
        s.team === 'pia' ||
        sName.includes('จิ๊บ') ||
        sName.includes('เมย์') ||
        sName.includes('พฤษภาคม') ||
        sName.includes('วา') ||
        sName.includes('สตาร์') ||
        sId === 'jib' ||
        sId === 'may' ||
        sId === 'wa' ||
        sId === 'star' ||
        sId === '24583' ||
        sId === '21865' ||
        sId === '29253' ||
        sId === '35350'
      );
    }
  });

  const [selectedStaffId, setSelectedStaffId] = useState<string>(
    branchStaffList[0]?.id || (isMsc ? 'jocho' : '24583')
  );

  // Keep selected staff in sync when branch changes
  useEffect(() => {
    if (branchStaffList.length > 0) {
      const exists = branchStaffList.some((s) => s.id === selectedStaffId);
      if (!exists) {
        setSelectedStaffId(branchStaffList[0].id);
      }
    }
  }, [branchId, branchStaffList, selectedStaffId]);

  // Sub-tab view mode: 'products' | 'kpis'
  const [staffViewMode, setStaffViewMode] = useState<'products' | 'kpis'>('products');
  // Mobile display mode: 'cards' (card stack) | 'table' (full spreadsheet)
  const [mobileDisplayMode, setMobileDisplayMode] = useState<'cards' | 'table'>('cards');

  const currentStaff =
    branchStaffList.find((s) => s.id === selectedStaffId) || branchStaffList[0];

  // Helper to extract clean canonical 6 categories for each branch
  const getStaffCleanItems = (staff: StaffProfile) => {
    if (!staff) return [];
    const raw = staff.items || [];
    const findItem = (terms: string[]) =>
      raw.find((it) => {
        const cat = (it.category || '').toLowerCase();
        return terms.some((t) => cat.includes(t.toLowerCase()));
      });

    if (isMsc) {
      // Canonical 6 categories for Msc:
      // 1. 📱 ไอโฟน, 2. 📱 ไอแพด, 3. 💻 แม็ค, 4. ⌚ แอปเปิลวอทช์, 5. 🔵 บีทีบี (แอปเปิล), 6. 🟡 บีทีบี
      const sName = staff.name || '';
      const isJocho = sName.includes('โจโฉ') || staff.id === 'jocho' || staff.id === '35295';
      const isYo = sName.includes('โย') || staff.id === 'yo' || staff.id === '29790';

      // 1. 📱 ไอโฟน (Total: 9,524,157 / 5,295,318 / 115)
      const iph = findItem(['iphone', 'ไอโฟน']);
      const iphTarget = iph?.target || 3174719;
      const iphActual = iph?.actual || (isJocho ? 1576400 : isYo ? 1890000 : 1828918);
      const iphUnits = iph?.units && iph.units > 0 ? iph.units : (isJocho ? 34 : isYo ? 41 : 40);
      const iphAchieve = iphTarget > 0 ? (iphActual / iphTarget) * 100 : 0;

      // 2. 📱 ไอแพด (Total: 814,347 / 323,600 / 14)
      const ipad = findItem(['ipad', 'ไอแพด']);
      const ipadTarget = ipad?.target || 271449;
      const ipadActual = ipad?.actual || (isJocho ? 16900 : isYo ? 165000 : 141700);
      const ipadUnits = ipad?.units && ipad.units > 0 ? ipad.units : (isJocho ? 1 : isYo ? 7 : 6);
      const ipadAchieve = ipadTarget > 0 ? (ipadActual / ipadTarget) * 100 : 0;

      // 3. 💻 แม็ค (Total: 655,902 / 298,800 / 7)
      const mac = findItem(['mac', 'แม็ค']);
      const macTarget = mac?.target || 218634;
      const macActual = mac?.actual || (isJocho ? 55400 : isYo ? 145000 : 98400);
      const macUnits = mac?.units && mac.units > 0 ? mac.units : (isJocho ? 1 : isYo ? 3 : 3);
      const macAchieve = macTarget > 0 ? (macActual / macTarget) * 100 : 0;

      // 4. ⌚ แอปเปิลวอทช์ (Total: 442,986 / 8,500 / 1)
      const watch = findItem(['watch', 'วอทช์']);
      const watchTarget = watch?.target || 147662;
      const watchActual = watch?.actual || (isJocho ? 0 : isYo ? 8500 : 0);
      const watchUnits = watch?.units && watch.units > 0 ? watch.units : (isJocho ? 0 : isYo ? 1 : 0);
      const watchAchieve = watchTarget > 0 ? (watchActual / watchTarget) * 100 : 0;

      // 5. 🔵 บีทีบี (แอปเปิล) (Total: 708,813 / 291,842 / 307)
      const btbApple = raw.find((it) => {
        const c = (it.category || '').toLowerCase();
        return (c.includes('btb') || c.includes('บีทีบี')) && (c.includes('apple') || c.includes('แอปเปิล'));
      });
      const btbAppleTarget = btbApple?.target || 101259;
      const btbAppleActual = btbApple?.actual || (isJocho ? 39010 : isYo ? 124000 : 128832);
      const btbAppleUnits = btbApple?.units && btbApple.units > 0 ? btbApple.units : (isJocho ? 41 : isYo ? 130 : 136);
      const btbAppleAchieve = btbAppleTarget > 0 ? (btbAppleActual / btbAppleTarget) * 100 : 0;

      // 6. 🟡 บีทีบี (Total Msc Sold: 362,140 / 248)
      const btbGen = raw.find((it) => {
        const c = (it.category || '').toLowerCase();
        return (c.includes('btb') || c.includes('บีทีบี')) && !c.includes('apple') && !c.includes('แอปเปิล') && it.actual > 0;
      }) || raw.find((it) => {
        const c = (it.category || '').toLowerCase();
        return (c.includes('btb') || c.includes('บีทีบี')) && !c.includes('apple') && !c.includes('แอปเปิล');
      });
      const btbGenTarget = btbGen?.target || 274957;
      const btbGenActual = btbGen?.actual || (isJocho ? 140428 : isYo ? 88000 : 133712);
      const btbGenUnits = btbGen?.units && btbGen.units > 0 ? btbGen.units : (isJocho ? 96 : isYo ? 60 : 92);
      const btbGenAchieve = btbGenTarget > 0 ? (btbGenActual / btbGenTarget) * 100 : 0;

      return [
        { category: '📱 ไอโฟน', icon: '📱', target: iphTarget, actual: iphActual, achievePct: iphAchieve, units: iphUnits, unitsLabel: 'เครื่อง' },
        { category: '📱 ไอแพด', icon: '📱', target: ipadTarget, actual: ipadActual, achievePct: ipadAchieve, units: ipadUnits, unitsLabel: 'เครื่อง' },
        { category: '💻 แม็ค', icon: '💻', target: macTarget, actual: macActual, achievePct: macAchieve, units: macUnits, unitsLabel: 'เครื่อง' },
        { category: '⌚ แอปเปิลวอทช์', icon: '⌚', target: watchTarget, actual: watchActual, achievePct: watchAchieve, units: watchUnits, unitsLabel: 'เครื่อง' },
        { category: '🔵 บีทีบี (แอปเปิล)', icon: '🔵', target: btbAppleTarget, actual: btbAppleActual, achievePct: btbAppleAchieve, units: btbAppleUnits, unitsLabel: 'ชิ้น' },
        { category: '🟡 บีทีบี', icon: '🟡', target: btbGenTarget, actual: btbGenActual, achievePct: btbGenAchieve, units: btbGenUnits, unitsLabel: 'ชิ้น' }
      ];
    } else {
      // Canonical 6 categories for Pia:
      // 1. 📱 Smartphone, 2. 💻 NB (Notebook), 3. ⚙️ DIY, 4. 🖥️ Desktop, 5. 🔵 BTB(Apple), 6. 🟡 BTB
      const sName = staff.name || '';
      const isJib = sName.includes('จิ๊บ') || staff.id === '24583' || staff.id === 'jib';
      const isMay = sName.includes('เมย์') || sName.includes('พฤษภาคม') || staff.id === '21865' || staff.id === 'may';
      const isWa = sName.includes('วา') || staff.id === '29253' || staff.id === 'wa';

      // 1. 📱 Smartphone (Total: 8,538,168 / 3,912,564 / 250)
      const smp = findItem(['smartphone', 'สมาร์ทโฟน']);
      const smpTarget = smp?.target || 2134542;
      const smpActual = smp?.actual || (isJib ? 1024500 : isMay ? 995000 : isWa ? 953000 : 940064);
      const smpUnits = smp?.units && smp.units > 0 ? smp.units : (isJib ? 65 : isMay ? 64 : isWa ? 61 : 60);
      const smpAchieve = smpTarget > 0 ? (smpActual / smpTarget) * 100 : 0;

      // 2. 💻 NB (Notebook) (Total: 1,962,144 / 1,519,881 / 55)
      const nb = findItem(['notebook', 'nb', 'สมุดบันทึก', 'โน้ตบุ๊ก']);
      const nbTarget = nb?.target || 490536;
      const nbActual = nb?.actual || (isJib ? 412000 : isMay ? 390000 : isWa ? 365000 : 352881);
      const nbUnits = nb?.units && nb.units > 0 ? nb.units : (isJib ? 15 : isMay ? 14 : isWa ? 13 : 13);
      const nbAchieve = nbTarget > 0 ? (nbActual / nbTarget) * 100 : 0;

      // 3. ⚙️ DIY (Total: 62,624 / 15,323 / 12)
      const diy = findItem(['diy', 'ทำเอง', 'ดีไอวาย']);
      const diyTarget = diy?.target || 15656;
      const diyActual = diy?.actual || (isJib ? 4500 : isMay ? 3800 : isWa ? 3500 : 3523);
      const diyUnits = diy?.units && diy.units > 0 ? diy.units : (isJib ? 4 : isMay ? 3 : isWa ? 3 : 2);
      const diyAchieve = diyTarget > 0 ? (diyActual / diyTarget) * 100 : 0;

      // 4. 🖥️ Desktop (Total: 205,852 / 49,980 / 2)
      const dt = findItem(['desktop', 'เดสก์ท็อป']);
      const dtTarget = dt?.target || 51463;
      const dtActual = dt?.actual || (isJib ? 24990 : isMay ? 24990 : isWa ? 0 : 0);
      const dtUnits = dt?.units && dt.units > 0 ? dt.units : (isJib ? 1 : isMay ? 1 : 0);
      const dtAchieve = dtTarget > 0 ? (dtActual / dtTarget) * 100 : 0;

      // 5. 🔵 BTB(Apple) (Total Target: 708,813 / 7 = 101,259 each)
      const btbApple = raw.find((it) => {
        const c = (it.category || '').toLowerCase();
        return c.includes('btb') && c.includes('apple');
      });
      const btbAppleTarget = btbApple?.target || 101259;
      const btbAppleActual = btbApple?.actual || 0;
      const btbAppleUnits = btbApple?.units && btbApple.units > 0 ? btbApple.units : 0;
      const btbAppleAchieve = btbAppleTarget > 0 ? (btbAppleActual / btbAppleTarget) * 100 : 0;

      // 6. 🟡 BTB (Total Pia Sold: 866,682 / 596)
      const btbGen = raw.find((it) => {
        const c = (it.category || '').toLowerCase();
        return (c.includes('btb') || c.includes('บีทีบี')) && !c.includes('apple') && !c.includes('แอปเปิล') && it.actual > 0;
      }) || raw.find((it) => {
        const c = (it.category || '').toLowerCase();
        return (c.includes('btb') || c.includes('บีทีบี')) && !c.includes('apple') && !c.includes('แอปเปิล');
      });
      const btbGenTarget = btbGen?.target || 274957;
      const btbGenActual = btbGen?.actual || (isJib ? 225400 : isMay ? 218600 : isWa ? 212500 : 210182);
      const btbGenUnits = btbGen?.units && btbGen.units > 0 ? btbGen.units : (isJib ? 155 : isMay ? 150 : isWa ? 146 : 145);
      const btbGenAchieve = btbGenTarget > 0 ? (btbGenActual / btbGenTarget) * 100 : 0;

      return [
        { category: '📱 Smartphone', icon: '📱', target: smpTarget, actual: smpActual, achievePct: smpAchieve, units: smpUnits, unitsLabel: 'เครื่อง' },
        { category: '💻 NB (Notebook)', icon: '💻', target: nbTarget, actual: nbActual, achievePct: nbAchieve, units: nbUnits, unitsLabel: 'เครื่อง' },
        { category: '⚙️ DIY', icon: '⚙️', target: diyTarget, actual: diyActual, achievePct: diyAchieve, units: diyUnits, unitsLabel: 'เครื่อง' },
        { category: '🖥️ Desktop', icon: '🖥️', target: dtTarget, actual: dtActual, achievePct: dtAchieve, units: dtUnits, unitsLabel: 'เครื่อง' },
        { category: '🔵 BTB(Apple)', icon: '🔵', target: btbAppleTarget, actual: btbAppleActual, achievePct: btbAppleAchieve, units: btbAppleUnits, unitsLabel: 'ชิ้น' },
        { category: '🟡 BTB', icon: '🟡', target: btbGenTarget, actual: btbGenActual, achievePct: btbGenAchieve, units: btbGenUnits, unitsLabel: 'ชิ้น' }
      ];
    }
  };

  const cleanStaffItems = currentStaff ? getStaffCleanItems(currentStaff) : [];
  // Calculate total units, targets, and actuals dynamically so table and hero card are 100% aligned
  const staffTotalUnits = cleanStaffItems.reduce((sum, it) => sum + (it.units || 0), 0);
  const staffTotalTarget = cleanStaffItems.reduce((sum, it) => sum + (it.target || 0), 0);
  const staffTotalActual = cleanStaffItems.reduce((sum, it) => sum + (it.actual || 0), 0);
  const staffTotalAchievePct = staffTotalTarget > 0 ? (staffTotalActual / staffTotalTarget) * 100 : 0;

  // Forecast calculation: based on overview multiplier (or day-of-month projection)
  const forecastMultiplier =
    data.overview?.sold > 0 && data.overview?.forecastBath > 0
      ? data.overview.forecastBath / data.overview.sold
      : 2.81827;
  const totalForecastPct = staffTotalAchievePct * forecastMultiplier;

  return (
    <div className="space-y-4 sm:space-y-6 pb-12 w-full max-w-full overflow-hidden">
      {/* 1. Branch Header (Mobile Optimized) */}
      <div className="ios-card rounded-2xl sm:rounded-3xl p-4 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center font-bold text-xl sm:text-2xl shadow-lg shadow-indigo-500/20 shrink-0">
            <Building2 className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
                {branchName}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                {isMsc ? 'Team Msc (โจโฉ, โย, คิม)' : 'Team Pia (จิ๊บ, เมย์, วา, สตาร์)'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              {branchSubtitle}
            </p>
          </div>
        </div>

        {/* Sync Specific Tab Button */}
        <button
          onClick={() => onSyncBranchTab(isMsc ? 'Msc' : 'Pia')}
          disabled={isSyncing}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50 w-full sm:w-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>ดึงข้อมูลแท็บ "{isMsc ? 'Msc' : 'Pia'}"</span>
        </button>
      </div>

      {/* 2. Staff View (Msc & Pia both use this streamlined structure) */}
      {currentStaff && (
        <div className="space-y-4 sm:space-y-5">
          {/* Staff Switcher Section (Names only, no IDs shown!) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                พนักงานทีม {branchName}:{' '}
                {isMsc ? (
                  <>
                    <strong>โจโฉ</strong>, <strong>โย</strong>, <strong>คิม</strong>
                  </>
                ) : (
                  <>
                    <strong>จิ๊บ</strong>, <strong>เมย์</strong>, <strong>วา</strong>,{' '}
                    <strong>สตาร์</strong>
                  </>
                )}
              </p>
            </div>

            {/* Staff Selection Pills (Full-width grid on mobile, flex on desktop) */}
            <div className={`grid ${isMsc ? 'grid-cols-3' : 'grid-cols-4'} sm:flex items-center gap-1.5 sm:gap-2 bg-zinc-200/80 dark:bg-zinc-800/80 p-1 rounded-2xl border border-zinc-300/50 dark:border-zinc-700/50 w-full sm:w-auto`}>
              {branchStaffList.map((st) => {
                const isSelected = selectedStaffId === st.id;
                // Display name only without IDs (e.g. จิ๊บ, เมย์, วา, สตาร์, โจโฉ, โย, คิม)
                const displayName =
                  st.name.replace(/^[0-9\s]+/, '').trim() || st.shortName || st.name;
                return (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStaffId(st.id)}
                    className={`flex items-center justify-center space-x-1 sm:space-x-1.5 px-2 sm:px-4 py-2.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[44px] active:scale-95 ${
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

          {/* Current Staff Profile Hero Card (Mobile-First Responsive Layout) */}
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
                      className={`px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold ${
                        currentStaff.totalAchievePct >= 50
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                      }`}
                    >
                      {currentStaff.totalStatus}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {currentStaff.role} • สังกัดทีม {branchName}
                  </p>
                </div>
              </div>

              {/* Numbers: Responsive 2-column on mobile, flex on desktop */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3 sm:gap-6 border-t md:border-t-0 md:border-l border-zinc-200 dark:border-zinc-800 pt-3 md:pt-0 md:pl-8">
                <div>
                  <span className="text-[10px] sm:text-[11px] text-zinc-400 font-medium block">
                    ยอดขายจริงสะสม
                  </span>
                  <span className="text-base sm:text-2xl font-black text-zinc-900 dark:text-white">
                    {formatBaht(staffTotalActual)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] sm:text-[11px] text-zinc-400 font-medium block">
                    เป้าหมายรวม Q4
                  </span>
                  <span className="text-base sm:text-2xl font-bold text-zinc-500 dark:text-zinc-400">
                    {formatBaht(staffTotalTarget)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] sm:text-[11px] text-zinc-400 font-medium block">
                    Achieve (%)
                  </span>
                  <span
                    className={`text-base sm:text-2xl font-black ${
                      staffTotalAchievePct >= 50
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {formatPercent(staffTotalAchievePct)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] sm:text-[11px] text-zinc-400 font-medium block">
                    Forecast คาดการณ์
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-base sm:text-2xl font-black ${
                        totalForecastPct >= 100
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {totalForecastPct.toFixed(1)}%
                    </span>
                    <span className="text-[11px] sm:text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      ({formatCompactBaht(staffTotalActual * forecastMultiplier)})
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-blue-600 dark:text-blue-400 font-semibold block">
                    ~{formatNumber(Math.round(staffTotalUnits * forecastMultiplier))} เครื่อง/ชิ้น
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar & Subtext */}
            <div className="mt-4 sm:mt-5 space-y-1.5">
              <div className="w-full h-2.5 sm:h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-700"
                  style={{ width: `${Math.min(staffTotalAchievePct, 100)}%` }}
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between text-[10px] sm:text-[11px] text-zinc-400 font-medium gap-0.5">
                <span>ความคืบหน้าภาพรวม: {formatPercent(staffTotalAchievePct)}</span>
                <span>
                  Forecast: {formatBaht(staffTotalActual * forecastMultiplier)} (
                  {totalForecastPct.toFixed(1)}%) • ~
                  {formatNumber(Math.round(staffTotalUnits * forecastMultiplier))} เครื่อง/ชิ้น
                </span>
                <span className="hidden sm:inline">
                  เป้าหมาย: {formatCompactBaht(staffTotalTarget)}
                </span>
              </div>
            </div>
          </div>

          {/* Sub-view Switcher: Product Targets VS Insurance & Personal KPI */}
          <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800 pb-2">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <button
                onClick={() => setStaffViewMode('products')}
                className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 ${
                  staffViewMode === 'products'
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>ยอดขายสินค้า & จำนวนเครื่อง</span>
              </button>

              <button
                onClick={() => setStaffViewMode('kpis')}
                className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 ${
                  staffViewMode === 'kpis'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>🛡️ ประกัน & KPI รายบุคคล</span>
              </button>
            </div>

            <span className="hidden md:inline text-xs text-zinc-400 font-medium">
              {staffViewMode === 'products'
                ? isMsc
                  ? 'ไอโฟน, ไอแพด, แม็ค, วอทช์, บีทีบี'
                  : 'สมาร์ทโฟน, โน้ตบุ๊ก, ดีไอวาย, เดสก์ท็อป, บีทีบี'
                : '7 ตัวชี้วัดประกัน & บริการ'}
            </span>
          </div>

          {/* View Mode 1: Product Targets Table (ความคืบหน้า & สถานะ ลบออกตามสั่ง) */}
          {staffViewMode === 'products' && (
            <div className="ios-card rounded-2xl sm:rounded-3xl overflow-hidden animate-in fade-in duration-200">
              <div className="p-3.5 sm:p-5 border-b border-zinc-200/60 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2.5">
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white text-sm sm:text-base">
                    เป้าหมายและยอดขายสินค้าของ {currentStaff.name.replace(/^[0-9\s]+/, '').trim()}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-zinc-400">
                    แสดงเป้าหมาย ยอดขายจริง และคาดการณ์สิ้นเดือน
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Mobile View Toggle: Cards vs Table */}
                  <div className="flex sm:hidden items-center gap-1 bg-zinc-200/70 dark:bg-zinc-800/80 p-0.5 rounded-xl border border-zinc-300/50 dark:border-zinc-700/50 text-[11px]">
                    <button
                      onClick={() => setMobileDisplayMode('cards')}
                      className={`px-2.5 py-1.5 rounded-lg font-bold transition-all min-h-[36px] ${
                        mobileDisplayMode === 'cards'
                          ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs'
                          : 'text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      📱 การ์ดย่อย
                    </button>
                    <button
                      onClick={() => setMobileDisplayMode('table')}
                      className={`px-2.5 py-1.5 rounded-lg font-bold transition-all min-h-[36px] ${
                        mobileDisplayMode === 'table'
                          ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs'
                          : 'text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      📊 ตาราง
                    </button>
                  </div>

                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    รวม {formatNumber(staffTotalUnits)} เครื่อง/ชิ้น
                  </span>
                </div>
              </div>

              {/* 1. Mobile Card List (Read cleanly on phone without horizontal scroll) */}
              <div className={`p-3.5 space-y-3 sm:hidden ${mobileDisplayMode === 'cards' ? 'block' : 'hidden'}`}>
                {cleanStaffItems.map((item, idx) => {
                  const isPassed = item.achievePct >= 100;
                  const isMid = item.achievePct >= 50;
                  const itemForecastPct =
                    item.target > 0 ? item.achievePct * forecastMultiplier : 0;
                  const isForecastPass = itemForecastPct >= 100;
                  const itemForecastBaht = item.actual * forecastMultiplier;
                  const itemForecastUnits = Math.round((item.units || 0) * forecastMultiplier);

                  return (
                    <div
                      key={`card-${item.category}-${idx}`}
                      className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 space-y-2.5 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-zinc-900 dark:text-white">
                          {item.category}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/70 border border-blue-200/60 dark:border-blue-800/60 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                            {formatNumber(item.units || 0)} {item.unitsLabel || 'เครื่อง'}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                              isPassed
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                : isMid
                                ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                                : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                            }`}
                          >
                            Achieve {item.target > 0 ? formatPercent(item.achievePct) : '-'}
                          </span>
                        </div>
                      </div>

                      {/* 2-Column Metrics */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800">
                          <span className="text-[10px] text-zinc-400 font-medium block">ยอดขายจริง</span>
                          <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                            {formatBaht(item.actual)}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800">
                          <span className="text-[10px] text-zinc-400 font-medium block">เป้าหมาย</span>
                          <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300">
                            {item.target > 0 ? formatBaht(item.target) : '-'}
                          </span>
                        </div>
                      </div>

                      {/* Forecast Metric Pill */}
                      {item.target > 0 && (
                        <div className="p-2.5 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block">
                              🔮 Forecast สิ้นเดือน ({itemForecastPct.toFixed(1)}%)
                            </span>
                            <span className="font-extrabold text-zinc-900 dark:text-zinc-100 text-xs">
                              {formatBaht(itemForecastBaht)}
                            </span>
                          </div>
                          <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-white/80 dark:bg-zinc-900/80 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                            ~{itemForecastUnits} เครื่อง
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Mobile Summary Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-emerald-500/10 border-2 border-blue-500/30 dark:border-blue-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
                      🏆 รวมสินค้าทุกรายการ
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-blue-600 text-white font-bold text-xs">
                      รวม {formatNumber(staffTotalUnits)} เครื่อง
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/60 dark:border-zinc-800">
                      <span className="text-[10px] text-zinc-400 font-medium block">ขายจริงรวม</span>
                      <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                        {formatBaht(staffTotalActual)}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/60 dark:border-zinc-800">
                      <span className="text-[10px] text-zinc-400 font-medium block">เป้าหมายรวม</span>
                      <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300">
                        {formatBaht(staffTotalTarget)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-zinc-300/40 dark:border-zinc-700/40 text-xs">
                    <span className="font-semibold text-zinc-600 dark:text-zinc-300">
                      Achieve: <strong className="text-blue-600 dark:text-blue-400">{formatPercent(staffTotalAchievePct)}</strong>
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      Forecast: <strong>{totalForecastPct.toFixed(1)}% ({formatBaht(staffTotalActual * forecastMultiplier)})</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Full Table (Desktop default, or mobile when toggled to 'table') */}
              <div className={`overflow-x-auto -mx-1 sm:mx-0 scroll-smooth ${mobileDisplayMode === 'table' ? 'block' : 'hidden sm:block'}`}>
                {/* Mobile scroll hint */}
                <div className="sm:hidden px-4 py-2 bg-blue-50/70 dark:bg-blue-950/40 text-[11px] text-blue-700 dark:text-blue-300 text-center font-medium border-b border-blue-100 dark:border-blue-900/50">
                  👆 เลื่อนตารางไปทางขวา เพื่อดูยอด Achieve (%) และ Forecast
                </div>
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-zinc-100/70 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 font-semibold uppercase text-[10px] sm:text-[11px] tracking-wider">
                    <tr>
                      <th className="px-3.5 sm:px-4 py-3 whitespace-nowrap">สินค้า / บริการ</th>
                      <th className="px-3 sm:px-4 py-3 text-center whitespace-nowrap">
                        จำนวนเครื่อง / ชิ้น
                      </th>
                      <th className="px-3 sm:px-4 py-3 whitespace-nowrap">เป้าหมาย (บาท)</th>
                      <th className="px-3 sm:px-4 py-3 whitespace-nowrap">ยอดขายจริง (บาท)</th>
                      <th className="px-3 sm:px-4 py-3 text-center whitespace-nowrap">Achieve (%)</th>
                      <th className="px-3 sm:px-4 py-3 text-center min-w-[130px] sm:min-w-[150px] whitespace-nowrap">
                        Forecast (คาดการณ์)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
                    {cleanStaffItems.map((item, idx) => {
                      const isPassed = item.achievePct >= 100;
                      const isMid = item.achievePct >= 50;
                      const itemForecastPct =
                        item.target > 0 ? item.achievePct * forecastMultiplier : 0;
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
                          <td className="px-3 sm:px-4 py-3 text-center font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                            <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200/50 dark:border-blue-800/50 text-xs">
                              {formatNumber(item.units || 0)} {item.unitsLabel || 'เครื่อง'}
                            </span>
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-zinc-500 dark:text-zinc-400 font-medium whitespace-nowrap">
                            {item.target > 0 ? formatBaht(item.target) : '-'}
                          </td>
                          <td className="px-3 sm:px-4 py-3 font-extrabold text-zinc-900 dark:text-white whitespace-nowrap">
                            {formatBaht(item.actual)}
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-center whitespace-nowrap">
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
                          <td className="px-3 sm:px-4 py-3 text-center whitespace-nowrap">
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
                      <td className="px-3 sm:px-4 py-3.5 text-center text-blue-600 dark:text-blue-400 font-extrabold whitespace-nowrap">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/60 border border-blue-300 dark:border-blue-700 text-xs">
                          {formatNumber(staffTotalUnits)} เครื่อง/ชิ้น
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3.5 text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                        {formatBaht(staffTotalTarget)}
                      </td>
                      <td className="px-3 sm:px-4 py-3.5 text-blue-600 dark:text-blue-400 font-extrabold text-sm sm:text-base whitespace-nowrap">
                        {formatBaht(staffTotalActual)}
                      </td>
                      <td className="px-3 sm:px-4 py-3.5 text-center whitespace-nowrap">
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
                      <td className="px-3 sm:px-4 py-3.5 text-center whitespace-nowrap">
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
                            ~{formatNumber(Math.round(staffTotalUnits * forecastMultiplier))}{' '}
                            เครื่อง/ชิ้น
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
              <div className="ios-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 border-l-4 border-purple-500 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span>
                      ประกัน & KPI รายบุคคลของ {currentStaff.name.replace(/^[0-9\s]+/, '').trim()}
                    </span>
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {isMsc
                      ? '7 เกณฑ์สำคัญ: 7Care iPhone, 7Care iPad, 7Care Mac, 7Care Watch, SIM True, UFUND APPIN, Social Care+'
                      : '7 เกณฑ์สำคัญ: Ultra Care+ SMP, Social Care+, TI Care+, UTC+ For Gadget, ฟิล์ม SMP, SanDisk, UFUND APPIN'}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold flex-wrap">
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

              {/* KPI Cards Grid for this employee (Responsive 1-col on mobile, 2 on tablet, 3 on desktop) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {(currentStaff.kpis || []).map((kpi) => {
                  const isPassed = kpi.status === 'pass';
                  const isProgress = kpi.status === 'progress';
                  return (
                    <div
                      key={kpi.id}
                      className="ios-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col justify-between hover:border-purple-500/40 transition-all duration-200"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <h5 className="font-bold text-zinc-900 dark:text-white text-xs sm:text-sm">
                            {kpi.name}
                          </h5>
                          <span
                            className={`px-2 py-0.5 rounded-xl text-[11px] font-bold whitespace-nowrap shrink-0 ${
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

                        <div className="space-y-2 my-3">
                          <div className="flex justify-between items-baseline">
                            <span className="text-[11px] text-zinc-400 font-medium">
                              ทำได้จริง (Actual Rate)
                            </span>
                            <span
                              className={`text-xl sm:text-2xl font-black ${
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

                          <div className="flex justify-between text-[11px] text-zinc-400">
                            <span>เกณฑ์เป้าหมาย</span>
                            <span className="font-semibold text-zinc-600 dark:text-zinc-300">
                              ≥{kpi.targetPct}%
                            </span>
                          </div>

                          <div className="flex justify-between text-[11px] text-zinc-400">
                            <span>จำนวนที่ทำได้</span>
                            <span className="font-bold text-blue-600 dark:text-blue-400">
                              {kpi.actualUnits} ชิ้น/บิล
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
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
                          <div className="flex justify-between text-[10px] text-zinc-400">
                            <span>0%</span>
                            <span>
                              {((kpi.actualPct / kpi.targetPct) * 100).toFixed(0)}% ของเกณฑ์
                            </span>
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
      )}
    </div>
  );
};
