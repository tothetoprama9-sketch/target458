import { DashboardData, CategoryMetric, ProtectionKPI, StaffProfile, DailySalesRecord } from '../types/dashboard';

export const rawInitialCsv = `📅 ระบุช่วงเดือน:,10/2569,📌 สถานะข้อมูล:,เชื่อมโยงชีต Data (Live Sync)
📊Dashboard  (ภาพรวม Q4/2569),,,
All (Target),"24,839,692","ขายไป   12,944,630","จำนวน 1,607 เครื่อง"
ห่างจากเป้า,"11,895,062",Achieve (%),52.11%
Forecast (Bath),"36,480,322",Forecast (%),146.86%
📱iPhone (Target),"9,524,157","ขายไป   5,295,318",จำนวน 115 เครื่อง
ห่างจากเป้า,"4,228,839",Achieve (%),55.60%
Forecast (Bath),"14,923,168",Forecast (%),156.69%
,,,
📱iPad (Target),"814,347","ขายไป   323,600",จำนวน 14 เครื่อง
ห่างจากเป้า,"490,747",Achieve (%),39.74%
Forecast (Bath),"911,964",Forecast (%),111.99%
,,,
💻 Mac (Target),"655,902","ขายไป   298,800",จำนวน 7 เครื่อง
ห่างจากเป้า,"357,102",Achieve (%),45.56%
Forecast (Bath),"842,073",Forecast (%),128.38%
,,,
⌚ Apple Watch (Target),"442,986","ขายไป   8,500",จำนวน 1 เครื่อง
ห่างจากเป้า,"434,486",Achieve (%),1.92%
Forecast (Bath),"23,955",Forecast (%),5.41%
,,,
🔵BTB(Apple),"708,813","ขายไป   291,842",จำนวน 307 ชิ้น
ห่างจากเป้า,"416,971",Achieve (%),41.17%
Forecast (Bath),"822,464",Forecast (%),116.03%
,,,
🟡BTB,"1,924,699","ขายไป   1,228,822",จำนวน 844 ชิ้น
ห่างจากเป้า,"695,877",Achieve (%),63.84%
Forecast (Bath),"3,463,045",Forecast (%),179.93%
📱 Smartphone(เครื่อง),"8,538,168","ขายไป   3,912,564",จำนวน 250 เครื่อง
ห่างจากเป้า,"4,625,604",Achieve (%),45.82%
Forecast (Bath),"11,026,318",Forecast (%),129.14%
💻 NB (Notebook) (เครื่อง),"1,962,144","ขายไป   1,519,881",จำนวน 55 เครื่อง
ห่างจากเป้า,"442,263",Achieve (%),77.46%
Forecast (Bath),"4,283,301",Forecast (%),218.30%
💻 DIY (เครื่อง),"62,624","ขายไป   15,323",จำนวน 12 เครื่อง
ห่างจากเป้า,"47,301",Achieve (%),24.47%
Forecast (Bath),"43,183",Forecast (%),68.96%
💻 Desktop (เครื่อง),"205,852","ขายไป   49,980",จำนวน 2 เครื่อง
ห่างจากเป้า,"155,872",Achieve (%),24.28%
Forecast (Bath),"140,853",Forecast (%),68.42%
,,,
🛡️ Ultra Care+ SMP (≥40%),65,26.0%,❌ ไม่ผ่าน
🛡️Social Care+ (≥30%),28,11.2%,❌ ไม่ผ่าน
💻 TI Care+  (≥30%),4,7.3%,❌ ไม่ผ่าน
⌚ UTC+ For Gadget (≥20%),14,5.6%,❌ ไม่ผ่าน
✨ ฟิล์ม SMP (≥70%),55,22.0%,❌ ไม่ผ่าน
💾 SanDisk (≥50%),22,20.0%,❌ ไม่ผ่าน
🛡️ 7Care iPhone (≥40%),30,27.3%,❌ ไม่ผ่าน
🛡️ 7Care iPad (≥30%),3,21.4%,🤘ไปอีก
💻 7Care Mac (≥30%),0,0.0%,❌ ไม่ผ่าน
⌚ 7Care Watch (≥30%),1,100.0%,✅ ผ่าน
📶 SIM True (≥30%),39,35.5%,✅ ผ่าน
💳 UFUND APPIN (≥50%),2,1.8%,❌ ไม่ผ่าน
🛡️ Social Care+ (≥30%),2,1.8%,❌ ไม่ผ่าน
✨ ฟิล์ม iPhone (≥70%),49,44.5%,❌ ไม่ผ่าน
,,,
🎯 ติดตามเป้าหมายยอดขายรายบุคคล (Sales Target Tracking),,,
โจโฉ,👤 พนักงาน: โจโฉ | เกณฑ์เป้าหมายยอดขายรายบุคคล Q4,,
สินค้า / บริการ,เป้าหมาย (บ.),ยอดขายจริง,% บรรลุ
📱 iPhone,"3,174,719","1,576,400",49.7% ❌ ไม่ผ่าน
📱 iPad,"271,449","16,900",6.2% ❌ ไม่ผ่าน
💻 Mac,"218,634","55,400",25.3% ❌ ไม่ผ่าน
⌚ Apple Watch,"147,662",0,0.0% ❌ ไม่ผ่าน
🔵BTB(Apple),"101,259","39,010",38.5% ❌ ไม่ผ่าน
📱 Smartphone(เครื่อง),0,0,-
💻 DIY (เครื่อง),0,0,-
💻 NB (Notebook) (เครื่อง),0,0,-
💻 Desktop (เครื่อง),0,0,-
🔵BTB(Apple),0,0,-
🟡BTB,"274,957","140,428",51.1% ❌ ไม่ผ่าน
🏆 รวมทุกสินค้า,"4,188,680","1,828,138",43.6% ❌ ไม่ผ่าน
📌 ข้อมูลเชื่อมโยงอัตโนมัติจากชีตบันทึกประจำวัน (TODAY_10_69) และสรุปภาพ today (Live Sync),,,`;

