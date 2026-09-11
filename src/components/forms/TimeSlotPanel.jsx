import { useTranslation } from 'react-i18next';
import { ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';

// Shows the available time slots for a selected date as chips.
//
// Props:
//   selectedDate    Date | null
//   slots           Array<{ id, time, ... }>  available slots for the date
//   isLoading       boolean
//   error           boolean         day unavailable / fetch failed — prompt to pick another day
//   selectedSlotId  number | null   currently chosen slot id
//   disabledIds     number[]        slot ids chosen in other slots (disabled here)
//   onSelectSlot    (slot) => void
const TimeSlotPanel = ({
  selectedDate,
  slots = [],
  isLoading = false,
  error = null,
  selectedSlotId = null,
  disabledIds = [],
  onSelectSlot,
}) => {
  const { t } = useTranslation();

  // Times come ONLY from the API — sort ascending, never generate a grid.
  const sortedSlots = [...slots].sort((a, b) => String(a.time).localeCompare(String(b.time)));

  const renderBody = () => {
    if (!selectedDate) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-slate-400">
          <CalendarIcon className="w-12 h-12 mb-2" />
          <p className="text-sm">{t('testRegistration.common.selectDate')}</p>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-11 rounded-lg bg-slate-100 animate-pulse" />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-slate-400 text-center">
          <CalendarIcon className="w-12 h-12 mb-2" />
          <p className="text-sm">{t('testRegistration.step4Extended.unavailableDay')}</p>
        </div>
      );
    }

    if (sortedSlots.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-slate-400">
          <ClockIcon className="w-12 h-12 mb-2" />
          <p className="text-sm">{t('testRegistration.step4Extended.noSlots')}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-3 gap-2 max-h-72 overflow-y-auto">
        {sortedSlots.map((slot) => {
          const isSelected = selectedSlotId === slot.id;
          const isDisabled = !isSelected && disabledIds.includes(slot.id);

          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => !isDisabled && onSelectSlot(slot)}
              disabled={isDisabled}
              className={`
                py-2.5 rounded-lg border-2 text-sm font-semibold text-center transition-all
                ${isSelected
                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                  : isDisabled
                  ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'border-slate-200 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer'
                }
              `}
            >
              {slot.time}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="border border-slate-200 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
        <ClockIcon className="w-4 h-4 text-indigo-600" />
        {t('testRegistration.step4Extended.selectTime')}
      </h3>
      {renderBody()}
    </div>
  );
};

export default TimeSlotPanel;
