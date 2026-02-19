import { useState, useEffect, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircleIcon as CheckCircleSolidIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { CalendarIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { usePackages } from '../../contexts/PackageContext';
import { testSessionApi } from '../../services/api';
import FormInput from '../../components/forms/FormInput';
import Button from '../../components/ui/Button';

const detailsSchema = z.object({
  firstName: z.string().min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak"),
  lastName: z.string().min(2, "Familiya kamida 2 ta belgidan iborat bo'lishi kerak"),
  phone: z.string().regex(/^[\+]?[0-9]{9,13}$/, "Telefon raqami noto'g'ri"),
  email: z.string().email("Email noto'g'ri").optional().or(z.literal('')),
});

const Step3Details = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { activePackages, activeBranches } = usePackages();
  const [registrationData, setRegistrationData] = useState(null);
  const [selectedTestDates, setSelectedTestDates] = useState([]);

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSessions, setAvailableSessions] = useState([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  // Which test slot we are filling (0-based index)
  const [activeSlotIndex, setActiveSlotIndex] = useState(0);

  // Modals
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(detailsSchema),
    mode: 'onBlur',
  });

  // Check authentication and load registration data
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?returnUrl=${encodeURIComponent(location.pathname)}`);
      return;
    }

    const savedData = localStorage.getItem('testRegistration');
    if (!savedData) {
      navigate('/test-registration');
      return;
    }
    const data = JSON.parse(savedData);
    if (!data.branch) {
      navigate('/test-registration/branch');
      return;
    }
    setRegistrationData(data);

    // Load previously selected test dates if any
    if (data.testDates) {
      setSelectedTestDates(data.testDates);
    }
  }, [isAuthenticated, navigate, location.pathname]);

  // Auto-fill form if registrationType is 'myself'
  useEffect(() => {
    if (registrationData?.registrationType === 'myself' && isAuthenticated && user) {
      if (user.firstName) setValue('firstName', user.firstName, { shouldValidate: false });
      if (user.lastName) setValue('lastName', user.lastName, { shouldValidate: false });
      if (user.email) setValue('email', user.email, { shouldValidate: false });
      if (user.phone) setValue('phone', user.phone, { shouldValidate: false });
    }
  }, [registrationData, isAuthenticated, user, setValue]);

  // Fetch available sessions when a date is selected
  useEffect(() => {
    if (selectedDate && registrationData?.branch?.id) {
      fetchSessions(selectedDate, registrationData.branch.id);
    }
  }, [selectedDate, registrationData?.branch?.id]);

  const fetchSessions = async (date, branchId) => {
    setIsLoadingSessions(true);
    setAvailableSessions([]);
    try {
      const dateStr = formatDateISO(date);
      const response = await testSessionApi.getAvailable(dateStr, branchId);
      const sessions = response.data || response || [];
      setAvailableSessions(Array.isArray(sessions) ? sessions : []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setAvailableSessions([]);
    } finally {
      setIsLoadingSessions(false);
    }
  };

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
    return selectedTestDates.some(s => s && s.date === dateStr);
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
    if (session.existedSpace <= 0) return;

    // Check duplicate
    const isDuplicate = selectedTestDates.some(
      (s, i) => s && s.id === session.id && i !== activeSlotIndex
    );
    if (isDuplicate) {
      alert(t('testRegistration.alerts.dateAlreadySelected'));
      return;
    }

    const newDates = [...selectedTestDates];
    newDates[activeSlotIndex] = session;
    setSelectedTestDates(newDates);

    // Auto-advance to next empty slot
    const totalSlots = registrationData?.package?.totalSessions || 0;
    for (let i = activeSlotIndex + 1; i < totalSlots; i++) {
      if (!newDates[i]) {
        setActiveSlotIndex(i);
        setSelectedDate(null);
        setAvailableSessions([]);
        return;
      }
    }
    // If all filled, stay
  };

  // Remove a selected test date
  const handleRemoveDate = (index) => {
    const newDates = [...selectedTestDates];
    newDates[index] = null;
    setSelectedTestDates(newDates);
    setActiveSlotIndex(index);
    setSelectedDate(null);
    setAvailableSessions([]);
  };

  const handlePackageChange = (newPackage) => {
    const newTotalSessions = newPackage.totalSessions;
    let updatedTestDates = [...selectedTestDates].slice(0, newTotalSessions);

    const updatedData = {
      ...registrationData,
      package: newPackage,
      testDates: updatedTestDates.filter(d => d)
    };

    setRegistrationData(updatedData);
    setSelectedTestDates(updatedTestDates);
    setActiveSlotIndex(0);
    localStorage.setItem('testRegistration', JSON.stringify(updatedData));
    setIsPackageModalOpen(false);
  };

  const handleBranchChange = (newBranch) => {
    const updatedData = {
      ...registrationData,
      branch: newBranch,
      testDates: [],
      speakingDates: [],
      speakingType: ''
    };

    setRegistrationData(updatedData);
    setSelectedTestDates([]);
    setActiveSlotIndex(0);
    setSelectedDate(null);
    setAvailableSessions([]);
    localStorage.setItem('testRegistration', JSON.stringify(updatedData));
    setIsBranchModalOpen(false);
  };

  const handleBack = () => {
    navigate('/test-registration/branch');
  };

  const onSubmit = (formData) => {
    const requiredTestDates = registrationData?.package?.totalSessions || 0;
    const validSelectedDates = selectedTestDates.filter(d => d && d.id);

    if (validSelectedDates.length !== requiredTestDates) {
      alert(t('testRegistration.alerts.selectTestDates', { count: requiredTestDates }));
      return;
    }

    const updatedData = {
      ...registrationData,
      personalInfo: formData,
      testDates: validSelectedDates
    };

    localStorage.setItem('testRegistration', JSON.stringify(updatedData));
    navigate('/test-registration/speaking');
  };

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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' UZS';
  };

  const totalTestDates = registrationData?.package?.totalSessions || 0;

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white">
                <CheckCircleSolidIcon className="w-6 h-6" />
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">{t('testRegistration.progress.package')}</span>
            </div>
            <div className="w-16 h-0.5 bg-green-600" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white">
                <CheckCircleSolidIcon className="w-6 h-6" />
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">{t('testRegistration.progress.branch')}</span>
            </div>
            <div className="w-16 h-0.5 bg-indigo-600" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-semibold">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-indigo-600">{t('testRegistration.progress.testDates')}</span>
            </div>
            <div className="w-16 h-0.5 bg-slate-300" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-300 text-slate-600 font-semibold">
                4
              </div>
              <span className="ml-2 text-sm font-medium text-slate-400">{t('testRegistration.progress.speaking')}</span>
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
            {t('testRegistration.step3Extended.title')}
          </h1>
          <p className="text-slate-600">
            {t('testRegistration.step3Extended.subtitle')}
          </p>
        </motion.div>

        {/* Summary Cards with Edit */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">{t('testRegistration.common.selectedPackage')}</p>
              <button
                onClick={() => setIsPackageModalOpen(true)}
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
              {totalTestDates} {t('testRegistration.common.testSessions')}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">{t('testRegistration.common.branch')}</p>
              <button
                onClick={() => setIsBranchModalOpen(true)}
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

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 mb-6"
          >
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              {t('testRegistration.step3Extended.personalInfo')}
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <FormInput
                label={t('testRegistration.step3Extended.firstName')}
                name="firstName"
                type="text"
                placeholder="Ismingizni kiriting"
                register={register}
                error={errors.firstName}
                required
              />
              <FormInput
                label={t('testRegistration.step3Extended.lastName')}
                name="lastName"
                type="text"
                placeholder="Familiyangizni kiriting"
                register={register}
                error={errors.lastName}
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <FormInput
                label={t('testRegistration.step3Extended.phone')}
                name="phone"
                type="tel"
                placeholder="+998901234567"
                register={register}
                error={errors.phone}
                required
              />
              <FormInput
                label={t('testRegistration.step3Extended.emailOptional')}
                name="email"
                type="email"
                placeholder="email@example.com"
                register={register}
                error={errors.email}
              />
            </div>
          </motion.div>

          {/* Test Dates Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 mb-6"
          >
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">
                {t('testRegistration.step3Extended.testDatesTitle')}
              </h2>
              <p className="text-sm text-slate-600">
                {totalTestDates} {t('testRegistration.step3Extended.testDatesNeeded')}
              </p>
            </div>

            {/* Selected Slots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {Array.from({ length: totalTestDates }).map((_, index) => {
                const session = selectedTestDates[index];
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
                        {t('testRegistration.step3Extended.testDate')} {index + 1}
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
                          {getTimeLabel(session.time)} ({session.timeString})
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400">{t('testRegistration.common.selectDate')}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Calendar + Sessions - only show when we have an empty slot to fill */}
            {(!selectedTestDates[activeSlotIndex] || selectedDate) && (
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
                    {/* Empty cells before first day */}
                    {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {/* Day cells */}
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
                    <div className="space-y-2">
                      {availableSessions.map((session) => {
                        const isFull = session.existedSpace <= 0;
                        const isSelected = selectedTestDates.some(s => s && s.id === session.id);

                        return (
                          <button
                            key={session.id}
                            type="button"
                            onClick={() => handleSelectSession(session)}
                            disabled={isFull || isSelected}
                            className={`
                              w-full p-3 rounded-lg border-2 text-left transition-all
                              ${isSelected
                                ? 'border-green-500 bg-green-50 cursor-not-allowed'
                                : isFull
                                ? 'border-slate-200 bg-slate-100 cursor-not-allowed opacity-60'
                                : 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer'
                              }
                            `}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  isFull ? 'bg-slate-200' : 'bg-indigo-100'
                                }`}>
                                  <ClockIcon className={`w-5 h-5 ${isFull ? 'text-slate-400' : 'text-indigo-600'}`} />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-slate-900">
                                    {getTimeLabel(session.time)}
                                  </p>
                                  <p className="text-xs text-slate-500">{session.timeString}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                {isSelected ? (
                                  <CheckCircleSolidIcon className="w-6 h-6 text-green-600" />
                                ) : (
                                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                    isFull
                                      ? 'bg-red-100 text-red-700'
                                      : 'bg-green-100 text-green-700'
                                  }`}>
                                    {isFull ? t('common.full') : `${session.existedSpace} ${t('testRegistration.common.available')}`}
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
              {t('testRegistration.common.next')}
            </Button>
          </div>
        </form>
      </div>

      {/* Package Modal */}
      <Transition appear show={isPackageModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsPackageModalOpen(false)}>
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
            <div className="flex min-h-full items-center justify-center p-4 text-center">
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
                    <h3 className="text-lg font-semibold text-slate-900">
                      {t('testRegistration.common.changePackage')}
                    </h3>
                    <button
                      onClick={() => setIsPackageModalOpen(false)}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </Dialog.Title>

                  <div className="space-y-3">
                    {activePackages.map((pkg) => (
                      <button
                        key={pkg.id}
                        onClick={() => handlePackageChange(pkg)}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          registrationData?.package?.id === pkg.id
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-bold text-lg text-slate-900">{pkg.name}</p>
                            <p className="text-sm text-slate-600">
                              {pkg.totalSessions} {t('testRegistration.common.test')} • {pkg.speakingSessions} {t('testRegistration.common.speaking')}
                            </p>
                          </div>
                          <p className="text-xl font-bold text-indigo-600">
                            {formatPrice(pkg.price)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Branch Modal */}
      <Transition appear show={isBranchModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsBranchModalOpen(false)}>
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
            <div className="flex min-h-full items-center justify-center p-4 text-center">
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
                    <h3 className="text-lg font-semibold text-slate-900">
                      {t('testRegistration.common.changeBranch')}
                    </h3>
                    <button
                      onClick={() => setIsBranchModalOpen(false)}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </Dialog.Title>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-yellow-800">
                      <strong>{t('testRegistration.common.warning')}</strong> {t('testRegistration.common.branchWarning')}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {activeBranches.map((branch) => (
                      <button
                        key={branch.id}
                        onClick={() => handleBranchChange(branch)}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          registrationData?.branch?.id === branch.id
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <p className="font-bold text-lg text-slate-900">{branch.name}</p>
                        <p className="text-sm text-slate-600">
                          {branch.location} • {branch.maxStudents} {t('testRegistration.common.seats')}
                        </p>
                      </button>
                    ))}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Step3Details;