export const defaultCategories: CategoryMetric[] = [
  {
    id: 'iphone',
    name: 'iPhone',
    rawName: '📱iPhone (Target)',
    icon: '📱',
    categoryGroup: 'apple',
    target: 9524157,
    sold: 5295318,
    diff: 4228839,
    achievePct: 55.60,
    forecastBath: 14923168,
    forecastPct: 156.69,
    units: 115,
    unitsLabel: 'เครื่อง'
  },
  {
    id: 'ipad',
    name: 'iPad',
    rawName: '📱iPad (Target)',
    icon: '📱',
    categoryGroup: 'apple',
    target: 814347,
    sold: 323600,
    diff: 490747,
    achievePct: 39.74,
    forecastBath: 911964,
    forecastPct: 111.99,
    units: 14,
    unitsLabel: 'เครื่อง'
  },
  {
    id: 'mac',
    name: 'Mac / MacBook',
    rawName: '💻 Mac (Target)',
    icon: '💻',
    categoryGroup: 'apple',
    target: 655902,
    sold: 298800,
    diff: 357102,
    achievePct: 45.56,
    forecastBath: 842073,
    forecastPct: 128.38,
    units: 7,
    unitsLabel: 'เครื่อง'
  },
  {
    id: 'watch',
    name: 'Apple Watch',
    rawName: '⌚ Apple Watch (Target)',
    icon: '⌚',
    categoryGroup: 'apple',
    target: 442986,
    sold: 8500,
    diff: 434486,
    achievePct: 1.92,
    forecastBath: 23955,
    forecastPct: 5.41,
    units: 1,
    unitsLabel: 'เครื่อง'
  },
  {
    id: 'smartphone',
    name: 'Smartphone',
    rawName: '📱 Smartphone(เครื่อง)',
    icon: '📱',
    categoryGroup: 'it',
    target: 8538168,
    sold: 3912564,
    diff: 4625604,
    achievePct: 45.82,
    forecastBath: 11026318,
    forecastPct: 129.14,
    units: 250,
    unitsLabel: 'เครื่อง'
  },
  {
    id: 'notebook',
    name: 'NB (Notebook)',
    rawName: '💻 NB (Notebook) (เครื่อง)',
    icon: '💻',
    categoryGroup: 'it',
    target: 1962144,
    sold: 1519881,
    diff: 442263,
    achievePct: 77.46,
    forecastBath: 4283301,
    forecastPct: 218.30,
    units: 55,
    unitsLabel: 'เครื่อง'
  },
  {
    id: 'btb_apple',
    name: 'BTB (Apple Acc)',
    rawName: '🔵BTB(Apple)',
    icon: '🔵',
    categoryGroup: 'btb',
    target: 708813,
    sold: 291842,
    diff: 416971,
    achievePct: 41.17,
    forecastBath: 822464,
    forecastPct: 116.03,
    units: 307,
    unitsLabel: 'ชิ้น'
  },
  {
    id: 'btb',
    name: '🟡 BTB (Non-Apple Acc)',
    rawName: '🟡BTB',
    icon: '🟡',
    categoryGroup: 'btb',
    target: 1924699,
    sold: 1228822,
    diff: 695877,
    achievePct: 63.84,
    forecastBath: 3463045,
    forecastPct: 179.93,
    units: 844,
    unitsLabel: 'ชิ้น'
  },
  {
    id: 'desktop',
    name: 'Desktop (เครื่อง)',
    rawName: '💻 Desktop (เครื่อง)',
    icon: '🖥️',
    categoryGroup: 'it',
    target: 205852,
    sold: 49980,
    diff: 155872,
    achievePct: 24.28,
    forecastBath: 140853,
    forecastPct: 68.42,
    units: 2,
    unitsLabel: 'เครื่อง'
  },
  {
    id: 'diy',
    name: 'DIY (Component)',
    rawName: '💻 DIY (เครื่อง)',
    icon: '⚙️',
    categoryGroup: 'it',
    target: 62624,
    sold: 15323,
    diff: 47301,
    achievePct: 24.47,
    forecastBath: 43183,
    forecastPct: 68.96,
    units: 12,
    unitsLabel: 'เครื่อง'
  }
];

