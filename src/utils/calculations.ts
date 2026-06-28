import { Booking, CabinCosts, PerformanceSummary } from '../types';
import ExcelJS from 'exceljs';

export function toPersianDigits(num: number | string): string {
  return String(num);
}

export function formatPrice(num: number, asPersian = true): string {
  const formatted = num.toLocaleString('en-US');
  return asPersian ? `${toPersianDigits(formatted)} تومان` : `${formatted} Tomans`;
}

export function computeBookingFields(raw: {
  id: number;
  name: string;
  durationRaw: string;
  guestsRaw: string;
  netPrice: number;
  referrer: string;
  checkInDate: string;
  weekday: string;
}): Booking {
  // Real nights calculation
  const isHourly = raw.durationRaw.includes('ساعته');
  const realNights = isHourly ? 1 : (parseInt(raw.durationRaw, 10) || 1);

  // Platform commission rates:
  // Jajiga (جاجیگا) -> 16% (0.16)
  // Otaghak (اتاقک) -> 19% (0.19)
  // Shab (شب) -> 14% (0.14)
  // Others -> 0%
  const plat = raw.referrer.trim();
  let rate = 0;
  if (plat.includes('جاجیگا')) {
    rate = 0.16;
  } else if (plat.includes('اتاقک')) {
    rate = 0.19;
  } else if (plat === 'شب' || plat.includes('شب')) {
    // Only 'شب' exactly or contains 'شب' as referrer
    // The Python code: 0.14 if plat == 'شب' else 0.0
    // We'll match plat === 'شب' but also support variations gracefully.
    rate = (plat === 'شب') ? 0.14 : 0.0;
  }

  const grossPrice = Math.round(raw.netPrice / (1 - rate));
  const commission = grossPrice - raw.netPrice;
  const adr = Math.round(grossPrice / realNights);

  // Month extraction from "1405/01/25" -> "01"
  const dateParts = raw.checkInDate.split('/');
  let month = 'سایر';
  if (dateParts.length >= 2) {
    const mStr = dateParts[1];
    if (mStr === '01') month = 'فروردین';
    else if (mStr === '02') month = 'اردیبهشت';
    else if (mStr === '03') month = 'خرداد';
    else if (mStr === '04') month = 'تیر';
  }

  // Customer Profile: 2 guests is 'زوج جوان' (Young Couple), others 'خانواده / گروه' (Family/Group)
  const isCouple = raw.guestsRaw.trim() === '2';
  const customerProfile = isCouple ? 'زوج جوان' : 'خانواده / گروه';

  return {
    ...raw,
    realNights,
    grossPrice,
    commission,
    adr,
    month,
    customerProfile,
  };
}

export const initialRawBookings = [
  { id: 1, name: 'زینب کاظمی صدر', durationRaw: '2', guestsRaw: '4', netPrice: 5000000, referrer: 'پورحسین', checkInDate: '1405/01/25', weekday: 'سه شنبه و چهارشنبه' },
  { id: 2, name: 'سید عباس حسین نژاد', durationRaw: '12ساعته', guestsRaw: '2', netPrice: 1800000, referrer: 'شیپور', checkInDate: '1405/01/28', weekday: 'جمعه' },
  { id: 3, name: 'کیهان کریم پور', durationRaw: '1', guestsRaw: '5', netPrice: 2000000, referrer: 'شیپور', checkInDate: '1405/02/03', weekday: 'پنجشنبه' },
  { id: 4, name: 'حامد کوچک ارمکی', durationRaw: '1', guestsRaw: '2', netPrice: 1785000, referrer: 'اتاقک', checkInDate: '1405/02/10', weekday: 'پنجشنبه' },
  { id: 5, name: 'سجاد میانگلی', durationRaw: '6ساعته', guestsRaw: '2', netPrice: 2000000, referrer: 'شیپور', checkInDate: '1405/02/11', weekday: 'جمعه' },
  { id: 6, name: 'سعید حاجی تبار', durationRaw: '1', guestsRaw: '2', netPrice: 2000000, referrer: 'شکری(کافه)', checkInDate: '1405/02/16', weekday: 'چهارشنبه' },
  { id: 7, name: 'مسعود جانقلی', durationRaw: '1', guestsRaw: '2', netPrice: 2125000, referrer: 'اتاقک', checkInDate: '1405/02/17', weekday: 'پنجشنبه' },
  { id: 8, name: 'مهریزی', durationRaw: '4', guestsRaw: '3', netPrice: 8000000, referrer: 'پورحسین', checkInDate: '1405/02/22', weekday: 'سه شنبه تا جمعه' },
  { id: 9, name: 'سجاد میانگلی', durationRaw: '6ساعته', guestsRaw: '4', netPrice: 2000000, referrer: 'شیپور', checkInDate: '1405/02/26', weekday: 'شنبه' },
  { id: 10, name: 'خانم رحمانی', durationRaw: '2', guestsRaw: '2', netPrice: 4000000, referrer: 'شب', checkInDate: '1405/02/30', weekday: 'چهارشنبه و پنجشنبه' },
  { id: 11, name: 'نامشخص', durationRaw: '2', guestsRaw: '5', netPrice: 6000000, referrer: 'بهنام', checkInDate: '1405/03/06', weekday: 'چهارشنبه و پنجشنبه' },
  { id: 12, name: 'محمد مجیدی نسب', durationRaw: '3', guestsRaw: '2', netPrice: 6346000, referrer: 'جاجیگا', checkInDate: '1405/03/12', weekday: 'سه شنبه تا جمعه' },
  { id: 13, name: 'جواد قلی پور', durationRaw: '1', guestsRaw: '4+1', netPrice: 2179000, referrer: 'جاجیگا', checkInDate: '1405/03/21', weekday: 'پنجشنبه' },
  { id: 14, name: 'امیرحسین بیگ زاده سامیان', durationRaw: '1', guestsRaw: '2', netPrice: 2179000, referrer: 'جاجیگا', checkInDate: '1405/03/28', weekday: 'پنجشنبه' },
  { id: 15, name: 'امیررضا قدیری پزوه', durationRaw: '2', guestsRaw: '4', netPrice: 8517000, referrer: 'جاجیگا', checkInDate: '1405/04/03', weekday: 'چهارشنبه و پنجشنبه' },
];

