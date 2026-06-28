import { Booking } from '../types';
import { toPersianDigits } from '../utils/calculations';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  TooltipProps,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { BarChart3, PieChartIcon, Users, Percent, TrendingUp } from 'lucide-react';

interface ChartsProps {
  bookings: Booking[];
  language: 'fa' | 'en';
}

export default function Charts({ bookings, language }: ChartsProps) {
  const isFa = language === 'fa';

  // --- CHART 1: platform gross market share ---
  const platformGroupMap: { [key: string]: number } = {};
  bookings.forEach((b) => {
    const p = b.referrer.trim();
    platformGroupMap[p] = (platformGroupMap[p] || 0) + b.grossPrice;
  });

  const chart1Data = Object.keys(platformGroupMap).map((name) => ({
    name,
    value: platformGroupMap[name],
  }));

  const COLORS = [
    '#f59e0b', // amber
    '#34d399', // emerald
    '#f87171', // rose
    '#818cf8', // indigo
    '#a78bfa', // purple
    '#22d3ee', // cyan
    '#f472b6', // pink
    '#fb7185', // rose-soft
  ];

  // --- CHART 2: monthly net revenue ---
  // Months: فروردین, اردیبهشت, خرداد, تیر
  const monthsOrder = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر'];
  const monthGroupMap: { [key: string]: number } = {
    فروردین: 0,
    اردیبهشت: 0,
    خرداد: 0,
    تیر: 0,
  };

  bookings.forEach((b) => {
    const m = b.month;
    if (m in monthGroupMap) {
      monthGroupMap[m] += b.netPrice;
    } else {
      monthGroupMap[m] = (monthGroupMap[m] || 0) + b.netPrice;
    }
  });

  const chart2Data = monthsOrder.map((m) => {
    let displayName = m;
    if (!isFa) {
      if (m === 'فروردین') displayName = 'Farvardin';
      else if (m === 'اردیبهشت') displayName = 'Ordibehesht';
      else if (m === 'خرداد') displayName = 'Khordad';
      else if (m === 'تیر') displayName = 'Tir';
    }
    return {
      name: displayName,
      // Convert to Millions Tomans
      revenueMillions: monthGroupMap[m] / 1000000,
      rawRevenue: monthGroupMap[m],
    };
  });

  // --- CHART 3: nights booked by customer profile ---
  const profileGroupMap: { [key: string]: number } = {
    'زوج جوان': 0,
    'خانواده / گروه': 0,
  };

  bookings.forEach((b) => {
    const p = b.customerProfile;
    profileGroupMap[p] = (profileGroupMap[p] || 0) + b.realNights;
  });

  const chart3Data = Object.keys(profileGroupMap).map((name) => ({
    name: name === 'زوج جوان' && !isFa ? 'Young Couple' : name === 'خانواده / گروه' && !isFa ? 'Family / Group' : name,
    nights: profileGroupMap[name],
  }));

  // Custom formatted tooltip for Persian currency
  const CustomCurrencyTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataVal = payload[0].value;
      if (dataVal !== undefined) {
        return (
          <div className="bg-[#09090B] border border-white/10 text-white p-3 rounded-sm shadow-lg text-xs font-semibold backdrop-blur-xs">
            <p className="mb-1 text-zinc-400">{payload[0].name}</p>
            <p className="text-amber-500 font-mono">
              {isFa
                ? `${toPersianDigits(dataVal.toLocaleString())} تومان`
                : `${dataVal.toLocaleString()} Tomans`
              }
            </p>
          </div>
        );
      }
    }
    return null;
  };

  const CustomMillionsTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataVal = payload[0].payload.rawRevenue as number;
      return (
        <div className="bg-[#09090B] border border-white/10 text-white p-3 rounded-sm shadow-lg text-xs font-semibold backdrop-blur-xs">
          <p className="mb-1 text-zinc-400">{payload[0].name}</p>
          <p className="text-emerald-400 font-mono">
            {isFa
              ? `${toPersianDigits((dataVal / 1000000).toFixed(2))} میلیون تومان`
              : `${(dataVal / 1000000).toFixed(2)}M Tomans`
            }
          </p>
          <p className="text-[10px] text-zinc-500 font-normal mt-1">
            {isFa
              ? `دقیق: ${toPersianDigits(dataVal.toLocaleString())} تومان`
              : `Exact: ${dataVal.toLocaleString()} Tomans`
            }
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomNightsTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataVal = payload[0].value;
      if (dataVal !== undefined) {
        return (
          <div className="bg-[#09090B] border border-white/10 text-white p-3 rounded-sm shadow-lg text-xs font-semibold backdrop-blur-xs">
            <p className="mb-1 text-zinc-400">{payload[0].name}</p>
            <p className="text-amber-500 font-mono">
              {isFa ? `${toPersianDigits(dataVal)} شب رزرو` : `${dataVal} Nights Booked`}
            </p>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="dashboard-charts-container">
      {/* Chart 1: Donut platform share */}
      <div className="bg-[#121214]/60 backdrop-blur-md border border-white/5 p-6 rounded-sm flex flex-col h-[400px] transition-all duration-300 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/[0.02]" id="chart-market-share">
        <div className="flex items-center gap-3 mb-6 shrink-0 text-amber-500 border-l border-amber-500/30 pl-3">
          <Percent className="w-4 h-4 text-amber-500" />
          <h4 className="font-serif italic text-white text-md">
            {isFa ? 'سهم پلتفرم‌ها از درآمد ناخالص (Gross)' : 'Gross Market Share by Platform'}
          </h4>
        </div>

        <div className="flex-1 min-h-0 relative">
          {chart1Data.length === 0 ? (
            <div className="flex items-center justify-center h-full text-zinc-600 text-xs font-serif italic">
              {isFa ? 'داده‌ای وجود ندارد' : 'No platform data'}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chart1Data}
                  cx="50%"
                  cy="45%"
                  innerRadius="55%"
                  outerRadius="75%"
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chart1Data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomCurrencyTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={40} 
                  iconType="rect"
                  iconSize={10}
                  wrapperStyle={{ fontSize: '10px', color: '#a1a1aa' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Chart 2: Monthly Net Revenue */}
      <div className="bg-[#121214]/60 backdrop-blur-md border border-white/5 p-6 rounded-sm flex flex-col h-[400px] transition-all duration-300 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/[0.02]" id="chart-monthly-revenue">
        <div className="flex items-center gap-3 mb-6 shrink-0 text-amber-500 border-l border-amber-500/30 pl-3">
          <BarChart3 className="w-4 h-4 text-amber-500" />
          <h4 className="font-serif italic text-white text-md">
            {isFa ? 'تحلیل فصلی: درآمد خالص ماهیانه' : 'Monthly Net Revenue (Millions)'}
          </h4>
        </div>

        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chart2Data}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#71717a', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#71717a', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => isFa ? toPersianDigits(val) : val}
              />
              <Tooltip content={<CustomMillionsTooltip />} />
              <Bar 
                dataKey="revenueMillions" 
                fill="#34d399" 
                radius={[2, 2, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Nights Booked by Profile */}
      <div className="bg-[#121214]/60 backdrop-blur-md border border-white/5 p-6 rounded-sm flex flex-col h-[400px] transition-all duration-300 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/[0.02]" id="chart-customer-profile">
        <div className="flex items-center gap-3 mb-6 shrink-0 text-amber-500 border-l border-amber-500/30 pl-3">
          <Users className="w-4 h-4 text-amber-500" />
          <h4 className="font-serif italic text-white text-md">
            {isFa ? 'سهم پروفایل مشتریان از شب‌های اشغالی' : 'Nights Booked by Customer Profile'}
          </h4>
        </div>

        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chart3Data}
              margin={{ top: 10, right: 10, left: -30, bottom: 0 }}
            >
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#71717a', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#71717a', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => isFa ? toPersianDigits(val) : val}
              />
              <Tooltip content={<CustomNightsTooltip />} />
              <Bar 
                dataKey="nights" 
                fill="#818cf8" 
                radius={[2, 2, 0, 0]}
                maxBarSize={40}
              >
                {chart3Data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === 0 ? '#f59e0b' : '#34d399'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 4: Monthly Revenue Line Trend */}
      <div className="bg-[#121214]/60 backdrop-blur-md border border-white/5 p-6 rounded-sm flex flex-col h-[400px] transition-all duration-300 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/[0.02]" id="chart-revenue-line-trend">
        <div className="flex items-center gap-3 mb-6 shrink-0 text-amber-500 border-l border-amber-500/30 pl-3">
          <TrendingUp className="w-4 h-4 text-amber-500" />
          <h4 className="font-serif italic text-white text-md">
            {isFa ? 'روند تغییرات درآمد ماهیانه (منحنی)' : 'Monthly Revenue Trend Curve'}
          </h4>
        </div>

        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chart2Data}
              margin={{ top: 15, right: 20, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1f1f22" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#71717a', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#71717a', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => isFa ? toPersianDigits(val) : val}
              />
              <Tooltip content={<CustomMillionsTooltip />} />
              <Line 
                type="monotone" 
                dataKey="revenueMillions" 
                stroke="#f59e0b" 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: '#121214', stroke: '#f59e0b' }}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#34d399' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