export const defaultProtectionKPIs: ProtectionKPI[] = [
  { id: 'sim_true', name: '📶 SIM True (≥30%)', targetPct: 30, actualUnits: 39, actualPct: 35.5, status: 'pass', statusText: '✅ ผ่านเกณฑ์' },
  { id: 'care_watch', name: '⌚ 7Care Watch (≥30%)', targetPct: 30, actualUnits: 1, actualPct: 100.0, status: 'pass', statusText: '✅ ผ่านเกณฑ์' },
  { id: 'care_ipad', name: '🛡️ 7Care iPad (≥30%)', targetPct: 30, actualUnits: 3, actualPct: 21.4, status: 'progress', statusText: '🤘 ใกล้ถึงเป้า' },
  { id: 'care_iphone', name: '🛡️ 7Care iPhone (≥40%)', targetPct: 40, actualUnits: 30, actualPct: 27.3, status: 'fail', statusText: '❌ ไม่ผ่าน' },
  { id: 'ultra_care', name: '🛡️ Ultra Care+ SMP (≥40%)', targetPct: 40, actualUnits: 65, actualPct: 26.0, status: 'fail', statusText: '❌ ไม่ผ่าน' },
  { id: 'film_iphone', name: '✨ ฟิล์ม iPhone (≥70%)', targetPct: 70, actualUnits: 49, actualPct: 44.5, status: 'fail', statusText: '❌ ไม่ผ่าน' },
  { id: 'sandisk', name: '💾 SanDisk (≥50%)', targetPct: 50, actualUnits: 22, actualPct: 20.0, status: 'fail', statusText: '❌ ไม่ผ่าน' },
  { id: 'film_smp', name: '✨ ฟิล์ม SMP (≥70%)', targetPct: 70, actualUnits: 55, actualPct: 22.0, status: 'fail', statusText: '❌ ไม่ผ่าน' },
  { id: 'social_care', name: '🛡️ Social Care+ (≥30%)', targetPct: 30, actualUnits: 28, actualPct: 11.2, status: 'fail', statusText: '❌ ไม่ผ่าน' },
  { id: 'ti_care', name: '💻 TI Care+ (≥30%)', targetPct: 30, actualUnits: 4, actualPct: 7.3, status: 'fail', statusText: '❌ ไม่ผ่าน' },
  { id: 'utc_gadget', name: '⌚ UTC+ For Gadget (≥20%)', targetPct: 20, actualUnits: 14, actualPct: 5.6, status: 'fail', statusText: '❌ ไม่ผ่าน' },
  { id: 'care_mac', name: '💻 7Care Mac (≥30%)', targetPct: 30, actualUnits: 0, actualPct: 0.0, status: 'fail', statusText: '❌ ไม่ผ่าน' },
  { id: 'ufund', name: '💳 UFUND APPIN (≥50%)', targetPct: 50, actualUnits: 2, actualPct: 1.8, status: 'fail', statusText: '❌ ไม่ผ่าน' },
];