export const initialBookings: Booking[] = initialRawBookings.map(b => computeBookingFields(b));

export const defaultCosts: CabinCosts = {
  weeks: 10,
  waterCostPerWeek: 600000,
  sheypoorCostPerWeek: 80000,
  cleaningCost: 2000000,
};

export function calculateSummary(bookings: Booking[], costs: CabinCosts): PerformanceSummary {
  const totalGross = bookings.reduce((sum, b) => sum + b.grossPrice, 0);
  const totalCommission = bookings.reduce((sum, b) => sum + b.commission, 0);
  const totalNet = bookings.reduce((sum, b) => sum + b.netPrice, 0);

  const waterCost = costs.weeks * costs.waterCostPerWeek;
  const sheypoorCost = costs.weeks * costs.sheypoorCostPerWeek;
  const cleaningCost = costs.cleaningCost;
  const totalCosts = waterCost + sheypoorCost + cleaningCost;
  const finalProfit = totalNet - totalCosts;

  const totalNightsSold = bookings.reduce((sum, b) => sum + b.realNights, 0);
  const totalNightsCapacity = costs.weeks * 7;
  const occupancyRate = totalNightsCapacity > 0 ? (totalNightsSold / totalNightsCapacity) * 100 : 0;

  const validNights = bookings.length;
  const averageADR = validNights > 0 
    ? Math.round(bookings.reduce((sum, b) => sum + b.adr, 0) / validNights) 
    : 0;

  return {
    totalGross,
    totalCommission,
    totalNet,
    waterCost,
    sheypoorCost,
    cleaningCost,
    totalCosts,
    finalProfit,
    occupancyRate,
    averageADR,
    totalNightsSold,
    totalNightsCapacity,
  };
}

