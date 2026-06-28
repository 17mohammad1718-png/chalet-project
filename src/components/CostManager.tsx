import { CabinCosts } from '../types';
import { formatPrice, toPersianDigits } from '../utils/calculations';
import { Settings, Droplet, Megaphone, Paintbrush, Calendar } from 'lucide-react';

interface CostManagerProps {
  costs: CabinCosts;
  onChangeCosts: (newCosts: CabinCosts) => void;
  language: 'fa' | 'en';
}

export default function CostManager({ costs, onChangeCosts, language }: CostManagerProps) {
  const isFa = language === 'fa';

  const handleChange = (field: keyof CabinCosts, value: number) => {
    onChangeCosts({
      ...costs,
      [field]: value,
    });
  };

  return (
    <div className="bg-[#121214]/60 backdrop-blur-md border border-white/5 rounded-sm p-6 transition-all duration-300 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/[0.02]" id="cost-configuration-panel">
      <div className="flex items-center gap-3 mb-4 text-amber-500 border-l border-amber-500/30 pl-3">
        <Settings className="w-4 h-4 text-amber-500" />
        <h3 className="font-serif italic text-lg text-white">
          {isFa ? 'مدیریت هزینه‌های جاری و متغیر' : 'Operating Cost Configuration'}
        </h3>
      </div>

      <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
        {isFa 
          ? 'با تغییر مقادیر زیر، هزینه‌های ثابت و متغیر کلبه مجدداً محاسبه شده و سود نهایی کل در داشبورد فوراً بروزرسانی می‌شود.'
          : 'Adjust operating factors. Calculations of water refills, advertisement fees, and cleaning supplies update instantly.'
        }
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Weeks duration */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
            <span>{isFa ? 'تعداد هفته‌های تحلیل' : 'WEEKS IN PERIOD'}</span>
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              max="52"
              value={costs.weeks}
              onChange={(e) => handleChange('weeks', Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-sm text-sm font-semibold text-white font-mono focus:outline-none focus:border-amber-500/50"
            />
            <span className="absolute right-3 top-2 text-[10px] text-zinc-500 font-bold pointer-events-none pr-8 font-mono">
              {isFa ? 'هفته' : 'WKS'}
            </span>
          </div>
          <span className="text-[10px] text-zinc-500 mt-1">
            {isFa 
              ? `برابر با ${toPersianDigits(costs.weeks * 7)} روز ظرفیت کل برای پذیرش`
              : `Equals ${costs.weeks * 7} total available nights`
            }
          </span>
        </div>

        {/* Water supply cost */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Droplet className="w-3.5 h-3.5 text-blue-400" />
            <span>{isFa ? 'شارژ آب (هفتگی)' : 'WATER REFILL (WEEKLY)'}</span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="50000"
              value={costs.waterCostPerWeek}
              onChange={(e) => handleChange('waterCostPerWeek', Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-sm text-sm font-semibold text-white font-mono focus:outline-none focus:border-amber-500/50"
            />
          </div>
          <span className="text-[10px] text-zinc-500 mt-1">
            {isFa 
              ? `کل دوره: ${formatPrice(costs.weeks * costs.waterCostPerWeek)}`
              : `Total period: ${formatPrice(costs.weeks * costs.waterCostPerWeek, false)}`
            }
          </span>
        </div>

        {/* Sheypoor cost */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Megaphone className="w-3.5 h-3.5 text-amber-500" />
            <span>{isFa ? 'تبلیغات شیپور (هفتگی)' : 'SHEYPOOR ADS (WEEKLY)'}</span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="10000"
              value={costs.sheypoorCostPerWeek}
              onChange={(e) => handleChange('sheypoorCostPerWeek', Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-sm text-sm font-semibold text-white font-mono focus:outline-none focus:border-amber-500/50"
            />
          </div>
          <span className="text-[10px] text-zinc-500 mt-1">
            {isFa 
              ? `کل دوره: ${formatPrice(costs.weeks * costs.sheypoorCostPerWeek)}`
              : `Total period: ${formatPrice(costs.weeks * costs.sheypoorCostPerWeek, false)}`
            }
          </span>
        </div>

        {/* Cleaning cost */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Paintbrush className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isFa ? 'مواد شوینده (کل دوره)' : 'CLEANING & HYGIENE'}</span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="100000"
              value={costs.cleaningCost}
              onChange={(e) => handleChange('cleaningCost', Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-sm text-sm font-semibold text-white font-mono focus:outline-none focus:border-amber-500/50"
            />
          </div>
          <span className="text-[10px] text-zinc-500 mt-1">
            {isFa 
              ? `یک‌بار شارژ کلی مواد شوینده برای کل ${toPersianDigits(costs.weeks)} هفته`
              : `Lump sum variable clean cost across the ${costs.weeks} weeks`
            }
          </span>
        </div>
      </div>
    </div>
  );
}