export const defaultStaffList: StaffProfile[] = [
  {
    id: 'jocho',
    name: 'โจโฉ',
    role: 'Senior Sales Specialist',
    branch: 'ทีม Msc',
    team: 'msc',
    avatar: '👨‍💼',
    totalTarget: 4188680,
    totalActual: 1828138,
    totalAchievePct: 43.64,
    totalStatus: '❌ ไม่ผ่าน',
    items: [
      { category: '📱 ไอโฟน', icon: '📱', target: 3174719, actual: 1576400, achievePct: 49.7, status: '❌ ไม่ผ่าน', units: 34, unitsLabel: 'เครื่อง' },
      { category: '📱 ไอแพด', icon: '📱', target: 271449, actual: 16900, achievePct: 6.2, status: '❌ ไม่ผ่าน', units: 1, unitsLabel: 'เครื่อง' },
      { category: '💻 แม็ค', icon: '💻', target: 218634, actual: 55400, achievePct: 25.3, status: '❌ ไม่ผ่าน', units: 1, unitsLabel: 'เครื่อง' },
      { category: '⌚ แอปเปิลวอทช์', icon: '⌚', target: 147662, actual: 0, achievePct: 0.0, status: '❌ ไม่ผ่าน', units: 0, unitsLabel: 'เครื่อง' },
      { category: '🔵 บีทีบี (แอปเปิล)', icon: '🔵', target: 101259, actual: 39010, achievePct: 38.5, status: '❌ ไม่ผ่าน', units: 41, unitsLabel: 'ชิ้น' },
      { category: '🟡 บีทีบี', icon: '🟡', target: 274957, actual: 140428, achievePct: 51.1, status: '❌ ไม่ผ่าน', units: 96, unitsLabel: 'ชิ้น' },
    ],
    kpis: [
      { id: 'kpi_jocho_7care_iphone', name: '🛡️ 7Care iPhone (≥40%)', targetPct: 40, actualUnits: 11, actualPct: 28.5, status: 'fail', statusText: '❌ ไม่ผ่าน' },
      { id: 'kpi_jocho_7care_ipad', name: '🛡️ 7Care iPad (≥30%)', targetPct: 30, actualUnits: 1, actualPct: 20.0, status: 'progress', statusText: '🤘 ใกล้ถึงเป้า' },
      { id: 'kpi_jocho_7care_mac', name: '💻 7Care Mac (≥30%)', targetPct: 30, actualUnits: 0, actualPct: 0.0, status: 'fail', statusText: '❌ ไม่ผ่าน' },
      { id: 'kpi_jocho_7care_watch', name: '⌚ 7Care Watch (≥30%)', targetPct: 30, actualUnits: 0, actualPct: 0.0, status: 'fail', statusText: '❌ ไม่ผ่าน' },
      { id: 'kpi_jocho_sim_true', name: '📶 SIM True (≥30%)', targetPct: 30, actualUnits: 14, actualPct: 36.8, status: 'pass', statusText: '✅ ผ่านเกณฑ์' },
      { id: 'kpi_jocho_ufund', name: '💳 UFUND APPIN (≥50%)', targetPct: 50, actualUnits: 1, actualPct: 2.6, status: 'fail', statusText: '❌ ไม่ผ่าน' },
      { id: 'kpi_jocho_social_care', name: '🛡️ Social Care+ (≥30%)', targetPct: 30, actualUnits: 1, actualPct: 2.6, status: 'fail', statusText: '❌ ไม่ผ่าน' },
    ]
  },
  {
    id: 'yo',
    name: 'โย',
    role: 'Sales Specialist',
    branch: 'ทีม Msc',
    team: 'msc',
    avatar: '👨‍💻',
    totalTarget: 4188680,
    totalActual: 2420500,
    totalAchievePct: 57.79,
    totalStatus: '✅ เกินครึ่งทาง',
    items: [
      { category: '📱 ไอโฟน', icon: '📱', target: 3174719, actual: 1890000, achievePct: 59.5, status: '✅ ผ่านเกณฑ์ช่วง', units: 41, unitsLabel: 'เครื่อง' },
      { category: '📱 ไอแพด', icon: '📱', target: 271449, actual: 165000, achievePct: 60.8, status: '✅ ผ่านเกณฑ์ช่วง', units: 7, unitsLabel: 'เครื่อง' },
      { category: '💻 แม็ค', icon: '💻', target: 218634, actual: 145000, achievePct: 66.3, status: '✅ ผ่านเกณฑ์ช่วง', units: 3, unitsLabel: 'เครื่อง' },
      { category: '⌚ แอปเปิลวอทช์', icon: '⌚', target: 147662, actual: 8500, achievePct: 5.8, status: '❌ ไม่ผ่าน', units: 1, unitsLabel: 'เครื่อง' },
      { category: '🔵 บีทีบี (แอปเปิล)', icon: '🔵', target: 101259, actual: 124000, achievePct: 122.5, status: '🔥 ทะลุเป้า', units: 130, unitsLabel: 'ชิ้น' },
      { category: '🟡 บีทีบี', icon: '🟡', target: 274957, actual: 88000, achievePct: 32.0, status: '❌ ไม่ผ่าน', units: 60, unitsLabel: 'ชิ้น' },
    ],
    kpis: [
      { id: 'kpi_yo_7care_iphone', name: '🛡️ 7Care iPhone (≥40%)', targetPct: 40, actualUnits: 14, actualPct: 42.0, status: 'pass', statusText: '✅ ผ่านเกณฑ์' },
      { id: 'kpi_yo_7care_ipad', name: '🛡️ 7Care iPad (≥30%)', targetPct: 30, actualUnits: 2, actualPct: 33.3, status: 'pass', statusText: '✅ ผ่านเกณฑ์' },
      { id: 'kpi_yo_7care_mac', name: '💻 7Care Mac (≥30%)', targetPct: 30, actualUnits: 0, actualPct: 0.0, status: 'fail', statusText: '❌ ไม่ผ่าน' },
      { id: 'kpi_yo_7care_watch', name: '⌚ 7Care Watch (≥30%)', targetPct: 30, actualUnits: 1, actualPct: 100.0, status: 'pass', statusText: '✅ ผ่านเกณฑ์' },
      { id: 'kpi_yo_sim_true', name: '📶 SIM True (≥30%)', targetPct: 30, actualUnits: 15, actualPct: 35.7, status: 'pass', statusText: '✅ ผ่านเกณฑ์' },
      { id: 'kpi_yo_ufund', name: '💳 UFUND APPIN (≥50%)', targetPct: 50, actualUnits: 1, actualPct: 2.4, status: 'fail', statusText: '❌ ไม่ผ่าน' },
      { id: 'kpi_yo_social_care', name: '🛡️ Social Care+ (≥30%)', targetPct: 30, actualUnits: 1, actualPct: 2.4, status: 'fail', statusText: '❌ ไม่ผ่าน' },
    ]
  },
  {
    id: 'kim',
    name: 'คิม',
    role: 'Sales Specialist',
    branch: 'ทีม Msc',
    team: 'msc',
    avatar: '👨‍🔧',
    totalTarget: 4188680,
    totalActual: 2331562,
    totalAchievePct: 55.66,
    totalStatus: '✅ เกินครึ่งทาง',
    items: [
      { category: '📱 ไอโฟน', icon: '📱', target: 3174719, actual: 1828918, achievePct: 57.6, status: '✅ ผ่านเกณฑ์ช่วง', units: 40, unitsLabel: 'เครื่อง' },
      { category: '📱 ไอแพด', icon: '📱', target: 271449, actual: 141700, achievePct: 52.2, status: '✅ ผ่านเกณฑ์ช่วง', units: 6, unitsLabel: 'เครื่อง' },
      { category: '💻 แม็ค', icon: '💻', target: 218634, actual: 98400, achievePct: 45.0, status: '❌ ไม่ผ่าน', units: 3, unitsLabel: 'เครื่อง' },
      { category: '⌚ แอปเปิลวอทช์', icon: '⌚', target: 147662, actual: 0, achievePct: 0.0, status: '❌ ไม่ผ่าน', units: 0, unitsLabel: 'เครื่อง' },
      { category: '🔵 บีทีบี (แอปเปิล)', icon: '🔵', target: 101259, actual: 128832, achievePct: 127.2, status: '🔥 ทะลุเป้า', units: 136, unitsLabel: 'ชิ้น' },
      { category: '🟡 บีทีบี', icon: '🟡', target: 274957, actual: 133712, achievePct: 48.6, status: '❌ ไม่ผ่าน', units: 92, unitsLabel: 'ชิ้น' },
    ],
    kpis: [
      { id: 'kpi_kim_7care_iphone', name: '🛡️ 7Care iPhone (≥40%)', targetPct: 40, actualUnits: 5, actualPct: 15.6, status: 'fail', statusText: '❌ ไม่ผ่าน' },
      { id: 'kpi_kim_7care_ipad', name: '🛡️ 7Care iPad (≥30%)', targetPct: 30, actualUnits: 0, actualPct: 0.0, status: 'fail', statusText: '❌ ไม่ผ่าน' },
      { id: 'kpi_kim_7care_mac', name: '💻 7Care Mac (≥30%)', targetPct: 30, actualUnits: 0, actualPct: 0.0, status: 'fail', statusText: '❌ ไม่ผ่าน' },
      { id: 'kpi_kim_7care_watch', name: '⌚ 7Care Watch (≥30%)', targetPct: 30, actualUnits: 0, actualPct: 0.0, status: 'fail', statusText: '❌ ไม่ผ่าน' },
      { id: 'kpi_kim_sim_true', name: '📶 SIM True (≥30%)', targetPct: 30, actualUnits: 10, actualPct: 31.3, status: 'pass', statusText: '✅ ผ่านเกณฑ์' },
      { id: 'kpi_kim_ufund', name: '💳 UFUND APPIN (≥50%)', targetPct: 50, actualUnits: 0, actualPct: 0.0, status: 'fail', statusText: '❌ ไม่ผ่าน' },
      { id: 'kpi_kim_social_care', name: '🛡️ Social Care+ (≥30%)', targetPct: 30, actualUnits: 0, actualPct: 0.0, status: 'fail', statusText: '❌ ไม่ผ่าน' },
    ]
  },
  // 4 Pia Staff Members: 24583 จิ๊บ, 21865 เมย์, 29253 วา, 35350 สตาร์
  {
    id: '24583',
    name: 'จิ๊บ',
    role: 'Senior Sales Specialist',
    branch: 'ทีม Pia',
    team: 'pia',
    avatar: '👩‍💼',
    totalTarget: 3068413,
    totalActual: 1691390,
    totalAchievePct: 55.12,
    totalStatus: '✅ เกินครึ่งทาง',
    items: [
      { category: '📱 Smartphone', icon: '📱', target: 2134542, actual: 1024500, achievePct: 48.0, status: '❌ ไม่ผ่าน', units: 65, unitsLabel: 'เครื่อง' },
      { category: '💻 NB (Notebook)', icon: '💻', target: 490536, actual: 412000, achievePct: 84.0, status: '✅ ผ่านเกณฑ์ช่วง', units: 15, unitsLabel: 'เครื่อง' },
      { category: '⚙️ DIY', icon: '⚙️', target: 15656, actual: 4500, achievePct: 28.7, status: '❌ ไม่ผ่าน', units: 4, unitsLabel: 'เครื่อง' },
      { category: '🖥️ Desktop', icon: '🖥️', target: 51463, actual: 24990, achievePct: 48.6, status: '❌ ไม่ผ่าน', units: 1, unitsLabel: 'เครื่อง' },
      { category: '🔵 BTB(Apple)', icon: '🔵', target: 101259, actual: 0, achievePct: 0.0, status: '❌ ไม่ผ่าน', units: 0, unitsLabel: 'ชิ้น' },
      { category: '🟡 BTB', icon: '🟡', target: 274957, actual: 225400, achievePct: 82.0, status: '✅ ผ่านเกณฑ์ช่วง', units: 155, unitsLabel: 'ชิ้น' },
    ],
    kpis: [
      { id: 'kpi_jib_ultra_care', name: '🛡️ Ultra Care+ SMP (≥40%)', targetPct: 40, actualUnits: 20, actualPct: 30.8, status: 'progress', statusText: '🤘 ใกล้ถึงเป้า' },
      { id: 'kpi_jib_social_care', name: '🛡️ Social Care+ (≥30%)', targetPct: 30, actualUnits: 9, actualPct: 13.8, status: 'fail', statusText: '❌ ไม่ผ่าน' },
      { id: 'kpi_jib_ti_care', name: '💻 TI Care+ (≥30%)', targetPct: 30, actualUnits: 2, actualPct: 13.3, status: 'fail', statusText: '❌ ไม่ผ่าน' },
      { id: 'kpi_jib_utc_gadget', name: '⌚ UTC+ For Gadget (≥20%)', targetPct: 20, actualUnits: 5, actualPct: 6.1, status: 'fail', statusText: '❌ ไม่ผ่าน' },
      { id: 'kpi_jib_film_smp', name: '✨ ฟิล์ม SMP (≥70%)', targetPct: 70, actualUnits: 18, actualPct: 27.7, status: 'fail', statusText: '❌ ไม่ผ่าน' },
      { id: 'kpi_jib_sandisk', name: '💾 SanDisk (≥50%)', targetPct: 50, actualUnits: 8, actualPct: 25.0, status: 'fail', statusText: '❌ ไม่ผ่าน' },
      { id: 'kpi_jib_ufund', name: '💳 UFUND APPIN (≥50%)', targetPct: 50, actualUnits: 1, actualPct: 1.5, status: 'fail', statusText: '❌ ไม่ผ่าน' },
    ]
  },
  {
    id: '21865',
    name: 'เมย์',
    role: 'Sales Specialist',
    branch: 'ทีม Pia',
    team: 'pia',
    avatar: '👩‍💻',
    totalTarget: 3068413,
    totalActual: 1632390,
    totalAchievePct: 53.20,
    totalStatus: '✅ เกินครึ่งทาง',
    items: [
      { category: '📱 Smartphone', icon: '📱', target: 2134542, actual: 995000, achievePct: 46.6, status: '❌ ไม่ผ่าน', units: 64, unitsLabel: 'เครื่อง' },
      { category: '💻 NB (Notebook)', icon: '💻', target: 490536, actual: 390000, achievePct: 79.5, status: '✅ ผ่านเกณฑ์ช่วง', units: 14, unitsLabel: 'เครื่อง' },
      { category: '⚙️ DIY', icon: '⚙️', target: 15656, actual: 3800, achievePct: 24.3, status: '❌ ไม่ผ่าน', units: 3, unitsLabel: 'เครื่อง' },
      { category: '🖥️ Desktop', icon: '🖥️', target: 51463, actual: 24990, achievePct: 48.6, status: '❌ ไม่ผ่าน', units: 1, unitsLabel: 'เครื่อง' },
      { category: '🔵 BTB(Apple)', icon: '🔵', target: 101259, actual: 0, achievePct: 0.0, status: '❌ ไม่ผ่าน', units: 0, unitsLabel: 'ชิ้น' },
      { category: '🟡 BTB', icon: '🟡', target: 274957, actual: 218600, achievePct: 79.5, status: '✅ ผ่านเกณฑ์ช่วง', units: 150, unitsLabel: 'ชิ้น' },
    ],
    kpis: [
      { id: 'kpi_may_ultra_care', name: '🛡️ Ultra Care+ SMP (≥40%)', targetPct: 40, actualUnits: 18, actualPct: 28.1, status: 'fail', statusText: '❌ ไม่ผ่าน' },
      { id: 'kpi_may_social_care', name: '🛡️ Social Care+ (≥30%)', targetPct: 30, actualUnits: 8, actualPct: 12.5, status: 'fail', statusText: '❌ ไม่ผ่าน' },
      { id: 'kpi_may_ti_care', name: '💻 TI Care+ (≥30%)', targetPct: 30, actualUnits: 1, actualPct: 7.1, status: 'fail', statusText: '❌ ไม่ผ่าน' },
      { id: 'kpi_may_utc_gadget', name: '⌚ UTC+ For Gadget (≥20%)', targetPct: 20, actualUnits: 4, actualPct: 5.3, status: 'fail', statusText: '❌ ไม่ผ่าน' },
      { id: 'kpi_may_film_smp', name: '✨ ฟิล์ม SMP (≥70%)', targetPct: 70, actualUnits: 15, actualPct: 23.4, status: 'fail', statusText: '❌ ไม่ผ่าน' },
      { id: 'kpi_may_sandisk', name: '💾 SanDisk (≥50%)', targetPct: 50, actualUnits: 6, actualPct: 21.0, status: 'fail', statusText: '❌ ไม่ผ่าน' },
      { id: 'kpi_may_ufund', name: '💳 UFUND APPIN (≥50%)', targetPct: 50, actualUnits: 1, actualPct: 1.6, status: 'fail', statusText: '❌ ไม่ผ่าน' },
    ]
  },
  {
    id: '29253',
    name: 'วา',
    role: 'Sales Specialist',
    branch: 'ทีม Pia',
    team: 'pia',
    avatar: '👨‍💼',
    totalTarget: 3068413,
    totalActual: 1534000,
    totalAchievePct: 49.99,
    totalStatus: '❌ ไม่ผ่าน',
    items: [
      { category: '📱 Smartphone', icon: '📱', target: 2134542, actual: 953000, achievePct: 44.6, status: '❌ ไม่ผ่าน', units: 61, unitsLabel: 'เครื่อง' },
      { category: '💻 NB (Notebook)', icon: '💻', target: 490536, actual: 365000, achievePct: 74.4, status: '✅ ผ่านเกณฑ์ช่วง', units: 13, unitsLabel: 'เครื่อง' },
      { category: '⚙️ DIY', icon: '⚙️', target: 15656, actual: 3500, achievePct: 22.4, status: '❌ ไม่ผ่าน', units: 3, unitsLabel: 'เครื่อง' },
      { category: '🖥️ Desktop', icon: '🖥️', target: 51463, actual: 0, achievePct: 0.0, status: '❌ ไม่ผ่าน', units: 0, unitsLabel: 'เครื่อง' },
      { category: '🔵 BTB(Apple)', icon: '🔵', target: 101259, actual: 0, achievePct: 0.0, status: '❌ ไม่ผ่าน', units: 0, unitsLabel: 'ชิ้น' },
      { category: '🟡 BTB', icon: '🟡', target: 274957, actual: 212500, achievePct: 77.3, status: '✅ ผ่านเกณฑ์ช่วง', units: 146, unitsLabel: 'ชิ้น' },
    ],
    kpis: [
      { id: 'kpi_wa_ultra_care', name: '🛡️ Ultra Care+ SMP (≥40%)', targetPct: 40, actualUnits: 15, actualPct: 24.6, status: 'fail', statusText: '❌ ไม่ผ่าน' },
      { id: 'kpi_wa_social_care', name: '🛡️ Social Care+ (≥30%)', targetPct: 30, actualUnits: 6, actualPct: 9.8, status: 'fail', statusText: '❌ ไม่ผ่าน' },
      { id: 'kpi_wa_ti_care', name: '💻 TI Care+ (≥30%)', targetPct: 30, actualUnits: 1, actualPct: 7.7, status: 'fail', statusText: '❌ ไม่ผ่าน' },
      { id: 'kpi_wa_utc_gadget', name: '⌚ UTC+ For Gadget (≥20%)', targetPct: 20, actualUnits: 3, actualPct: 4.1, status: 'fail', statusText: '❌ ไม่ผ่าน' },
      { id: 'kpi_wa_film_smp', name: '✨ ฟิล์ม SMP (≥70%)', targetPct: 70, actualUnits: 12, actualPct: 19.7, status: 'fail', statusText: '❌ ไม่ผ่าน' },
      { id: 'kpi_wa_sandisk', name: '💾 SanDisk (≥50%)', targetPct: 50, actualUnits: 5, actualPct: 18.0, status: 'fail', statusText: '❌ ไม่ผ่าน' },
      { id: 'kpi_wa_ufund', name: '💳 UFUND APPIN (≥50%)', targetPct: 50, actualUnits: 0, actualPct: 0.0, status: 'fail', statusText: '❌ ไม่ผ่าน' },
    ]
  },
  {
    id: '35350',
    name: 'สตาร์',
    role: 'Sales Specialist',
    branch: 'ทีม Pia',
    team: 'pia',
    avatar: '👩‍💼',
    totalTarget: 3068413,
    totalActual: 1506650,
    totalAchievePct: 49.10,
    totalStatus: '❌ ไม่ผ่าน',
    items: [
      { category: '📱 Smartphone', icon: '📱', target: 2134542, actual: 940064, achievePct: 44.0, status: '❌ ไม่ผ่าน', units: 60, unitsLabel: 'เครื่อง' },
      { category: '💻 NB (Notebook)', icon: '💻', target: 490536, actual: 352881, achievePct: 71.9, status: '✅ ผ่านเกณฑ์ช่วง', units: 13, unitsLabel: 'เครื่อง' },
      { category: '⚙️ DIY', icon: '⚙️', target: 15656, actual: 3523, achievePct: 22.5, status: '❌ ไม่ผ่าน', units: 2, unitsLabel: 'เครื่อง' },
      { category: '🖥️ Desktop', icon: '🖥️', target: 51463, actual: 0, achievePct: 0.0, status: '❌ ไม่ผ่าน', units: 0, unitsLabel: 'เครื่อง' },
      { category: '🔵 BTB(Apple)', icon: '🔵', target: 101259, actual: 0, achievePct: 0.0, status: '❌ ไม่ผ่าน', units: 0, unitsLabel: 'ชิ้น' },
      { category: '🟡 BTB', icon: '🟡', target: 274957, actual: 210182, achievePct: 76.4, status: '✅ ผ่านเกณฑ์ช่วง', units: 145, unitsLabel: 'ชิ้น' },
    ],
    kpis: [
      { id: 'kpi_star_ultra_care', name: '🛡️ Ultra Care+ SMP (≥40%)', targetPct: 40, actualUnits: 12, actualPct: 20.0, status: 'fail', statusText: '❌ ไม่ผ่าน' },
      { id: 'kpi_star_social_care', name: '🛡️ Social Care+ (≥30%)', targetPct: 30, actualUnits: 5, actualPct: 8.3, status: 'fail', statusText: '❌ ไม่ผ่าน' },
      { id: 'kpi_star_ti_care', name: '💻 TI Care+ (≥30%)', targetPct: 30, actualUnits: 0, actualPct: 0.0, status: 'fail', statusText: '❌ ไม่ผ่าน' },
      { id: 'kpi_star_utc_gadget', name: '⌚ UTC+ For Gadget (≥20%)', targetPct: 20, actualUnits: 2, actualPct: 2.7, status: 'fail', statusText: '❌ ไม่ผ่าน' },
      { id: 'kpi_star_film_smp', name: '✨ ฟิล์ม SMP (≥70%)', targetPct: 70, actualUnits: 10, actualPct: 16.7, status: 'fail', statusText: '❌ ไม่ผ่าน' },
      { id: 'kpi_star_sandisk', name: '💾 SanDisk (≥50%)', targetPct: 50, actualUnits: 3, actualPct: 15.0, status: 'fail', statusText: '❌ ไม่ผ่าน' },
      { id: 'kpi_star_ufund', name: '💳 UFUND APPIN (≥50%)', targetPct: 50, actualUnits: 0, actualPct: 0.0, status: 'fail', statusText: '❌ ไม่ผ่าน' },
    ]
  }
];

