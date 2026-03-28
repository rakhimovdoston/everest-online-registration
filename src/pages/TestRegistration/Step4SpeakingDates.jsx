import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircleIcon as CheckCircleSolidIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { CalendarIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { testSessionApi, branchApi } from '../../services/api';
import Button from '../../components/ui/Button';

const Step4SpeakingDates = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [registrationData, setRegistrationData] = useState(null);
  const [speakingType] = useState('FACE_TO_FACE');
  const [selectedSpeakingDates, setSelectedSpeakingDates] = useState([]);

  // Speaker state
  const [speakers, setSpeakers] = useState([]);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const [isLoadingSpeakers, setIsLoadingSpeakers] = useState(false);
  const speakerSectionRef = useRef(null);

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSessions, setAvailableSessions] = useState([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  // Which speaking slot we are filling (0-based index)
  const [activeSlotIndex, setActiveSlotIndex] = useState(0);

  // Check and load registration data + fetch speakers immediately
  useEffect(() => {
    const savedData = localStorage.getItem('testRegistration');
    if (!savedData) {
      navigate('/test-registration');
      return;
    }
    const data = JSON.parse(savedData);
    if (!data.personalInfo || !data.testDates) {
      navigate('/test-registration/details');
      return;
    }
    setRegistrationData(data);

    // Scroll to speaker section on page load
    setTimeout(() => {
      speakerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    // Load previously selected data if any
    if (data.speakingDates) {
      setSelectedSpeakingDates(data.speakingDates);
    }

    // Fetch speakers right away using branch from loaded data
    if (data.branch?.id) {
      setIsLoadingSpeakers(true);
      branchApi.getSpeakers(data.branch.id)
        .then((response) => {
          const list = response.data || response || [];
          const speakerList = Array.isArray(list) ? list : [];
          setSpeakers(speakerList);
          if (speakerList.length > 0) {
            setSelectedSpeaker(speakerList[0]);
          }
        })
        .catch((error) => {
          console.error('Error fetching speakers:', error);
          setSpeakers([]);
        })
        .finally(() => {
          setIsLoadingSpeakers(false);
        });
    }
  }, [navigate]);

  // Fetch available speaking sessions when date, type & speaker are selected
  useEffect(() => {
    if (!selectedDate || !registrationData?.branch?.id || !speakingType) return;

    setIsLoadingSessions(true);
    setAvailableSessions([]);

    const dateStr = (() => {
      const y = selectedDate.getFullYear();
      const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const d = String(selectedDate.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    })();

    testSessionApi.getSpeakingAvailable(dateStr, registrationData.branch.id, speakingType, selectedSpeaker?.id || undefined)
      .then((response) => {
        const sessions = response.data || response || [];
        setAvailableSessions(Array.isArray(sessions) ? sessions : []);
      })
      .catch((error) => {
        console.error('Error fetching speaking sessions:', error);
        setAvailableSessions([]);
      })
      .finally(() => {
        setIsLoadingSessions(false);
      });
  }, [selectedDate, registrationData?.branch?.id, speakingType, selectedSpeaker?.id]);

  // Calendar helpers
  const formatDateISO = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1; // Monday = 0
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
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return checkDate < today;
  };

  const isSelectedDate = (day) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isAlreadyPicked = (day) => {
    const dateStr = formatDateISO(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    return selectedSpeakingDates.some(s => s && s.date === dateStr);
  };

  const handleDayClick = (day) => {
    if (isPast(day)) return;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(date);
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

  const months = t('common.months', { returnObjects: true });
  const monthName = `${months[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;
  const weekDays = t('common.weekDaysShort', { returnObjects: true });

  // Select a session for the active slot
  const handleSelectSession = (session) => {
    // Check duplicate
    const isDuplicate = selectedSpeakingDates.some(
      (s, i) => s && s.id === session.id && i !== activeSlotIndex
    );
    if (isDuplicate) {
      alert(t('testRegistration.alerts.dateAlreadySelected'));
      return;
    }

    const newDates = [...selectedSpeakingDates];
    newDates[activeSlotIndex] = session;
    setSelectedSpeakingDates(newDates);

    // Auto-advance to next empty slot
    const totalSlots = registrationData?.package?.speakingSessions || 0;
    for (let i = activeSlotIndex + 1; i < totalSlots; i++) {
      if (!newDates[i]) {
        setActiveSlotIndex(i);
        setSelectedDate(null);
        setAvailableSessions([]);
        return;
      }
    }
  };

  // Remove a selected speaking date
  const handleRemoveDate = (index) => {
    const newDates = [...selectedSpeakingDates];
    newDates[index] = null;
    setSelectedSpeakingDates(newDates);
    setActiveSlotIndex(index);
    setSelectedDate(null);
    setAvailableSessions([]);
  };

  const handleSpeakerChange = (speaker) => {
    setSelectedSpeaker(speaker);
    // Reset sessions when speaker changes
    setSelectedDate(null);
    setAvailableSessions([]);
  };

  const handleBack = () => {
    navigate('/test-registration/details');
  };

  const handleEditPackage = () => {
    navigate('/test-registration');
  };

  const handleEditBranch = () => {
    navigate('/test-registration/branch');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredSpeakingDates = registrationData?.package?.speakingSessions || 0;
    const validSelectedDates = selectedSpeakingDates.filter(d => d && d.id);

    if (validSelectedDates.length !== requiredSpeakingDates) {
      alert(t('testRegistration.alerts.selectSpeakingDates', { count: requiredSpeakingDates }));
      return;
    }

    const updatedData = {
      ...registrationData,
      speakingType,
      speakingDates: validSelectedDates
    };

    localStorage.setItem('testRegistration', JSON.stringify(updatedData));
    navigate('/test-registration/review');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const monthsShort = t('common.monthsShort', { returnObjects: true });
    const weekDaysArr = t('common.weekDaysShort', { returnObjects: true });
    const dayOfWeek = date.getDay();
    const weekDay = weekDaysArr[dayOfWeek === 0 ? 6 : dayOfWeek - 1];
    return `${weekDay}, ${date.getDate()} ${monthsShort[date.getMonth()]}`;
  };

  const totalSpeakingDates = registrationData?.package?.speakingSessions || 0;

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white">
                <CheckCircleSolidIcon className="w-6 h-6" />
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">{t('testRegistration.progress.package')}</span>
            </div>
            <div className="w-12 h-0.5 bg-green-600" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white">
                <CheckCircleSolidIcon className="w-6 h-6" />
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">{t('testRegistration.progress.branch')}</span>
            </div>
            <div className="w-12 h-0.5 bg-green-600" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white">
                <CheckCircleSolidIcon className="w-6 h-6" />
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">{t('testRegistration.progress.test')}</span>
            </div>
            <div className="w-12 h-0.5 bg-indigo-600" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-semibold">
                4
              </div>
              <span className="ml-2 text-sm font-medium text-indigo-600">{t('testRegistration.progress.speaking')}</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">
            {t('testRegistration.step4Extended.title')}
          </h1>
          <p className="text-slate-600">
            {t('testRegistration.step4Extended.subtitle')}
          </p>
        </motion.div>

        {/* Summary Cards with Edit */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">{t('testRegistration.common.selectedPackage')}</p>
              <button
                onClick={handleEditPackage}
                className="text-indigo-600 hover:text-indigo-700 transition-colors"
                title={t('testRegistration.common.changePackage')}
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            </div>
            <p className="text-lg font-bold text-slate-900">
              {registrationData?.package?.name}
            </p>
            <p className="text-sm text-slate-600">
              {totalSpeakingDates} {t('testRegistration.common.speakingSessions')}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">{t('testRegistration.common.branch')}</p>
              <button
                onClick={handleEditBranch}
                className="text-indigo-600 hover:text-indigo-700 transition-colors"
                title={t('testRegistration.common.changeBranch')}
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            </div>
            <p className="text-lg font-bold text-slate-900">
              {registrationData?.branch?.name}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Speaker Selection */}
          <motion.div
              ref={speakerSectionRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 mb-6"
            >
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-2">
                  {t('testRegistration.step4Extended.selectSpeaker')}
                </h2>
                <p className="text-sm text-slate-600">
                  {t('testRegistration.step4Extended.selectSpeakerDesc')}
                </p>
              </div>

              {isLoadingSpeakers ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="text-slate-600 mt-2">{t('common.loading')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {speakers.map((speaker, index) => (
                    <button
                      key={speaker.id}
                      type="button"
                      onClick={() => handleSpeakerChange(speaker)}
                      className={`p-4 rounded-xl border-2 transition-all text-center ${
                        selectedSpeaker?.id === speaker.id
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                        selectedSpeaker?.id === speaker.id ? 'bg-indigo-600' : 'bg-slate-200'
                      }`}>
                        <span className={`text-sm font-bold ${selectedSpeaker?.id === speaker.id ? 'text-white' : 'text-slate-600'}`}>
                          {index + 1}
                        </span>
                      </div>
                      <p className={`text-sm font-medium ${selectedSpeaker?.id === speaker.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                        Speaker {index + 1}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

          {/* Speaking Dates Selection with Calendar */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 mb-6"
            >
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-2">
                  {t('testRegistration.step4Extended.speakingDatesTitle')}
                </h2>
                <p className="text-sm text-slate-600">
                  {totalSpeakingDates} {t('testRegistration.step4Extended.speakingDatesNeeded')}
                </p>
              </div>

              {/* Selected Slots */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                {Array.from({ length: totalSpeakingDates }).map((_, index) => {
                  const session = selectedSpeakingDates[index];
                  const isActive = index === activeSlotIndex;

                  return (
                    <div
                      key={index}
                      onClick={() => {
                        setActiveSlotIndex(index);
                        if (!session) {
                          setSelectedDate(null);
                          setAvailableSessions([]);
                        }
                      }}
                      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        session
                          ? 'border-green-300 bg-green-50'
                          : isActive
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-slate-500">
                          {t('testRegistration.step4Extended.speakingDate')} {index + 1}
                        </span>
                        {session && (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleRemoveDate(index); }}
                            className="text-red-400 hover:text-red-600 transition-colors"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {session ? (
                        <div>
                          <p className="text-sm font-bold text-slate-900">{formatDate(session.date)}</p>
                          <p className="text-xs text-slate-600">
                            {session.time}{selectedSpeaker ? ` • Speaker ${speakers.findIndex(s => s.id === selectedSpeaker.id) + 1}` : ''}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400">{t('testRegistration.common.selectDate')}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Calendar + Sessions */}
              {(!selectedSpeakingDates[activeSlotIndex] || selectedDate) && (
                <div className="grid md:grid-cols-2 gap-6">
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
                        const picked = isAlreadyPicked(day);

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
                              ${today && !selected ? 'bg-indigo-100 text-indigo-700 font-bold' : ''}
                              ${picked && !selected ? 'bg-green-100 text-green-700' : ''}
                              ${!past && !selected && !today && !picked ? 'text-slate-700' : ''}
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
                      {selectedDate
                        ? formatDate(selectedDate)
                        : t('testRegistration.common.selectDate')
                      }
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
                      <div className="space-y-2 max-h-80 overflow-y-auto">
                        {availableSessions.map((session) => {
                          const isSelected = selectedSpeakingDates.some(s => s && s.id === session.id);

                          return (
                            <button
                              key={session.id}
                              type="button"
                              onClick={() => handleSelectSession(session)}
                              disabled={isSelected}
                              className={`
                                w-full p-3 rounded-lg border-2 text-left transition-all
                                ${isSelected
                                  ? 'border-green-500 bg-green-50 cursor-not-allowed'
                                  : 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer'
                                }
                              `}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-indigo-100">
                                    <ClockIcon className="w-5 h-5 text-indigo-600" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-slate-900">
                                      {session.time}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      {selectedSpeaker ? `Speaker ${speakers.findIndex(s => s.id === selectedSpeaker.id) + 1}` : ''}{session.type ? ` • ${session.type}` : ''}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  {isSelected ? (
                                    <CheckCircleSolidIcon className="w-6 h-6 text-green-600" />
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
              )}
            </motion.div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="secondary"
              size="lg"
              type="button"
              onClick={handleBack}
            >
              {t('testRegistration.common.back')}
            </Button>
            <Button
              variant="primary"
              size="lg"
              type="submit"
            >
              {t('testRegistration.common.review')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Step4SpeakingDates;
