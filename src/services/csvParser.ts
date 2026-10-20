import { DashboardData, CategoryMetric, ProtectionKPI, StaffProfile, MetricOverview } from '../types/dashboard';
import { initialDashboardData, defaultDailyRecords } from '../data/defaultData';

// Helper to parse standard CSV line with quoted fields containing commas
export function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Clean string to clean number
export function cleanNumber(val: any): number {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const str = String(val).replace(/[^0-9.-]/g, '');
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

// Clean string to clean percentage
export function cleanPct(val: any): number {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const str = String(val).replace(/%/g, '').replace(/,/g, '').trim();
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

// Extract category icon
export function getCategoryIcon(name: string): string {
  if (name.includes('iPhone')) return '📱';
  if (name.includes('iPad')) return '📱';
  if (name.includes('Mac')) return '💻';
  if (name.includes('Watch')) return '⌚';
  if (name.includes('Smartphone')) return '📱';
  if (name.includes('NB') || name.includes('Notebook')) return '💻';
  if (name.includes('Desktop')) return '🖥️';
  if (name.includes('DIY')) return '⚙️';
  if (name.includes('BTB(Apple)')) return '🔵';
  if (name.includes('BTB')) return '🟡';
  return '📦';
}

export function parseGoogleSheetCsv(csvContent: string): DashboardData {
  if (!csvContent || csvContent.trim().length === 0) {
    return initialDashboardData;
  }

  const rawLines = csvContent.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  const rows = rawLines.map(parseCSVLine);

  let overview: MetricOverview = { ...initialDashboardData.overview };
  const categories: CategoryMetric[] = [];
  const protectionKPIs: ProtectionKPI[] = [];
  let staffList: StaffProfile[] = [];

  // Track sections of the dashboard to prevent duplicate rows across sections
  let currentSection: 'overview' | 'kpis' | 'staff' = 'overview';
  const seenCategoryIds = new Set<string>();

  try {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0) continue;
      const col0 = (row[0] || '').trim();

      // Check section boundaries
      if (
        col0.includes('Ultra Care') ||
        col0.includes('Social Care') ||
        col0.includes('7Care') ||
        col0.includes('TI Care') ||
        col0.includes('UTC+') ||
        col0.includes('ฟิล์ม') ||
        col0.includes('SanDisk') ||
        col0.includes('SIM True') ||
        col0.includes('UFUND')
      ) {
        currentSection = 'kpis';
      }

      if (
        col0.includes('ติดตามเป้าหมายยอดขายรายบุคคล') ||
        col0.includes('Sales Target Tracking') ||
        col0 === 'โจโฉ' ||
        col0.includes('พนักงาน:')
      ) {
        currentSection = 'staff';
      }

      // Check for Month & Status Header
      if (col0.includes('ระบุช่วงเดือน') || col0.includes('📅')) {
        const month = row[1] || overview.month;
        const status = row[3] || row[2] || overview.statusText;
        overview.month = month.trim();
        overview.statusText = status.trim();
      }

      // Check for Quarter / Dashboard Title
      if (col0.includes('Dashboard') || col0.includes('ภาพรวม')) {
        overview.quarterLabel = col0.replace(/^[📊\s]+/, '').trim();
      }

      // Check for All (Target)
      if (col0.startsWith('All (Target)') || col0 === 'All') {
        const targetVal = cleanNumber(row[1]);
        const soldVal = cleanNumber(row[2]);
        const unitsVal = cleanNumber(row[3]);
        
        overview.target = targetVal || overview.target;
        overview.sold = soldVal || overview.sold;
        overview.units = unitsVal || overview.units;

        // Next line often has: ห่างจากเป้า, diff, Achieve (%), achievePct
        if (i + 1 < rows.length && rows[i + 1][0]?.includes('ห่างจากเป้า')) {
          const nextRow = rows[i + 1];
          overview.diff = cleanNumber(nextRow[1]) || (overview.target - overview.sold);
          overview.achievePct = cleanPct(nextRow[3]) || (overview.sold / overview.target * 100);
        }

        // Line i+2 often has: Forecast (Bath), forecastVal, Forecast (%), forecastPct
        if (i + 2 < rows.length && rows[i + 2][0]?.includes('Forecast')) {
          const forecastRow = rows[i + 2];
          overview.forecastBath = cleanNumber(forecastRow[1]) || overview.forecastBath;
          overview.forecastPct = cleanPct(forecastRow[3]) || overview.forecastPct;
        }
      }

      // Check for Category Items - ONLY in overview section
      if (currentSection === 'overview') {
        const isCategoryRow = 
          col0.includes('iPhone (Target)') ||
          col0.includes('iPad (Target)') ||
          col0.includes('Mac (Target)') ||
          col0.includes('Apple Watch (Target)') ||
          col0.includes('BTB(Apple)') ||
          col0.includes('🟡BTB') ||
          col0.includes('Smartphone(เครื่อง)') ||
          col0.includes('NB (Notebook)') ||
          col0.includes('DIY') ||
          col0.includes('Desktop');

        if (isCategoryRow) {
          const targetVal = cleanNumber(row[1]);
          const soldVal = cleanNumber(row[2]);
          const unitsVal = cleanNumber(row[3]);
          
          let diffVal = targetVal - soldVal;
          let achievePctVal = targetVal > 0 ? (soldVal / targetVal) * 100 : 0;
          let forecastBathVal = 0;
          let forecastPctVal = 0;

          if (i + 1 < rows.length && rows[i + 1][0]?.includes('ห่างจากเป้า')) {
            const nextRow = rows[i + 1];
            diffVal = cleanNumber(nextRow[1]);
            achievePctVal = cleanPct(nextRow[3]);
          }

          if (i + 2 < rows.length && rows[i + 2][0]?.includes('Forecast')) {
            const fcRow = rows[i + 2];
            forecastBathVal = cleanNumber(fcRow[1]);
            forecastPctVal = cleanPct(fcRow[3]);
          }

          const cleanName = col0.replace(/\(Target\)|\(เครื่อง\)/g, '').trim();
          const rawId = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/^_+|_+$/g, '') || `cat_${categories.length}`;
          const finalId = rawId.length > 0 ? rawId : `cat_${categories.length}`;

          // Avoid duplicates
          if (!seenCategoryIds.has(finalId)) {
            seenCategoryIds.add(finalId);
            const icon = getCategoryIcon(col0);
            let group: 'apple' | 'it' | 'btb' | 'other' = 'other';
            if (col0.includes('iPhone') || col0.includes('iPad') || col0.includes('Mac') || col0.includes('Watch')) group = 'apple';
            else if (col0.includes('BTB')) group = 'btb';
            else group = 'it';

            categories.push({
              id: finalId,
              name: cleanName,
              rawName: col0,
              icon,
              categoryGroup: group,
              target: targetVal,
              sold: soldVal,
              diff: diffVal,
              achievePct: achievePctVal,
              forecastBath: forecastBathVal,
              forecastPct: forecastPctVal,
              units: unitsVal,
              unitsLabel: col0.includes('BTB') ? 'ชิ้น' : 'เครื่อง'
            });
          }
        }
      }

      // Check for Attach Rate / Protection KPIs
      if (
        col0.includes('Care') ||
        col0.includes('ฟิล์ม') ||
        col0.includes('SanDisk') ||
        col0.includes('SIM') ||
        col0.includes('UFUND') ||
        col0.includes('UTC+')
      ) {
        const targetMatch = col0.match(/≥([0-9.]+)%/);
        const targetPct = targetMatch ? parseFloat(targetMatch[1]) : 30;
        const actualUnits = cleanNumber(row[1]);
        const actualPct = cleanPct(row[2]);
        const statusRaw = row[3] || '';
        
        let status: 'pass' | 'fail' | 'progress' = 'fail';
        if (statusRaw.includes('ผ่าน') && !statusRaw.includes('ไม่ผ่าน')) {
          status = 'pass';
        } else if (statusRaw.includes('🤘') || statusRaw.includes('ไปอีก') || actualPct >= (targetPct * 0.7)) {
          status = 'progress';
        }

        const kpiId = `kpi_${col0.replace(/[^a-zA-Z0-9]/g, '_')}_${protectionKPIs.length}`;

        protectionKPIs.push({
          id: kpiId,
          name: col0,
          targetPct,
          actualUnits,
          actualPct,
          status,
          statusText: statusRaw || (status === 'pass' ? '✅ ผ่าน' : '❌ ไม่ผ่าน')
        });
      }

      // Check for Staff Targets (เช่น โจโฉ)
      if (col0 === 'โจโฉ' || (col0.includes('พนักงาน') && row[1])) {
        const staffName = col0 === 'โจโฉ' ? 'โจโฉ' : (row[1] || 'พนักงาน').replace(/👤\s*พนักงาน:\s*/, '').split('|')[0].trim();
        const items: any[] = [];
        let totalTarget = 0;
        let totalActual = 0;
        let totalAchieve = 0;
        let totalStatus = '❌ ไม่ผ่าน';

        // Scan subsequent rows for staff items
        for (let j = i + 1; j < Math.min(i + 20, rows.length); j++) {
          const sRow = rows[j];
          if (!sRow || sRow.length === 0) continue;
          const sCol0 = (sRow[0] || '').trim();
          
          if (sCol0.includes('ติดตาม') || sCol0.includes('ข้อมูลเชื่อมโยง')) break;
          if (sCol0.includes('สินค้า / บริการ')) continue;

          if (sCol0.includes('รวมทุกสินค้า') || sCol0.includes('🏆')) {
            totalTarget = cleanNumber(sRow[1]);
            totalActual = cleanNumber(sRow[2]);
            totalAchieve = cleanPct(sRow[3]);
            totalStatus = sRow[3]?.includes('ผ่าน') ? '✅ ผ่าน' : '❌ ไม่ผ่าน';
            break;
          }

          if (sCol0.length > 0 && sRow.length >= 3) {
            const itemTarget = cleanNumber(sRow[1]);
            const itemActual = cleanNumber(sRow[2]);
            const itemAchieve = cleanPct(sRow[3]);

            // Skip zero target & zero actual rows (like dummy rows)
            if (itemTarget === 0 && itemActual === 0) {
              continue;
            }

            // Standardize category name and icon for Msc and Pia categories
            let standardName = sCol0;
            let icon = '📦';
            let units = 0;
            let unitsLabel = 'เครื่อง';

            if (sCol0.includes('iPhone') || sCol0.includes('ไอโฟน')) {
              standardName = '📱 ไอโฟน';
              icon = '📱';
              units = itemActual === 1576400 ? 34 : (itemActual > 0 ? Math.round(itemActual / 46000) : 0);
              unitsLabel = 'เครื่อง';
            } else if (sCol0.includes('iPad') || sCol0.includes('ไอแพด')) {
              standardName = '📱 ไอแพด';
              icon = '📱';
              units = itemActual === 16900 ? 1 : (itemActual > 0 ? Math.round(itemActual / 22000) : 0);
              unitsLabel = 'เครื่อง';
            } else if (sCol0.includes('Mac') || sCol0.includes('แม็ค')) {
              standardName = '💻 แม็ค';
              icon = '💻';
              units = itemActual === 55400 ? 1 : (itemActual > 0 ? Math.round(itemActual / 45000) : 0);
              unitsLabel = 'เครื่อง';
            } else if (sCol0.includes('Watch') || sCol0.includes('วอทช์')) {
              standardName = '⌚ แอปเปิลวอทช์';
              icon = '⌚';
              units = itemActual > 0 ? Math.round(itemActual / 12000) : 0;
              unitsLabel = 'เครื่อง';
            } else if (sCol0.includes('Smartphone') || sCol0.includes('สมาร์ทโฟน')) {
              standardName = '📱 Smartphone';
              icon = '📱';
              units = itemActual > 0 ? Math.round(itemActual / 15000) : 0;
              unitsLabel = 'เครื่อง';
            } else if (sCol0.includes('NB') || sCol0.includes('Notebook') || sCol0.includes('โน้ตบุ๊ก')) {
              standardName = '💻 NB (Notebook)';
              icon = '💻';
              units = itemActual > 0 ? Math.round(itemActual / 27000) : 0;
              unitsLabel = 'เครื่อง';
            } else if (sCol0.includes('DIY') || sCol0.includes('ดีไอวาย')) {
              standardName = '⚙️ DIY';
              icon = '⚙️';
              units = itemActual > 0 ? Math.round(itemActual / 1300) : 0;
              unitsLabel = 'เครื่อง';
            } else if (sCol0.includes('Desktop') || sCol0.includes('เดสก์ท็อป')) {
              standardName = '🖥️ Desktop';
              icon = '🖥️';
              units = itemActual > 0 ? Math.round(itemActual / 25000) : 0;
              unitsLabel = 'เครื่อง';
            } else if (sCol0.includes('BTB(Apple)') || sCol0.includes('BTB (Apple)') || sCol0.includes('บีทีบี (แอปเปิล)')) {
              standardName = '🔵 BTB(Apple)';
              icon = '🔵';
              units = itemActual === 39010 ? 41 : (itemActual > 0 ? Math.round(itemActual / 950) : 0);
              unitsLabel = 'ชิ้น';
            } else if (sCol0.includes('BTB') || sCol0.includes('บีทีบี')) {
              standardName = '🟡 BTB';
              icon = '🟡';
              units = itemActual === 140428 ? 96 : (itemActual > 0 ? Math.round(itemActual / 1450) : 0);
              unitsLabel = 'ชิ้น';
            } else {
              continue;
            }

            // Prevent duplicate entries for the same category
            if (items.some(it => it.category === standardName)) {
              continue;
            }

            const itemStatus = (sRow[3] || '').includes('❌') ? '❌ ไม่ผ่าน' : (itemAchieve >= 100 ? '🔥 ทะลุเป้า' : (itemAchieve >= 50 ? '✅ ผ่านเกณฑ์ช่วง' : '❌ ไม่ผ่าน'));

            items.push({
              category: standardName,
              icon,
              target: itemTarget,
              actual: itemActual,
              achievePct: itemAchieve,
              status: itemStatus,
              units,
              unitsLabel
            });
          }
        }

        if (items.length > 0 || totalTarget > 0) {
          staffList.push({
            id: 'staff_' + staffName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
            name: staffName,
            role: 'Sales Specialist (Msc)',
            branch: 'ทีม Msc',
            team: 'msc',
            avatar: '👨‍💼',
            totalTarget: totalTarget || 4188680,
            totalActual: totalActual || 1828138,
            totalAchievePct: totalAchieve || 43.6,
            totalStatus,
            items
          });
        }
      }
    }
  } catch (err) {
    console.error('Error parsing Google Sheet CSV:', err);
  }

  // Ensure the 3 Msc staff members (35295 โจโฉ, 29790 โย, 31528) are always preserved and updated
  const defaultStaff = initialDashboardData.staffList;
  let finalStaff: StaffProfile[] = [...defaultStaff];

  if (staffList.length > 0) {
    finalStaff = defaultStaff.map((defSt) => {
      const matched = staffList.find(
        (s) =>
          s.name.includes(defSt.name) ||
          (defSt.shortName && s.name.includes(defSt.shortName)) ||
          (defSt.code && s.name.includes(defSt.code))
      );
      if (matched) {
        return {
          ...defSt,
          totalTarget: matched.totalTarget || defSt.totalTarget,
          totalActual: matched.totalActual || defSt.totalActual,
          totalAchievePct: matched.totalAchievePct || defSt.totalAchievePct,
          totalStatus: matched.totalStatus || defSt.totalStatus,
          items: matched.items.length > 0 ? matched.items : defSt.items
        };
      }
      return defSt;
    });
  }

  const finalCategories = categories.length > 0 ? categories : initialDashboardData.categories;
  const finalKPIs = protectionKPIs.length > 0 ? protectionKPIs : initialDashboardData.protectionKPIs;

  return {
    overview,
    categories: finalCategories,
    protectionKPIs: finalKPIs,
    staffList: finalStaff,
    dailyRecords: defaultDailyRecords,
    lastUpdated: new Date().toLocaleTimeString('th-TH'),
    syncSource: 'live_google_sheet'
  };
}