// Generate realistic day-by-day sales data for October 10/2569
export const defaultDailyRecords: DailySalesRecord[] = [
  { day: 1, dateStr: '1 ต.ค.', sales: 582400, target: 801280, cumulativeSales: 582400, cumulativeTarget: 801280, units: 68, topProduct: 'iPhone 16 Pro Max' },
  { day: 2, dateStr: '2 ต.ค.', sales: 615000, target: 801280, cumulativeSales: 1197400, cumulativeTarget: 1602560, units: 74, topProduct: 'Samsung S24 Ultra' },
  { day: 3, dateStr: '3 ต.ค.', sales: 540300, target: 801280, cumulativeSales: 1737700, cumulativeTarget: 2403840, units: 62, topProduct: 'Asus TUF Gaming' },
  { day: 4, dateStr: '4 ต.ค.', sales: 749000, target: 801280, cumulativeSales: 2486700, cumulativeTarget: 3205120, units: 95, topProduct: 'iPhone 16' },
  { day: 5, dateStr: '5 ต.ค. (ส.)', sales: 980500, target: 801280, cumulativeSales: 3467200, cumulativeTarget: 4006400, units: 130, topProduct: 'iPhone 16 Pro' },
  { day: 6, dateStr: '6 ต.ค. (อา.)', sales: 1120000, target: 801280, cumulativeSales: 4587200, cumulativeTarget: 4807680, units: 145, topProduct: 'iPhone 16 Pro Max' },
  { day: 7, dateStr: '7 ต.ค.', sales: 495000, target: 801280, cumulativeSales: 5082200, cumulativeTarget: 5608960, units: 58, topProduct: 'iPad Air M2' },
  { day: 8, dateStr: '8 ต.ค.', sales: 532000, target: 801280, cumulativeSales: 5614200, cumulativeTarget: 6410240, units: 64, topProduct: 'MacBook Air M3' },
  { day: 9, dateStr: '9 ต.ค.', sales: 568900, target: 801280, cumulativeSales: 6183100, cumulativeTarget: 7211520, units: 71, topProduct: 'OPPO Reno 12' },
  { day: 10, dateStr: '10 ต.ค. (Double Day)', sales: 1250400, target: 801280, cumulativeSales: 7433500, cumulativeTarget: 8012800, units: 165, topProduct: 'iPhone 16 Pro' },
  { day: 11, dateStr: '11 ต.ค.', sales: 620000, target: 801280, cumulativeSales: 8053500, cumulativeTarget: 8814080, units: 82, topProduct: 'Vivo V40' },
  { day: 12, dateStr: '12 ต.ค. (ส.)', sales: 1045000, target: 801280, cumulativeSales: 9098500, cumulativeTarget: 9615360, units: 138, topProduct: 'iPhone 16 Pro Max' },
  { day: 13, dateStr: '13 ต.ค. (อา.)', sales: 989000, target: 801280, cumulativeSales: 10087500, cumulativeTarget: 10416640, units: 129, topProduct: 'Lenovo LOQ' },
  { day: 14, dateStr: '14 ต.ค.', sales: 485000, target: 801280, cumulativeSales: 10572500, cumulativeTarget: 11217920, units: 59, topProduct: 'BTB Baseus' },
  { day: 15, dateStr: '15 ต.ค. (Payday Mid)', sales: 792130, target: 801280, cumulativeSales: 11364630, cumulativeTarget: 12019200, units: 104, topProduct: 'iPhone 16 Plus' },
  { day: 16, dateStr: '16 ต.ค.', sales: 512000, target: 801280, cumulativeSales: 11876630, cumulativeTarget: 12820480, units: 66, topProduct: 'iPad 10th Gen' },
  { day: 17, dateStr: '17 ต.ค.', sales: 535000, target: 801280, cumulativeSales: 12411630, cumulativeTarget: 13621760, units: 70, topProduct: 'Xiaomi 14T Pro' },
  { day: 18, dateStr: '18 ต.ค.', sales: 533000, target: 801280, cumulativeSales: 12944630, cumulativeTarget: 14423040, units: 69, topProduct: 'iPhone 16' },
];

export const initialDashboardData: DashboardData = {
  overview: {
    month: '10/2569',
    statusText: 'เชื่อมโยงชีต Data (Live Sync)',
    quarterLabel: 'Dashboard (ภาพรวม Q4/2569)',
    target: 24839692,
    sold: 12944630,
    diff: 11895062,
    achievePct: 52.11,
    forecastBath: 36480322,
    forecastPct: 146.86,
    units: 1607,
    unitsLabel: 'เครื่อง'
  },
  categories: defaultCategories,
  protectionKPIs: defaultProtectionKPIs,
  staffList: defaultStaffList,
  dailyRecords: defaultDailyRecords,
  lastUpdated: new Date().toLocaleTimeString('th-TH'),
  syncSource: 'default',
  sheetUrl: ''
};
