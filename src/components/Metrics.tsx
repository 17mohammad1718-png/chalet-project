import { PerformanceSummary } from '../types';
import { formatPrice, toPersianDigits } from '../utils/calculations';
import { 
  TrendingUp, 
  Percent, 
  Coins, 
  Receipt, 
  Wallet, 
  Home, 
  CalendarCheck2 
} from 'lucide-react';
import { motion } from 'motion/react';
import AnimatedCounter from './AnimatedCounter';

interface MetricsProps {
  summary: PerformanceSummary;
  language: 'fa' | 'en';
}

export default function Metrics({ summary, language }: MetricsProps) {
  const isFa = language === 'fa';

  const metricsData = [
    {
      title: isFa ? 'گردش مالی کل (Gross)' : 'TOTAL GROSS REVENUE',
      desc: isFa ? 'مجموع مبالغ رزرو ثبت شده در سایت‌ها' : 'Total booking values on platforms',
      rawValue: summary.totalGross,
      icon: TrendingUp,
      valueColor: 'text-white font-light',
      borderColor: 'border-white/5',
      barColor: 'bg-amber-600',
      showBar: true,
      barWidth: '75%'
    },
    {
      title: isFa ? 'کارمزد بلعیده‌شده (Commissions)' : 'CHANNELS COMMISSIONS',
      desc: isFa ? 'سهم کسر شده توسط جاجیگا، اتاقک و شب' : 'Fees kept by channels (Avg. 16%)',
      rawValue: summary.totalCommission,
      icon: Percent,
      valueColor: 'text-rose-400 font-light',
      borderColor: 'border-white/5',
      barColor: 'bg-rose-500/30',
      showBar: false
    },
    {
      title: isFa ? 'دریافتی خالص شما (Net Revenue)' : 'NET CASH RECEIVED',
      desc: isFa ? 'نقدینگی ورودی قبل از کسر مخارج کلبه' : 'Revenue received before expenses',
      rawValue: summary.totalNet,
      icon: Coins,
      valueColor: 'text-emerald-400 font-light',
      borderColor: 'border-white/5',
      barColor: 'bg-emerald-500/30',
      showBar: false
    },
    {
      title: isFa ? 'مجموع هزینه‌های جاری (Expenses)' : 'TOTAL OPERATING COSTS',
      desc: isFa ? 'آب، تبلیغات شیپور و بهداشت' : 'Water refill, ads, and cleaning costs',
      rawValue: summary.totalCosts,
      icon: Receipt,
      valueColor: 'text-amber-500 font-light',
      borderColor: 'border-white/5',
      barColor: 'bg-amber-500/30',
      showBar: false
    },
    {
      title: isFa ? 'سود خالص نهایی (Net Profit)' : 'CONSOLIDATED NET PROFIT',
      desc: isFa ? 'سود نهایی باقی‌مانده در جیب شما' : 'Profit remaining in your pocket',
      rawValue: summary.finalProfit,
      icon: Wallet,
      valueColor: summary.finalProfit >= 0 ? 'text-emerald-400 font-light' : 'text-rose-400 font-light',
      borderColor: 'border-white/5',
      barColor: 'bg-emerald-500/30',
      showBar: false
    },
    {
      title: isFa ? 'میانگین قیمت هر شب (ADR)' : 'AVERAGE DAILY RATE (ADR)',
      desc: isFa ? 'متوسط نرخ اجاره به ازای هر شب واقعی' : 'Average rate calculated per night',
      rawValue: summary.averageADR,
      icon: Home,
      valueColor: 'text-purple-400 font-light',
      borderColor: 'border-white/5',
      barColor: 'bg-purple-500/30',
      showBar: false
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="dashboard-metrics-grid">
      {metricsData.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.05 }}
          className={`flex flex-col p-5 rounded-sm border bg-[#121214]/60 backdrop-blur-md relative overflow-hidden transition-all duration-300 hover:scale-105 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/[0.02] ${item.borderColor}`}
          id={`metric-card-${idx}`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
              {item.title}
            </span>
            <div className="text-zinc-500">
              <item.icon className="w-4 h-4" />
            </div>
          </div>
          
          <div className="flex flex-col justify-end mt-auto">
            <span className={`text-2xl font-mono ${item.valueColor}`}>
              <AnimatedCounter 
                value={item.rawValue} 
                formatter={(val) => formatPrice(val, isFa)} 
              />
            </span>
            <span className="text-[11px] text-zinc-500 mt-1.5 italic">
              {item.desc}
            </span>

            {item.showBar && (
              <div className="mt-4 h-1 w-full bg-white/5 rounded-xs overflow-hidden">
                <div className={`h-full ${item.barColor}`} style={{ width: item.barWidth }} />
              </div>
            )}
          </div>
        </motion.div>
      ))}

      {/* Occupancy card - detailed bento item */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="col-span-1 md:col-span-2 lg:col-span-3 bg-[#121214]/60 backdrop-blur-md border border-white/5 p-6 rounded-sm flex flex-col md:flex-row justify-between gap-6 transition-all duration-300 hover:scale-105 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/[0.02]"
        id="occupancy-bento-card"
      >
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 text-amber-500">
              <CalendarCheck2 className="w-4 h-4" />
              <h3 className="font-serif italic text-lg text-white">
                {isFa ? 'نرخ اشغال کلبه (Occupancy Rate)' : 'Cabin Occupancy Performance'}
              </h3>
            </div>
            <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
              {isFa 
                ? `در بازه زمانی ${toPersianDigits(summary.totalNightsCapacity / 7)} هفته‌ای مورد بررسی (معادل ${toPersianDigits(summary.totalNightsCapacity)} روز ظرفیت کل)، کلبه شما مجموعاً ${toPersianDigits(summary.totalNightsSold)} شب رزرو ثبت‌شده داشته است.`
                : `Out of the checked ${summary.totalNightsCapacity / 7} weeks (${summary.totalNightsCapacity} total night capacity), your cabin had a total of ${summary.totalNightsSold} booked nights.`
              }
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-5 border-t border-white/5">
            <div>
              <span className="text-[10px] text-zinc-500 block mb-1 uppercase tracking-wider">
                {isFa ? 'کل ظرفیت شب‌ها' : 'TOTAL CAPACITY'}
              </span>
              <span className="text-sm font-semibold text-white font-mono">
                <AnimatedCounter 
                  value={summary.totalNightsCapacity} 
                  formatter={(val) => isFa ? toPersianDigits(val) : String(val)} 
                /> {isFa ? 'شب' : 'Nights'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 block mb-1 uppercase tracking-wider">
                {isFa ? 'شب‌های اشغال شده' : 'NIGHTS BOOKED'}
              </span>
              <span className="text-sm font-semibold text-emerald-400 font-mono">
                <AnimatedCounter 
                  value={summary.totalNightsSold} 
                  formatter={(val) => isFa ? toPersianDigits(val) : String(val)} 
                /> {isFa ? 'شب' : 'Nights'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 block mb-1 uppercase tracking-wider">
                {isFa ? 'شب‌های خالی' : 'NIGHTS EMPTY'}
              </span>
              <span className="text-sm font-semibold text-rose-400 font-mono">
                <AnimatedCounter 
                  value={summary.totalNightsCapacity - summary.totalNightsSold} 
                  formatter={(val) => isFa ? toPersianDigits(val) : String(val)} 
                /> {isFa ? 'شب' : 'Nights'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 block mb-1 uppercase tracking-wider">
                {isFa ? 'دوره بررسی' : 'CYCLE WEEKS'}
              </span>
              <span className="text-sm font-semibold text-amber-500 font-mono">
                <AnimatedCounter 
                  value={summary.totalNightsCapacity / 7} 
                  formatter={(val) => isFa ? toPersianDigits(val) : String(val)} 
                /> {isFa ? 'هفته' : 'Weeks'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center md:border-l md:border-white/5 md:pl-12 md:rtl:border-l-0 md:rtl:border-r md:rtl:pr-12 min-w-[200px]">
          <div className="relative flex items-center justify-center">
            <div className="w-28 h-28 rounded-full border-8 border-white/5 flex items-center justify-center relative">
              <div className="text-center">
                <span className="text-2xl font-light text-amber-500 font-mono">
                  <AnimatedCounter 
                    value={summary.occupancyRate} 
                    decimals={1} 
                    formatter={(val) => isFa ? toPersianDigits(val.toFixed(1)) : val.toFixed(1)} 
                  />%
                </span>
                <span className="text-[8px] uppercase text-zinc-500 font-bold block mt-0.5 tracking-wider">
                  {isFa ? 'اشغال شده' : 'OCCUPIED'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="w-full mt-4">
            <div className="w-full h-1 bg-white/5 rounded-xs overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-xs transition-all duration-500" 
                style={{ width: `${Math.min(summary.occupancyRate, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
