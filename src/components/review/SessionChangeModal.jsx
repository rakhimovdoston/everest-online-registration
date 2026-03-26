import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { CalendarIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { testSessionApi, branchApi } from '../../services/api';

const SessionChangeModal = ({ type, branchId, currentSession, allSessions = [], changingIndex, excludeIds = [], onSelect, onClose }) => {
  const { t } = useTranslation();

  // Speaker state (speaking only)
  const [speakers, setSpeakers] = useState([]);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const [isLoadingSpeakers, setIsLoadingSpeakers] = useState(false);

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (currentSession?.date) {
      const d = new Date(currentSession.date);
      return new Date(d.getFullYear(), d.getMonth(), 1);
    }
    return new Date();
  });
  const [selectedDate, setSelectedDate] = useState(() => {
    if (currentSession?.date) {
      const d = new Date(currentSession.date);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }
    return null;
  });
  const [availableSessions, setAvailableSessions] = useState([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  // Fetch speakers for speaking mode and pre-select current session's speaker
  useEffect(() => {
    if (type !== 'speaking' || !branchId) return;
    setIsLoadingSpeakers(true);
    branchApi.getSpeakers(branchId)
      .then((response) => {
        const list = response.data || response || [];
        const speakerList = Array.isArray(list) ? list : [];
        setSpeakers(speakerList);

        // Pre-select current session's speaker
        if (currentSession) {
          const currentSpeakerName = currentSession.speakerName || currentSession.speaker_name;
          const currentSpeakerId = currentSession.speakerId || currentSession.speaker_id;
          const matched = speakerList.find(s =>
            (currentSpeakerId && s.id === currentSpeakerId) ||
            (currentSpeakerName && (s.firstname === currentSpeakerName || s.name === currentSpeakerName))
          );
          if (matched) {
            setSelectedSpeaker(matched);
          }
        }
      })
      .catch(() => setSpeakers([]))
      .finally(() => setIsLoadingSpeakers(false));
  }, [type, branchId]);

  // Fetch sessions when date selected
  useEffect(() => {
    if (!selectedDate || !branchId) return;
    setIsLoadingSessions(true);
    setAvailableSessions([]);

    const dateStr = formatDateISO(selectedDate);

    const promise = type === 'test'
      ? testSessionApi.getAvailable(dateStr, branchId)
      : testSessionApi.getSpeakingAvailable(dateStr, branchId, 'FACE_TO_FACE', selectedSpeaker?.id || undefined);

    promise
      .then((response) => {
        const sessions = response.data || response || [];
        setAvailableSessions(Array.isArray(sessions) ? sessions : []);
      })
      .catch(() => setAvailableSessions([]))
      .finally(() => setIsLoadingSessions(false));
  }, [selectedDate, branchId, type, selectedSpeaker?.id]);

  // Calendar helpers
  const formatDateISO = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear();
  };

  const isPast = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day) < today;
  };

  const isSelectedDate = (day) => {
    if (!selectedDate) return false;
    return day === selectedDate.getDate() && currentMonth.getMonth() === selectedDate.getMonth() && currentMonth.getFullYear() === selectedDate.getFullYear();
  };

  const isCurrentSessionDate = (day) => {
    if (!currentSession?.date) return false;
    const d = new Date(currentSession.date);
    return day === d.getDate() && currentMonth.getMonth() === d.getMonth() && currentMonth.getFullYear() === d.getFullYear();
  };

  // Check if a day matches any of the OTHER selected sessions (not the current one being changed)
  const isOtherSelectedDate = (day) => {
    return allSessions.some((session, i) => {
      if (!session?.date || i === changingIndex) return false;
      const d = new Date(session.date);
      return day === d.getDate() && currentMonth.getMonth() === d.getMonth() && currentMonth.getFullYear() === d.getFullYear();
    });
  };

  const handleDayClick = (day) => {
    if (isPast(day)) return;
    setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    setSelectedDate(null);
    setAvailableSessions([]);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    setSelectedDate(null);
    setAvailableSessions([]);
  };

  const handleSpeakerChange = (speaker) => {
    setSelectedSpeaker(speaker);
    setSelectedDate(null);
    setAvailableSessions([]);
  };

  const handleSelectSession = (session) => {
    if (type === 'test' && session.existedSpace <= 0) return;
    onSelect(session);
  };

  const months = t('common.months', { returnObjects: true });
  const monthName = `${months[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;
  const weekDays = t('common.weekDaysShort', { returnObjects: true });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const monthsShort = t('common.monthsShort', { returnObjects: true });
    const weekDaysArr = t('common.weekDaysShort', { returnObjects: true });
    const dayOfWeek = date.getDay();
    const weekDay = weekDaysArr[dayOfWeek === 0 ? 6 : dayOfWeek - 1];
    return `${weekDay}, ${date.getDate()} ${monthsShort[date.getMonth()]}`;
  };

  const getTimeLabel = (time) => {
    const labels = {
      morning: t('testRegistration.step3Extended.morning'),
      afternoon: t('testRegistration.step3Extended.afternoon'),
      evening: t('testRegistration.step3Extended.evening')
    };
    return labels[time] || time;
  };

  const title = type === 'test'
    ? t('testRegistration.step5.changeTestSession')
    : t('testRegistration.step5.changeSpeakingSession');

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="div" className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                  <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </Dialog.Title>

                {/* Current Session Info */}
                {currentSession && (
                  <div className="mb-5 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-green-700 font-medium mb-0.5">
                        {t('testRegistration.step5.currentSelection')}
                      </p>
                      <p className="text-sm font-semibold text-green-900 truncate">
                        {formatDate(currentSession.date)}
                        {' — '}
                        {type === 'test'
                          ? `${getTimeLabel(currentSession.time)} (${currentSession.timeString})`
                          : `${currentSession.time} • ${currentSession.speakerName || currentSession.speaker_name || ''}`
                        }
                      </p>
                    </div>
                  </div>
                )}

                {/* Speaker Grid (speaking only) */}
                {type === 'speaking' && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">
                      {t('testRegistration.step4Extended.selectSpeaker')}
                    </h4>
                    {isLoadingSpeakers ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        <button
                          type="button"
                          onClick={() => handleSpeakerChange(null)}
                          className={`p-3 rounded-xl border-2 transition-all text-center ${
                            selectedSpeaker === null
                              ? 'border-indigo-600 bg-indigo-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 ${
                            selectedSpeaker === null ? 'bg-indigo-600' : 'bg-slate-200'
                          }`}>
                            <svg className={`w-4 h-4 ${selectedSpeaker === null ? 'text-white' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <p className={`text-xs font-medium ${selectedSpeaker === null ? 'text-indigo-900' : 'text-slate-700'}`}>
                            {t('testRegistration.step4Extended.allSpeakers')}
                          </p>
                        </button>
                        {speakers.map((speaker) => (
                          <button
                            key={speaker.id}
                            type="button"
                            onClick={() => handleSpeakerChange(speaker)}
                            className={`p-3 rounded-xl border-2 transition-all text-center ${
                              selectedSpeaker?.id === speaker.id
                                ? 'border-indigo-600 bg-indigo-50'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 ${
                              selectedSpeaker?.id === speaker.id ? 'bg-indigo-600' : 'bg-slate-200'
                            }`}>
                              <span className={`text-xs font-bold ${selectedSpeaker?.id === speaker.id ? 'text-white' : 'text-slate-600'}`}>
                                {(speaker.firstname || speaker.name || '?')[0].toUpperCase()}
                              </span>
                            </div>
                            <p className={`text-xs font-medium ${selectedSpeaker?.id === speaker.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                              {speaker.firstname || speaker.name || `Speaker #${speaker.id}`}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Calendar + Sessions */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Calendar */}
                  <div className="border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <button type="button" onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                        <ChevronLeftIcon className="w-5 h-5 text-slate-600" />
                      </button>
                      <h3 className="text-sm font-semibold text-slate-900 capitalize">{monthName}</h3>
                      <button type="button" onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                        <ChevronRightIcon className="w-5 h-5 text-slate-600" />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {weekDays.map(day => (
                        <div key={day} className="text-center text-xs font-medium text-slate-500 py-1">
                          {day}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, i) => (
                        <div key={`empty-${i}`} />
                      ))}
                      {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, i) => {
                        const day = i + 1;
                        const past = isPast(day);
                        const selected = isSelectedDate(day);
                        const today = isToday(day);
                        const currentDate = isCurrentSessionDate(day);
                        const otherDate = isOtherSelectedDate(day);

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
                              ${currentDate && !selected ? 'bg-green-100 text-green-700 font-bold ring-2 ring-green-400' : ''}
                              ${otherDate && !selected && !currentDate ? 'bg-amber-100 text-amber-700 font-bold ring-2 ring-amber-300' : ''}
                              ${today && !selected && !currentDate && !otherDate ? 'bg-indigo-100 text-indigo-700 font-bold' : ''}
                              ${!past && !selected && !today && !currentDate && !otherDate ? 'text-slate-700' : ''}
                            `}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Available Sessions */}
                  <div className="border border-slate-200 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 text-indigo-600" />
                      {selectedDate ? formatDate(selectedDate) : t('testRegistration.common.selectDate')}
                    </h3>

                    {!selectedDate ? (
                      <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                        <CalendarIcon className="w-12 h-12 mb-2" />
                        <p className="text-sm">{t('testRegistration.common.selectDate')}</p>
                      </div>
                    ) : isLoadingSessions ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <svg className="animate-spin h-8 w-8 text-indigo-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <p className="text-sm text-slate-600">{t('common.loading')}</p>
                      </div>
                    ) : availableSessions.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                        <XMarkIcon className="w-12 h-12 mb-2" />
                        <p className="text-sm">{t('common.noSessions')}</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {availableSessions.map((session) => {
                          const isExcluded = excludeIds.includes(session.id);
                          const isCurrent = currentSession?.id === session.id;
                          const isFull = type === 'test' && session.existedSpace <= 0;
                          const isDisabled = isExcluded || isFull;

                          return (
                            <button
                              key={session.id}
                              type="button"
                              onClick={() => handleSelectSession(session)}
                              disabled={isDisabled}
                              className={`
                                w-full p-3 rounded-lg border-2 text-left transition-all
                                ${isCurrent
                                  ? 'border-green-500 bg-green-50'
                                  : isDisabled
                                  ? 'border-slate-200 bg-slate-100 cursor-not-allowed opacity-60'
                                  : 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer'
                                }
                              `}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                    isDisabled ? 'bg-slate-200' : 'bg-indigo-100'
                                  }`}>
                                    <ClockIcon className={`w-5 h-5 ${isDisabled ? 'text-slate-400' : 'text-indigo-600'}`} />
                                  </div>
                                  <div>
                                    {type === 'test' ? (
                                      <>
                                        <p className="text-sm font-semibold text-slate-900">{getTimeLabel(session.time)}</p>
                                        <p className="text-xs text-slate-500">{session.timeString}</p>
                                      </>
                                    ) : (
                                      <>
                                        <p className="text-sm font-semibold text-slate-900">{session.time}</p>
                                        <p className="text-xs text-slate-500">
                                          {session.speakerName || session.speaker_name || ''} • {session.type}
                                        </p>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  {isCurrent ? (
                                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                                  ) : isFull ? (
                                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-700">
                                      {t('common.full')}
                                    </span>
                                  ) : isExcluded ? (
                                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-500">
                                      {t('testRegistration.alerts.dateAlreadySelected')}
                                    </span>
                                  ) : type === 'test' ? (
                                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
                                      {session.existedSpace} {t('testRegistration.common.available')}
                                    </span>
                                  ) : (
                                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
                                      {t('testRegistration.common.available')}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SessionChangeModal;
