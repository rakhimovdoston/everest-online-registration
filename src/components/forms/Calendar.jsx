import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// Lightweight month calendar. Past days are disabled.
// Reusable across registration steps.
//
// Props:
//   selectedDate     Date | null   currently selected day
//   onSelectDate     (date: Date) => void
//   highlightedDates string[]      ISO "YYYY-MM-DD" days to mark (e.g. other chosen slots)
//   initialMonth     Date          month to show first (defaults to selectedDate or today)
const formatDateISO = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const Calendar = ({ selectedDate, onSelectDate, highlightedDates = [], initialMonth }) => {
  const { t } = useTranslation();

  const [currentMonth, setCurrentMonth] = useState(() => {
    const base = selectedDate || initialMonth || new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const months = t('common.months', { returnObjects: true });
  const weekDays = t('common.weekDaysShort', { returnObjects: true });
  const monthName = `${months[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  // Monday-first offset (Mon = 0 ... Sun = 6)
  const getFirstDayOffset = (date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isPast = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day) < today;
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isHighlighted = (day) => {
    const iso = formatDateISO(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    return highlightedDates.includes(iso);
  };

  const prevMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const handleDayClick = (day) => {
    if (isPast(day)) return;
    onSelectDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
  };

  return (
    <div className="border border-slate-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeftIcon className="w-5 h-5 text-slate-600" />
        </button>
        <h3 className="text-sm font-semibold text-slate-900 capitalize">{monthName}</h3>
        <button
          type="button"
          onClick={nextMonth}
          className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <ChevronRightIcon className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-slate-500 py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: getFirstDayOffset(currentMonth) }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, i) => {
          const day = i + 1;
          const past = isPast(day);
          const selected = isSelected(day);
          const today = isToday(day);
          const highlighted = isHighlighted(day);

          return (
            <button
              key={day}
              type="button"
              onClick={() => handleDayClick(day)}
              disabled={past}
              className={`
                aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all
                ${past ? 'text-slate-300 cursor-not-allowed' : 'hover:bg-indigo-50 cursor-pointer'}
                ${selected ? 'bg-indigo-600 text-white hover:bg-indigo-700' : ''}
                ${highlighted && !selected ? 'bg-green-100 text-green-700' : ''}
                ${today && !selected && !highlighted ? 'bg-indigo-100 text-indigo-700 font-bold' : ''}
                ${!past && !selected && !today && !highlighted ? 'text-slate-700' : ''}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
