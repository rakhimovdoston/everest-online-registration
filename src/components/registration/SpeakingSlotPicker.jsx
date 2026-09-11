import { useState, useEffect, useCallback } from 'react';
import { testSessionApi } from '../../services/api';
import Calendar from '../forms/Calendar';
import TimeSlotPanel from '../forms/TimeSlotPanel';

const SPEAKING_TYPE = 'FACE_TO_FACE';

const formatDateISO = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Selection-only picker for ONE face-to-face Speaking slot.
// Owns the per-date fetch and the date/time selection; reports the chosen
// slot upward via onChange. Does NOT submit/book — final submit lives in the wizard.
// No examiner/speaker selection: speakerId is carried silently from each slot.
//
// Props:
//   branchId      number              branch to query slots for
//   value         slot | null         currently selected slot for this position
//   excludeIds    number[]            slot ids already chosen elsewhere (disabled)
//   pickedDates   string[]            ISO dates chosen elsewhere (highlighted)
//   autoSelect    boolean             auto-select the nearest date on mount (default true)
//   onChange      (slot | null) => void
const SpeakingSlotPicker = ({
  branchId,
  value = null,
  excludeIds = [],
  pickedDates = [],
  autoSelect = true,
  onChange,
}) => {
  const [selectedDate, setSelectedDate] = useState(() => {
    if (value?.date) {
      const d = new Date(value.date);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }
    if (autoSelect) {
      const today = new Date();
      return new Date(today.getFullYear(), today.getMonth(), today.getDate());
    }
    return null;
  });

  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSlots = useCallback(async (date, branch) => {
    if (!date || !branch) return;
    setIsLoading(true);
    setError(null);
    try {
      const dateStr = formatDateISO(date);
      // No speakerId — backend returns every available examiner's slot for the day.
      const response = await testSessionApi.getSpeakingAvailable(dateStr, branch, SPEAKING_TYPE, undefined);
      const list = response.data || response || [];
      setSlots(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Error fetching speaking slots:', err);
      setSlots([]);
      setError(err.message || 'load-error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlots(selectedDate, branchId);
  }, [selectedDate, branchId, fetchSlots]);

  // Changing the date resets the chosen time for this slot.
  const handleSelectDate = (date) => {
    setSelectedDate(date);
    if (value) onChange?.(null);
  };

  const handleSelectSlot = (slot) => {
    // Report the full slot object up — parent needs id (and speakerId) for submit.
    onChange?.(slot);
  };

  // A chip is "active" only when the committed value is on the visible date.
  const selectedSlotId =
    value && selectedDate && value.date === formatDateISO(selectedDate) ? value.id : null;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Calendar
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
        highlightedDates={pickedDates}
        initialMonth={selectedDate || new Date()}
      />
      <TimeSlotPanel
        selectedDate={selectedDate}
        slots={slots}
        isLoading={isLoading}
        error={!!error}
        selectedSlotId={selectedSlotId}
        disabledIds={excludeIds}
        onSelectSlot={handleSelectSlot}
      />
    </div>
  );
};

export default SpeakingSlotPicker;
