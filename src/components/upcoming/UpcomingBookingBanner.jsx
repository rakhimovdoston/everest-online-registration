import { useTranslation } from 'react-i18next';
import { CalendarIcon, BuildingOfficeIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useUpcomingBooking } from '../../contexts/UpcomingBookingContext';

const urgencyConfig = {
  today: {
    wrapper: 'bg-red-50 border-red-300',
    badge: 'bg-red-600 text-white',
    icon: 'text-red-500',
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

const UpcomingBookingBanner = () => {
  const { t } = useTranslation();
  const { data, loading } = useUpcomingBooking();

  if (loading) {
    return <div className="h-16 bg-slate-100 rounded-xl animate-pulse mb-6" />;
  }

  if (!data) return null;

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
    <div className={`flex flex-wrap items-center gap-3 p-4 rounded-xl border-2 mb-6 ${cfg.wrapper}`}>
      <CalendarIcon className={`w-6 h-6 flex-shrink-0 ${cfg.icon}`} />

      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">
          {t('upcomingBooking.title')}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className={`text-sm font-bold ${cfg.days}`}>
            📅 {formattedDate}
          </span>
          <span className="text-xs text-slate-500">
            <ClockIcon className="w-3 h-3 inline mr-0.5" />
            {timeLabels[data.testTime] ?? data.testTime}
          </span>
          <span className="text-xs text-slate-600">
            <BuildingOfficeIcon className="w-3 h-3 inline mr-0.5" />
            {data.branchName}
          </span>
          {data.packageName && (
            <span className="text-xs text-slate-500">📦 {data.packageName}</span>
          )}
          {data.totalUpcoming > 1 && (
            <span className="text-xs text-slate-500">
              📋 {t('upcomingBooking.totalUpcoming', { count: data.totalUpcoming })}
            </span>
          )}
        </div>
      </div>

      <span className={`flex-shrink-0 text-xs font-bold px-3 py-1 rounded-full ${cfg.badge}`}>
        {daysLabel}
      </span>

      <p className="basis-full flex items-center gap-1.5 text-xs font-medium text-slate-600 border-t border-slate-200/70 pt-2 mt-1">
        <ClockIcon className="w-3.5 h-3.5 flex-shrink-0 text-amber-500" />
        {t('upcomingBooking.lateReminder')}
      </p>
    </div>
  );
};

export default UpcomingBookingBanner;
