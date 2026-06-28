import React, { useState, useEffect } from 'react';
import { Booking } from '../types';
import { X } from 'lucide-react';
import { motion } from 'motion/react';

interface BookingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bookingData: any) => void;
  booking?: Booking | null; // If editing, pass the booking
  language: 'fa' | 'en';
}

export default function BookingFormModal({
  isOpen,
  onClose,
  onSave,
  booking,
  language,
}: BookingFormModalProps) {
  const isFa = language === 'fa';

  const [name, setName] = useState('');
  const [durationRaw, setDurationRaw] = useState('1');
  const [guestsRaw, setGuestsRaw] = useState('2');
  const [netPrice, setNetPrice] = useState(2000000);
  const [referrer, setReferrer] = useState('جاجیگا');
  const [customReferrer, setCustomReferrer] = useState('');
  const [isCustomReferrer, setIsCustomReferrer] = useState(false);
  const [checkInDate, setCheckInDate] = useState('1405/02/01');
  const [weekday, setWeekday] = useState('پنجشنبه');

  // Popular platforms/referrers preset list
  const platformsPreset = [
    'جاجیگا',
    'اتاقک',
    'شب',
    'شیپور',
    'بهنام',
    'شکری(کافه)',
    'پورحسین',
    'سایر (وارد کردن دستی)'
  ];

  useEffect(() => {
    if (booking) {
      setName(booking.name);
      setDurationRaw(booking.durationRaw);
      setGuestsRaw(booking.guestsRaw);
      setNetPrice(booking.netPrice);
      setCheckInDate(booking.checkInDate);
      setWeekday(booking.weekday);

      const isPreset = platformsPreset.includes(booking.referrer);
      if (isPreset) {
        setReferrer(booking.referrer);
        setIsCustomReferrer(false);
      } else {
        setReferrer('سایر (وارد کردن دستی)');
        setCustomReferrer(booking.referrer);
        setIsCustomReferrer(true);
      }
    } else {
      // Set default for adding
      setName('');
      setDurationRaw('1');
      setGuestsRaw('2');
      setNetPrice(2000000);
      setReferrer('جاجیگا');
      setCustomReferrer('');
      setIsCustomReferrer(false);
      
      // Auto compute approximate current Jalali year month
      setCheckInDate('1405/02/10');
      setWeekday('پنجشنبه');
    }
  }, [booking, isOpen]);

  if (!isOpen) return null;

  const handleReferrerChange = (val: string) => {
    setReferrer(val);
    if (val === 'سایر (وارد کردن دستی)') {
      setIsCustomReferrer(true);
    } else {
      setIsCustomReferrer(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalReferrer = isCustomReferrer ? customReferrer : referrer;

    onSave({
      id: booking ? booking.id : undefined, // Will be computed or preserved
      name: name.trim(),
      durationRaw,
      guestsRaw,
      netPrice: Number(netPrice),
      referrer: finalReferrer.trim() || 'سایر',
      checkInDate,
      weekday,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" id="booking-form-modal-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#121214] border border-white/10 rounded-sm w-full max-w-xl shadow-2xl overflow-hidden flex flex-col"
        id="booking-form-modal-container"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
          <h3 className="font-serif italic text-lg text-white">
            {booking 
              ? (isFa ? 'ویرایش اطلاعات رزرو' : 'Edit Booking Details') 
              : (isFa ? 'ثبت رزرو جدید برای کلبه' : 'Register New Booking')
            }
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded-sm transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1 overflow-y-auto">
          {/* Passenger Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              {isFa ? 'نام مسافر / سرپرست گروه' : 'Passenger / Group Lead Name'}
            </label>
            <input
              type="text"
              required
              placeholder={isFa ? 'مثال: علیرضا محمدی' : 'e.g. Alireza Mohamadi'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-sm text-sm text-white focus:outline-none focus:border-amber-500/50"
              id="field-passenger-name"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Stay Duration Raw */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                {isFa ? 'مدت اقامت (کد یا متن)' : 'Stay Duration'}
              </label>
              <input
                type="text"
                required
                placeholder={isFa ? 'مثال: 2 یا 12ساعته' : 'e.g. 2 or 12ساعته'}
                value={durationRaw}
                onChange={(e) => setDurationRaw(e.target.value)}
                className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-sm text-sm text-white focus:outline-none focus:border-amber-500/50 font-mono"
                id="field-duration-raw"
              />
              <span className="text-[10px] text-zinc-500">
                {isFa ? 'عبارت شامل "ساعته" معادل ۱ شب واقعی محاسبه می‌شود.' : 'Contains "ساعته" counts as 1 real night.'}
              </span>
            </div>

            {/* Guest Count Raw */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                {isFa ? 'تعداد نفرات همراه' : 'Guest Count'}
              </label>
              <input
                type="text"
                required
                placeholder={isFa ? 'مثال: 2 یا 4+1' : 'e.g. 2 or 4+1'}
                value={guestsRaw}
                onChange={(e) => setGuestsRaw(e.target.value)}
                className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-sm text-sm text-white focus:outline-none focus:border-amber-500/50 font-mono"
                id="field-guests-raw"
              />
              <span className="text-[10px] text-zinc-500">
                {isFa ? 'تعداد "2" معادل زوج جوان و سایر مقادیر خانواده است.' : 'Exactly "2" registers as young couple profile.'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Check In Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                {isFa ? 'تاریخ ورود (جلالی)' : 'Check-in Date (Jalali)'}
              </label>
              <input
                type="text"
                required
                placeholder="1405/02/10"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-sm text-sm text-white focus:outline-none focus:border-amber-500/50 font-mono text-center"
                id="field-check-in-date"
              />
              <span className="text-[10px] text-zinc-500">
                {isFa ? 'فرمت به شکل سال/ماه/روز رعایت شود.' : 'Use YYYY/MM/DD format.'}
              </span>
            </div>

            {/* Weekday */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                {isFa ? 'روزهای هفته' : 'Weekday Name'}
              </label>
              <input
                type="text"
                required
                placeholder={isFa ? 'سه شنبه و چهارشنبه' : 'e.g. Tuesday & Wednesday'}
                value={weekday}
                onChange={(e) => setWeekday(e.target.value)}
                className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-sm text-sm text-white focus:outline-none focus:border-amber-500/50"
                id="field-weekday"
              />
            </div>
          </div>

          {/* Net Price (Received Cash) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              {isFa ? 'مبلغ دریافتی خالص شما (به تومان)' : 'Net Income (Tomans)'}
            </label>
            <input
              type="number"
              required
              min="0"
              step="50000"
              value={netPrice}
              onChange={(e) => setNetPrice(Number(e.target.value) || 0)}
              className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-sm text-sm text-white focus:outline-none focus:border-amber-500/50 font-mono font-bold"
              id="field-net-price"
            />
          </div>

          {/* Referral/Platform selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                {isFa ? 'معرف / کانال رزرو' : 'Booking Referral Channel'}
              </label>
              <select
                value={referrer}
                onChange={(e) => handleReferrerChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-sm text-sm text-white focus:outline-none focus:border-amber-500/50"
                id="field-referrer-select"
              >
                {platformsPreset.map((p) => (
                  <option key={p} value={p} className="bg-[#121214] text-white">
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom referrer input (visible if selected "سایر") */}
            {isCustomReferrer && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-amber-500">
                  {isFa ? 'نام پلتفرم سفارشی' : 'Custom Platform Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isFa ? 'مثال: اینستاگرام' : 'e.g. Instagram'}
                  value={customReferrer}
                  onChange={(e) => setCustomReferrer(e.target.value)}
                  className="w-full px-3 py-2.5 bg-black/40 border border-amber-500/30 rounded-sm text-sm text-white focus:outline-none focus:border-amber-500"
                  id="field-referrer-custom-input"
                />
                <span className="text-[9px] text-zinc-500">
                  {isFa ? 'پلتفرم سفارشی بدون کارمزد (۰٪) در محاسبات مالی اعمال می‌شود.' : 'Custom referral has 0% platform fee.'}
                </span>
              </div>
            )}
          </div>

          {/* Platform commission warning hint */}
          <div className="p-3 bg-amber-500/5 rounded-sm border border-amber-500/10 text-xs text-amber-500/90">
            {isFa ? (
              <p>
                💡 <strong>راهنما:</strong> کارمزدهای سایت بصورت خودکار طبق الگو محاسبه می‌شود:{' '}
                <span className="font-semibold text-white">جاجیگا ۱۶٪</span>،{' '}
                <span className="font-semibold text-white">اتاقک ۱۹٪</span> و{' '}
                <span className="font-semibold text-white">شب ۱۴٪</span>. سایر پلتفرم‌ها کارمزد صفر دارند.
              </p>
            ) : (
              <p>
                💡 <strong>Note:</strong> Platform commissions are auto-calculated:{' '}
                <span className="font-semibold text-white">Jajiga 16%</span>, <span className="font-semibold text-white">Otaghak 19%</span>,{' '}
                <span className="font-semibold text-white">Shab 14%</span>. Other referrals have 0% fee.
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-white/10 rounded-sm text-xs font-bold uppercase tracking-wider text-zinc-400 hover:bg-white/5 transition-all cursor-pointer"
            >
              {isFa ? 'انصراف' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-black rounded-sm text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-amber-500/10 cursor-pointer"
              id="save-booking-btn"
            >
              {isFa ? 'ذخیره تغییرات' : 'Save Reservation'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
