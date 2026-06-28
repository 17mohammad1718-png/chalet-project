import { Booking } from '../types';
import { formatPrice, toPersianDigits } from '../utils/calculations';
import { Search, Plus, Edit, Trash2, Filter, Download } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface BookingTableProps {
  bookings: Booking[];
  language: 'fa' | 'en';
  onAddBooking: () => void;
  onEditBooking: (booking: Booking) => void;
  onDeleteBooking: (id: number) => void;
  onExportExcel: () => void;
}

export default function BookingTable({
  bookings,
  language,
  onAddBooking,
  onEditBooking,
  onDeleteBooking,
  onExportExcel,
}: BookingTableProps) {
  const isFa = language === 'fa';
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState('All');

  // Find unique platforms for the filter dropdown
  const uniquePlatforms = ['All', ...Array.from(new Set(bookings.map((b) => b.referrer.trim())))];

  // Filtering logic
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.referrer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.checkInDate.includes(searchTerm);
    
    const matchesPlatform = platformFilter === 'All' || b.referrer.trim() === platformFilter;

    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="bg-[#121214]/60 backdrop-blur-md border border-white/5 rounded-sm overflow-hidden transition-all duration-300 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/[0.02]" id="booking-manager-panel">
      {/* Table Toolbar Header */}
      <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="border-l border-amber-500/30 pl-3">
          <h3 className="font-serif italic text-xl text-white">
            {isFa ? 'مدیریت و لیست رزروهای کلبه' : 'Premium Cabin Reservations'}
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            {isFa 
              ? `مجموعاً ${toPersianDigits(bookings.length)} رزرو ثبت شده است. امکان ویرایش، حذف یا تعریف رزرو جدید وجود دارد.`
              : `${bookings.length} reservations found. Sophisticated corporate tracking active.`
            }
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onExportExcel}
            className="flex items-center gap-2 px-4 py-2 bg-black/40 text-emerald-400 hover:bg-white/5 border border-white/10 rounded-sm text-xs font-semibold transition-all cursor-pointer font-serif italic"
            id="export-excel-btn"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isFa ? 'خروجی اکسل لوکس شرکتی' : 'Export Corporate Ledger'}</span>
          </button>

          <button
            onClick={onAddBooking}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-amber-500/10"
            id="add-booking-btn"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3px]" />
            <span>{isFa ? 'ثبت رزرو جدید' : 'New Reservation'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-black/20 border-b border-white/5 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder={isFa ? 'جستجو بر اساس نام مسافر، پلتفرم یا تاریخ ورود...' : 'Search passenger name, platform, date...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-sm text-xs focus:outline-none focus:border-amber-500/50 text-white placeholder-zinc-500"
            id="booking-search-input"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="w-full md:w-48 px-3 py-2 bg-black/40 border border-white/10 rounded-sm text-xs focus:outline-none focus:border-amber-500/50 text-white"
            id="platform-filter-select"
          >
            {uniquePlatforms.map((p) => (
              <option key={p} value={p} className="bg-[#121214] text-white">
                {p === 'All' ? (isFa ? 'همه پلتفرم‌ها' : 'All Platforms') : p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs text-zinc-400" id="bookings-main-table">
          <thead>
            <tr className="bg-white/[0.01] border-b border-white/5 text-zinc-500 uppercase tracking-wider text-[10px]">
              <th className="p-4 font-medium text-center w-12">#</th>
              <th className="p-4 font-medium">{isFa ? 'نام مسافر' : 'Passenger Name'}</th>
              <th className="p-4 font-medium text-center">{isFa ? 'تاریخ ورود' : 'Check-in'}</th>
              <th className="p-4 font-medium text-center">{isFa ? 'روز هفته' : 'Day of Week'}</th>
              <th className="p-4 font-medium text-center">{isFa ? 'مدت اقامت' : 'Duration'}</th>
              <th className="p-4 font-medium text-center">{isFa ? 'شب واقعی' : 'Nights'}</th>
              <th className="p-4 font-medium text-center">{isFa ? 'نفرات' : 'Guests'}</th>
              <th className="p-4 font-medium text-right">{isFa ? 'دریافتی خالص شما' : 'Net Income'}</th>
              <th className="p-4 font-medium text-center">{isFa ? 'معرف / سایت' : 'Referral/Platform'}</th>
              <th className="p-4 font-medium text-right">{isFa ? 'قیمت ناخالص' : 'Gross Price'}</th>
              <th className="p-4 font-medium text-right">{isFa ? 'کارمزد سایت' : 'Platform Fee'}</th>
              <th className="p-4 font-medium text-right">{isFa ? 'نرخ شب (ADR)' : 'ADR'}</th>
              <th className="p-4 font-medium text-center">{isFa ? 'پروفایل' : 'Profile'}</th>
              <th className="p-4 font-medium text-center w-24">{isFa ? 'عملیات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-light">
            <AnimatePresence initial={false}>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={14} className="p-8 text-center text-zinc-600 font-serif italic">
                    {isFa ? 'هیچ رزروی مطابق فیلتر یافت نشد.' : 'No reservations match your filters.'}
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b, idx) => (
                  <motion.tr
                    key={b.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-white/[0.01] transition-colors border-b border-white/5"
                  >
                    {/* Index */}
                    <td className="p-4 text-center font-mono text-zinc-600">
                      {isFa ? toPersianDigits(idx + 1) : idx + 1}
                    </td>

                    {/* Passenger Name */}
                    <td className="p-4 font-semibold text-white">
                      {b.name}
                    </td>

                    {/* Check In Date */}
                    <td className="p-4 text-center font-mono">
                      {isFa ? toPersianDigits(b.checkInDate) : b.checkInDate}
                    </td>

                    {/* Weekday */}
                    <td className="p-4 text-center text-[11px] text-zinc-500">
                      {b.weekday}
                    </td>

                    {/* Stay Duration (Raw) */}
                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 bg-white/5 text-zinc-300 rounded-sm font-mono text-[11px]">
                        {isFa ? toPersianDigits(b.durationRaw) : b.durationRaw}
                      </span>
                    </td>

                    {/* Real Nights (Computed) */}
                    <td className="p-4 text-center font-mono font-bold text-zinc-300">
                      {isFa ? toPersianDigits(b.realNights) : b.realNights}
                    </td>

                    {/* Guest Count (Raw) */}
                    <td className="p-4 text-center font-mono text-zinc-500">
                      {isFa ? toPersianDigits(b.guestsRaw) : b.guestsRaw}
                    </td>

                    {/* Net Price */}
                    <td className="p-4 text-right font-mono font-bold text-emerald-400">
                      {isFa ? toPersianDigits(b.netPrice.toLocaleString()) : b.netPrice.toLocaleString()}
                    </td>

                    {/* Platform/Referral */}
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold tracking-tight uppercase ${
                        b.referrer.includes('جاجیگا') 
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : b.referrer.includes('اتاقک')
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : b.referrer === 'شب'
                          ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                          : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                      }`}>
                        {b.referrer}
                      </span>
                    </td>

                    {/* Gross Price */}
                    <td className="p-4 text-right font-mono text-zinc-400">
                      {isFa ? toPersianDigits(b.grossPrice.toLocaleString()) : b.grossPrice.toLocaleString()}
                    </td>

                    {/* Platform Fee */}
                    <td className="p-4 text-right font-mono text-rose-400/80">
                      {b.commission > 0 
                        ? (isFa ? toPersianDigits(b.commission.toLocaleString()) : b.commission.toLocaleString())
                        : (isFa ? '۰' : '0')
                      }
                    </td>

                    {/* ADR */}
                    <td className="p-4 text-right font-mono text-amber-500 font-semibold">
                      {isFa ? toPersianDigits(b.adr.toLocaleString()) : b.adr.toLocaleString()}
                    </td>

                    {/* Profile */}
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 rounded-xs text-[10px] uppercase font-bold tracking-tight ${
                        b.customerProfile === 'زوج جوان'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/10'
                          : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/10'
                      }`}>
                        {b.customerProfile === 'زوج جوان' ? (isFa ? 'زوج جوان' : 'Couple') : (isFa ? 'خانواده / گروه' : 'Family')}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center">
                      <div className="flex justify-center items-center gap-1">
                        <button
                          onClick={() => onEditBooking(b)}
                          className="p-1.5 text-zinc-500 hover:text-amber-500 rounded-sm hover:bg-white/5 transition-colors cursor-pointer"
                          title={isFa ? 'ویرایش رزرو' : 'Edit Booking'}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteBooking(b.id)}
                          className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-sm hover:bg-white/5 transition-colors cursor-pointer"
                          title={isFa ? 'حذف رزرو' : 'Delete Booking'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
