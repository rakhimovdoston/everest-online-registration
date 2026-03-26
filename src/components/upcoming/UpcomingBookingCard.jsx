import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CalendarIcon, BuildingOfficeIcon, ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useUpcomingBooking } from '../../contexts/UpcomingBookingContext';

const urgencyConfig = {
  today: {
    wrapper: 'bg-red-50 border-red-300',
    badge: 'bg-red-600 text-white',
    icon: 'text-red-600',
    days: 'text-red-700 font-bold',
  },
  soon: {
    wrapper: 'bg-amber-50 border-amber-300',
    badge: 'bg-amber-500 text-white',
    icon: 'text-amber-500',
    days: 'text-amber-700 font-bold',
  },
  week: {
    wrapper: 'bg-blue-50 border-blue-200',
    badge: 'bg-blue-600 text-white',
    icon: 'text-blue-500',
    days: 'text-blue-700 font-semibold',
  },
  later: {
    wrapper: 'bg-slate-50 border-slate-200',
    badge: 'bg-slate-500 text-white',
    icon: 'text-slate-400',
    days: 'text-slate-600',
  },
};

const getUrgency = (days) => {
  if (days === 0) return 'today';
  if (days <= 3) return 'soon';
  if (days <= 7) return 'week';
  return 'later';
};

const UpcomingBookingCard = () => {
  const { t } = useTranslation();
  const { data, loading, isDismissed, dismiss } = useUpcomingBooking();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-6">
        <div className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!data || isDismissed) return null;

  const urgency = getUrgency(data.daysRemaining);
  const cfg = urgencyConfig[urgency];

  const timeLabels = {
    morning: t('upcomingBooking.morning'),
    afternoon: t('upcomingBooking.afternoon'),
    evening: t('upcomingBooking.evening'),
  };

  const months = t('common.months', { returnObjects: true });
  const date = new Date(data.testDate);
  const formattedDate = `${date.getDate()}-${months[date.getMonth()]}, ${date.getFullYear()}`;

  const daysLabel =
    data.daysRemaining === 0
      ? t('upcomingBooking.today')
      : t('upcomingBooking.daysLeft', { count: data.daysRemaining });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35 }}
        className="max-w-7xl mx-auto px-6 lg:px-8 pt-6"
      >
        <div className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 ${cfg.wrapper} shadow-sm`}>
          {/* Dismiss button */}
          <button
            onClick={dismiss}
            className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>

          {/* Left: title + badge */}
          <div className="flex-shrink-0 hidden sm:flex flex-col items-center gap-1">
            <CalendarIcon className={`w-8 h-8 ${cfg.icon}`} />
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>
              {daysLabel}
            </span>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-12 bg-current opacity-10" />

          {/* Info */}
          <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                {t('upcomingBooking.title')}
              </p>
              <p className={`text-sm font-bold ${cfg.days}`}>
                📅 {formattedDate}
              </p>
              <p className="text-xs text-slate-500">
                <ClockIcon className="w-3 h-3 inline mr-0.5" />
                {timeLabels[data.testTime] ?? data.testTime}
              </p>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-sm text-slate-700 font-medium">
                <BuildingOfficeIcon className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                {data.branchName}
              </p>
              {data.packageName && (
                <p className="text-xs text-slate-500">📦 {data.packageName}</p>
              )}
            </div>
            <div className="flex flex-col justify-center">
              {data.totalUpcoming > 1 && (
                <p className="text-xs text-slate-500">
                  📋 {t('upcomingBooking.totalUpcoming', { count: data.totalUpcoming })}
                </p>
              )}
              {/* Mobile days badge */}
              <span className={`sm:hidden mt-1 text-xs font-bold px-2 py-0.5 rounded-full w-fit ${cfg.badge}`}>
                {daysLabel}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpcomingBookingCard;