export async function exportToExcel(
  bookings: Booking[],
  costs: CabinCosts,
  summary: PerformanceSummary
): Promise<void> {
  const workbook = new ExcelJS.Workbook();

  // Sheet 1: داده‌های ساختاریافته رزرو
  const ws1 = workbook.addWorksheet('داده‌های ساختاریافته رزرو', {
    views: [{ rightToLeft: true }]
  });

  const headers1 = [
    'ردیف',
    'نام مسافر',
    'مدت اقامت',
    'تعداد نفرات',
    'درآمد خالص (دریافتی شما)',
    'معرف / کانال',
    'تاریخ ورود',
    'روز هفته',
    'تعداد شب واقعی',
    'قیمت ناخالص (سایت)',
    'کارمزد کسر شده پلتفرم',
    'نرخ هر شب (ADR)',
    'ماه',
    'پروفایل مشتری'
  ];

  // Colors and Fills
  const navyFill: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
  const zebraFill: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FBFD' } };
  const headerGrayFill: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEAEAEA' } };

  const whiteFont: Partial<ExcelJS.Font> = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  const boldFont: Partial<ExcelJS.Font> = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
  const regularFont: Partial<ExcelJS.Font> = { name: 'Calibri', size: 11, color: { argb: 'FF000000' } };

  const centerAlign: Partial<ExcelJS.Alignment> = { horizontal: 'center', vertical: 'middle' };
  const rightAlign: Partial<ExcelJS.Alignment> = { horizontal: 'right', vertical: 'middle' };

  const thinBorder: Partial<ExcelJS.Borders> = {
    left: { style: 'thin', color: { argb: 'FFD9D9D9' } },
    right: { style: 'thin', color: { argb: 'FFD9D9D9' } },
    top: { style: 'thin', color: { argb: 'FFD9D9D9' } },
    bottom: { style: 'thin', color: { argb: 'FFD9D9D9' } }
  };

  const doubleBottomBorder: Partial<ExcelJS.Borders> = {
    left: { style: 'thin', color: { argb: 'FFD9D9D9' } },
    right: { style: 'thin', color: { argb: 'FFD9D9D9' } },
    top: { style: 'thin', color: { argb: 'FFD9D9D9' } },
    bottom: { style: 'double', color: { argb: 'FF000000' } }
  };

  // Add headers to Sheet 1
  ws1.addRow(headers1);
  const headerRow1 = ws1.getRow(1);
  headerRow1.height = 25;
  headerRow1.eachCell((cell) => {
    cell.fill = navyFill;
    cell.font = whiteFont;
    cell.alignment = centerAlign;
    cell.border = thinBorder;
  });

  // Add bookings rows
  bookings.forEach((b, idx) => {
    const rowValues = [
      idx + 1,
      b.name,
      b.durationRaw,
      b.guestsRaw,
      b.netPrice,
      b.referrer,
      b.checkInDate,
      b.weekday,
      b.realNights,
      b.grossPrice,
      b.commission,
      b.adr,
      b.month,
      b.customerProfile
    ];
    ws1.addRow(rowValues);

    const rowNum = idx + 2;
    const row = ws1.getRow(rowNum);
    row.height = 20;

    const isZebra = rowNum % 2 === 0;

    row.eachCell((cell, colNum) => {
      cell.font = regularFont;
      cell.border = thinBorder;
      if (isZebra) {
        cell.fill = zebraFill;
      }

      // Format monetary values
      if ([5, 10, 11, 12].includes(colNum)) {
        cell.numFmt = '#,##0';
        cell.alignment = rightAlign;
      } else {
        cell.alignment = centerAlign;
      }
    });
  });

  // Sheet 2: گزارش سود و زیان و عملکرد
  const ws2 = workbook.addWorksheet('گزارش سود و زیان و عملکرد', {
    views: [{ rightToLeft: true }]
  });

  ws2.addRow(['شاخص عملکرد مالی و مدیریتی کلبه', 'مقدار (تومان / درصد)']);
  const headerRow2 = ws2.getRow(1);
  headerRow2.height = 25;
  headerRow2.eachCell((cell) => {
    cell.fill = navyFill;
    cell.font = whiteFont;
    cell.alignment = centerAlign;
    cell.border = thinBorder;
  });

  const summaryRows = [
    ['کل گردش مالی کلبه در بازار (Gross)', summary.totalGross],
    ['کل کارمزد بلعیده‌شده توسط اپلیکیشن‌ها', summary.totalCommission],
    ['مجموع نقدینگی خالص ورودی از مسافران', summary.totalNet],
    [`هزینه شارژ منبع آب (${costs.weeks} هفته)`, summary.waterCost],
    [`هزینه تبلیغات و تمدید بنر شیپور (${costs.weeks} هفته)`, summary.sheypoorCost],
    ['هزینه متغیر مواد شوینده و بهداشتی', summary.cleaningCost],
    ['سود خالص نهایی واقعی (در جیب شما)', summary.finalProfit],
    ['میانگین قیمت یک شب کلبه در سایت (ADR)', summary.averageADR],
    ['نرخ اشغال کلبه در طول دوره (Occupancy)', `${summary.occupancyRate.toFixed(1)}%`]
  ];

  summaryRows.forEach((r, idx) => {
    ws2.addRow(r);
    const rowNum = idx + 2;
    const row = ws2.getRow(rowNum);
    row.height = 22;

    const labelCell = row.getCell(1);
    const valueCell = row.getCell(2);

    labelCell.font = boldFont;
    labelCell.border = thinBorder;
    valueCell.font = regularFont;
    valueCell.border = thinBorder;

    // Bold some specific key rows: Row 2 (Gross), Row 4 (Net/Cash flow), Row 8 (Final Profit)
    // Corresponding to indices: 0 (totalGross), 2 (totalNet), 6 (finalProfit)
    if ([0, 2, 6].includes(idx)) {
      labelCell.fill = headerGrayFill;
      valueCell.fill = headerGrayFill;
      valueCell.font = boldFont;
      
      // Give a double bottom border to the final profit row (idx === 6)
      if (idx === 6) {
        labelCell.border = doubleBottomBorder;
        valueCell.border = doubleBottomBorder;
      }
    }

    if (typeof r[1] === 'number') {
      valueCell.numFmt = '#,##0';
      valueCell.alignment = rightAlign;
    } else {
      valueCell.alignment = centerAlign;
    }
  });

  // Adjust columns widths automatically for both sheets
  [ws1, ws2].forEach((ws) => {
    ws.columns.forEach((col) => {
      let maxLen = 0;
      col.eachCell?.({ includeEmpty: false }, (cell) => {
        const valStr = cell.value ? String(cell.value) : '';
        // If it's a number, make some allowance for commas
        const valLen = typeof cell.value === 'number' ? valStr.length + 4 : valStr.length;
        if (valLen > maxLen) {
          maxLen = valLen;
        }
      });
      col.width = Math.max(maxLen + 4, 14);
    });
  });

  // Generate Excel file trigger
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'داشبورد_مدیریتی_لوکس_کلبه.xlsx';
  a.click();
  window.URL.revokeObjectURL(url);
}
