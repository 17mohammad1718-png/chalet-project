export interface Booking {
  id: number; // Row number (ردیف)
  name: string; // Passenger Name (نام مسافر)
  durationRaw: string; // Raw stay duration (اقامت_روز, e.g. "2", "12ساعته", "1")
  guestsRaw: string; // Raw guest count (تعداد_نفرات, e.g. "4", "2", "5", "4+1")
  netPrice: number; // Net revenue received (قیمت_خالص)
  referrer: string; // Referrer / Platform (معرف / کانال, e.g. "جاجیگا", "شیپور")
  checkInDate: string; // Check-in Date (تاریخ_ورود, e.g. "1405/01/25")
  weekday: string; // Days of the week (روز هفته, e.g. "سه شنبه و چهارشنبه")
  
  // Computed fields
  realNights: number; // Computed real nights (تعداد شب واقعی)
  grossPrice: number; // Computed gross price from site (قیمت ناخالص)
  commission: number; // Computed platform commission (کارمزد کسر شده)
  adr: number; // Average Daily Rate (نرخ هر شب)
  month: string; // Persian month name (ماه, e.g. "فروردین")
  customerProfile: string; // Couple or Family (پروفایل مشتری, e.g. "زوج جوان")
}

export interface CabinCosts {
  weeks: number; // default 10
  waterCostPerWeek: number; // default 600,000
  sheypoorCostPerWeek: number; // default 80,000
  cleaningCost: number; // default 2,000,000
}

export interface PerformanceSummary {
  totalGross: number;
  totalCommission: number;
  totalNet: number;
  waterCost: number;
  sheypoorCost: number;
  cleaningCost: number;
  totalCosts: number;
  finalProfit: number;
  occupancyRate: number;
  averageADR: number;
  totalNightsSold: number;
  totalNightsCapacity: number;
}
