import { useState, useEffect } from 'react';
import { Booking, CabinCosts } from './types';
import { 
  initialBookings, 
  defaultCosts, 
  calculateSummary, 
  exportToExcel, 
  computeBookingFields,
  toPersianDigits,
  formatPrice
} from './utils/calculations';
import Metrics from './components/Metrics';
import Charts from './components/Charts';
import CostManager from './components/CostManager';
import BookingTable from './components/BookingTable';
import BookingFormModal from './components/BookingFormModal';
import Cabin3D from './components/Cabin3D';
import { 
  LayoutDashboard, 
  Globe, 
  Moon, 
  Sun, 
  Sparkles, 
  History,
  TrendingUp,
  Coins,
  Receipt,
  HelpCircle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [costs, setCosts] = useState<CabinCosts>(defaultCosts);
  const [language, setLanguage] = useState<'fa' | 'en'>('fa');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const savedBookings = localStorage.getItem('cabin_bookings');
    const savedCosts = localStorage.getItem('cabin_costs');
    const savedLang = localStorage.getItem('cabin_lang');
    const savedDark = localStorage.getItem('cabin_dark');

    if (savedBookings) {
      try {
        setBookings(JSON.parse(savedBookings));
      } catch (e) {
        setBookings(initialBookings);
      }
    } else {
      setBookings(initialBookings);
    }

    if (savedCosts) {
      try {
        setCosts(JSON.parse(savedCosts));
      } catch (e) {
        setCosts(defaultCosts);
      }
    } else {
      setCosts(defaultCosts);
    }

    if (savedLang === 'fa' || savedLang === 'en') {
      setLanguage(savedLang);
    }

    if (savedDark === 'true') {
      setDarkMode(true);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (bookings.length > 0) {
      localStorage.setItem('cabin_bookings', JSON.stringify(bookings));
    }
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('cabin_costs', JSON.stringify(costs));
  }, [costs]);

  useEffect(() => {
    localStorage.setItem('cabin_lang', language);
    // Set HTML document direction based on language
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    localStorage.setItem('cabin_dark', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Calculate live summary indicators
  const summary = calculateSummary(bookings, costs);

  // Actions
  const handleAddBookingTrigger = () => {
    setEditingBooking(null);
    setIsModalOpen(true);
  };

  const handleEditBookingTrigger = (booking: Booking) => {
    setEditingBooking(booking);
    setIsModalOpen(true);
  };

  const handleDeleteBooking = (id: number) => {
    const confirmMessage = language === 'fa' 
      ? 'آیا از حذف این رزرو اطمینان دارید؟ تمامی محاسبات فوراً بروزرسانی خواهند شد.' 
      : 'Are you sure you want to delete this reservation? All charts and metrics will update instantly.';
    
    if (window.confirm(confirmMessage)) {
      const updated = bookings.filter((b) => b.id !== id);
      setBookings(updated);
    }
  };

  const handleSaveBooking = (formData: any) => {
    if (formData.id) {
      // Edit existing
      const recomputed = computeBookingFields(formData);
      const updated = bookings.map((b) => (b.id === formData.id ? recomputed : b));
      setBookings(updated);
    } else {
      // Add new
      const nextId = bookings.length > 0 ? Math.max(...bookings.map((b) => b.id)) + 1 : 1;
      const fullData = { ...formData, id: nextId };
      const recomputed = computeBookingFields(fullData);
      setBookings([recomputed, ...bookings]);
    }
    setIsModalOpen(false);
  };

  const handleExportExcel = () => {
    exportToExcel(bookings, costs, summary);
  };

  const handleResetToDefaults = () => {
    const confirmMessage = language === 'fa' 
      ? 'آیا مایلید تمام داده‌های رزرو به حالت اولیه ۱۵ تایی برگردند؟ تغییرات ثبت شده شما پاک خواهند شد.' 
      : 'Reset all reservation records to the original 15 entries? Your custom additions will be lost.';
    
    if (window.confirm(confirmMessage)) {
      setBookings(initialBookings);
      setCosts(defaultCosts);
      localStorage.removeItem('cabin_bookings');
      localStorage.removeItem('cabin_costs');
    }
  };

  const isFa = language === 'fa';

  return (
    <div className="min-h-screen pb-16 bg-transparent text-zinc-300 transition-colors duration-200 selection:bg-amber-500/20 selection:text-amber-300">
      {/* 3D Swiss Chalet Global Interactive Background */}
      <Cabin3D language={language} />

      {/* Premium Navigation / Header */}
      <header className="sticky top-0 z-40 bg-[#09090B]/60 backdrop-blur-md border-b border-white/5" id="main-app-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-sm bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-black font-serif italic text-lg font-bold shadow-lg shadow-amber-500/10">
              LC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase tracking-[0.3em] text-amber-500 font-bold">
                  {isFa ? 'مدیریت لوکس کلبه' : 'EXECUTIVE OVERVIEW'}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              </div>
              <h1 className="font-serif italic text-lg sm:text-2xl text-white leading-tight mt-0.5">
                {isFa ? 'سیستم مدیریت و مالی کلبه' : 'Luxury Cabin Management'}
              </h1>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            {/* Reset to defaults button */}
            <button
              onClick={handleResetToDefaults}
              className="p-2 py-1.5 text-zinc-500 hover:text-rose-400 rounded-sm hover:bg-white/5 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
              title={isFa ? 'بازنشانی به داده‌های اولیه' : 'Reset to Default Data'}
              id="reset-data-btn"
            >
              <History className="w-4 h-4 text-zinc-400" />
              <span className="hidden md:inline">{isFa ? 'بازنشانی داده‌ها' : 'Reset Data'}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'fa' ? 'en' : 'fa')}
              className="p-2 py-1.5 text-zinc-400 hover:text-amber-500 rounded-sm hover:bg-white/5 transition-all cursor-pointer flex items-center gap-1 text-xs font-bold font-mono tracking-widest"
              title={isFa ? 'تغییر زبان به انگلیسی' : 'Switch Language to Persian'}
              id="lang-switcher-btn"
            >
              <Globe className="w-4 h-4 text-zinc-500" />
              <span>{language === 'fa' ? 'EN' : 'FA'}</span>
            </button>

            {/* Dark Mode Theme indicator - permanently dark/sophisticated */}
            <div
              className="p-2 text-amber-500 flex items-center"
              title="Sophisticated Dark Mode Active"
            >
              <Moon className="w-4 h-4 text-amber-500" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-10" id="dashboard-main-content">
        {/* Welcome Section Banner - Premium Glassmorphic Overlay */}
        <div className="relative overflow-hidden bg-[#121214]/30 backdrop-blur-md border border-white/5 rounded-sm p-6 sm:p-8" id="welcome-dashboard-banner">
          {/* Subtle gradient glowing accent lines */}
          <div className="absolute top-0 right-0 w-48 h-[1px] bg-gradient-to-l from-amber-500/40 via-amber-500/10 to-transparent" />
          <div className="absolute top-0 right-0 w-[1px] h-48 bg-gradient-to-b from-amber-500/40 via-amber-500/10 to-transparent" />
          <div className="absolute bottom-0 left-0 w-48 h-[1px] bg-gradient-to-r from-indigo-500/20 to-transparent" />
          
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Column 1: Descriptive Title and Context */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-4 pr-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-xs bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold tracking-[0.25em] uppercase">
                  {isFa ? 'چرخه ۱۰ هفته‌ای بهار و تابستان ۱۴۰۵' : '10-WEEK CYCLICAL LEADERSHIP'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif italic text-white tracking-wide leading-tight">
                {isFa ? 'گزارش سود و زیان و پایش پیشرفته کلبه' : 'Executive Cabin Financial Performance'}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl">
                {isFa 
                  ? 'نمای یکپارچه از عملکرد درآمدی پلتفرم‌ها (جاجیگا، اتاقک، شب و شیپور)، نرخ اشغال فصلی و هزینه‌های جاری به منظور پایش هوشمندانه سود نهایی کلبه لوکس در بستر سه‌بعدی.'
                  : 'An integrated, spatial workspace monitoring platform margins, real-time occupancy performance, and operational cabin parameters to maximize hospitality yield.'
                }
              </p>
            </div>

            {/* Column 2: Elegant visual gap for the background interactive 3D model */}
            <div className="hidden lg:block lg:col-span-1" />

            {/* Column 3: High-contrast financial highlight and ledger tools */}
            <div className="lg:col-span-4 flex flex-col justify-between bg-black/60 backdrop-blur-md border border-white/5 p-6 rounded-sm text-center relative overflow-hidden group">
              {/* Internal subtle glow */}
              <div className="absolute -inset-x-20 top-0 h-10 bg-amber-500/5 blur-xl group-hover:bg-amber-500/10 transition-all duration-500" />
              
              <div className="space-y-1 my-auto py-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-bold block">
                  {isFa ? 'سود خالص نهایی واقعی' : 'Consolidated Net Profit'}
                </span>
                <span className="text-3xl font-light text-emerald-400 font-mono block tracking-tight">
                  {formatPrice(summary.finalProfit, isFa)}
                </span>
                <div className="pt-2 flex justify-center items-center gap-1.5 text-zinc-500 text-[10px]">
                  <span>{isFa ? 'نرخ سود نهایی' : 'Profit Margin'}:</span>
                  <span className="text-amber-500 font-mono font-bold">
                    {isFa ? `${toPersianDigits(((summary.finalProfit / (summary.totalGross || 1)) * 100).toFixed(1))}%` : `${((summary.finalProfit / (summary.totalGross || 1)) * 100).toFixed(1)}%`}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex flex-col gap-1.5 text-left text-[10px] text-zinc-400">
                <div className="flex justify-between font-mono">
                  <span className="text-zinc-500">{isFa ? 'کل دریافت ناخالص:' : 'Gross Recv:'}</span>
                  <span className="text-zinc-300">{formatPrice(summary.totalGross, isFa)}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-zinc-500">{isFa ? 'کل مخارج عملیاتی:' : 'Total OpEx:'}</span>
                  <span className="text-rose-400/90">{formatPrice(summary.totalCosts, isFa)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 1. KEY PERFORMANCE METRICS (BENTO GRID) */}
        <section className="space-y-4" id="section-kpis">
          <div className="flex items-center gap-3 px-1 border-l-2 border-amber-500 pl-3">
            <h3 className="font-serif italic text-xl text-white tracking-wide">
              {isFa ? 'شاخص‌های کلیدی عملکرد' : 'Key Performance Indicators'}
            </h3>
          </div>
          <Metrics summary={summary} language={language} />
        </section>

        {/* 2. OPERATING COST MANAGER */}
        <section className="pt-2" id="section-costs">
          <CostManager costs={costs} onChangeCosts={setCosts} language={language} />
        </section>

        {/* 3. VISUAL ANALYTIC CHARTS */}
        <section className="space-y-4 pt-2" id="section-charts">
          <div className="flex items-center gap-3 px-1 border-l-2 border-amber-500 pl-3">
            <h3 className="font-serif italic text-xl text-white tracking-wide">
              {isFa ? 'نمودارهای تحلیل عملکرد' : 'Performance Analytics'}
            </h3>
          </div>
          <Charts bookings={bookings} language={language} />
        </section>

        {/* 4. RESERVATIONS LIST & TABLE */}
        <section className="pt-2" id="section-table">
          <BookingTable
            bookings={bookings}
            language={language}
            onAddBooking={handleAddBookingTrigger}
            onEditBooking={handleEditBookingTrigger}
            onDeleteBooking={handleDeleteBooking}
            onExportExcel={handleExportExcel}
          />
        </section>
      </main>

      {/* 5. MODAL FOR BOOKING ENTRY */}
      <AnimatePresence>
        {isModalOpen && (
          <BookingFormModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveBooking}
            booking={editingBooking}
            language={language}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
