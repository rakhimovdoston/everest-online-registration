import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PencilIcon, XMarkIcon } from '@heroicons/react/24/solid';
import Button from '../../components/ui/Button';
import StepProgress from '../../components/registration/StepProgress';
import SpeakingSlotPicker from '../../components/registration/SpeakingSlotPicker';
import { loadRegistration } from '../../utils/registrationStorage';

const SPEAKING_TYPE = 'FACE_TO_FACE';

const Step4SpeakingDates = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  // Load registration data + restore any previously chosen speaking dates
  const [registrationData, setRegistrationData] = useState(loadRegistration);
  const [selectedSpeakingDates, setSelectedSpeakingDates] = useState(() =>
    Array.isArray(registrationData?.speakingDates) ? registrationData.speakingDates : []
  );
  // Point the active slot at the first empty position
  const [activeSlotIndex, setActiveSlotIndex] = useState(() => {
    const dates = registrationData?.speakingDates;
    if (!Array.isArray(dates)) return 0;
    const totalSlots = registrationData.package?.speakingSessions || 0;
    const firstEmpty = dates.findIndex((d) => !d);
    if (firstEmpty !== -1) return firstEmpty;
    return dates.length < totalSlots ? dates.length : 0;
  });

  useEffect(() => {
    if (!registrationData) {
      navigate('/test-registration');
    } else if (!registrationData.personalInfo || !registrationData.testDates) {
      navigate('/test-registration/details');
    }
  }, [registrationData, navigate]);

  const totalSpeakingDates = registrationData?.package?.speakingSessions || 0;

  const persist = (newDates) => {
    const updatedData = {
      ...registrationData,
      speakingType: SPEAKING_TYPE,
      speakingDates: newDates,
    };
    setRegistrationData(updatedData);
    localStorage.setItem('testRegistration', JSON.stringify(updatedData));
  };

  // Picker reports the chosen slot (or null when the date changed and the time reset)
  const handleSlotChange = (slot) => {
    const newDates = [...selectedSpeakingDates];
    newDates[activeSlotIndex] = slot || null;
    setSelectedSpeakingDates(newDates);
    persist(newDates);

    if (slot) {
      // Auto-advance to the next empty slot, if any
      for (let i = activeSlotIndex + 1; i < totalSpeakingDates; i++) {
        if (!newDates[i]) {
          setActiveSlotIndex(i);
          return;
        }
      }
    }
  };

  const handleRemoveDate = (index) => {
    const newDates = [...selectedSpeakingDates];
    newDates[index] = null;
    setSelectedSpeakingDates(newDates);
    persist(newDates);
    setActiveSlotIndex(index);
  };

  const handleBack = () => navigate('/test-registration/details');
  const handleEditPackage = () => navigate('/test-registration');
  const handleEditBranch = () => navigate('/test-registration/branch');

  const handleSubmit = (e) => {
    e.preventDefault();
    const validSelectedDates = selectedSpeakingDates.filter((d) => d && d.id);

    if (validSelectedDates.length !== totalSpeakingDates) {
      alert(t('testRegistration.alerts.selectSpeakingDates', { count: totalSpeakingDates }));
      return;
    }

    const updatedData = {
      ...registrationData,
      speakingType: SPEAKING_TYPE,
      speakingDates: validSelectedDates,
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

  // Slot ids / dates chosen in OTHER slots — used to disable / highlight in the picker
  const excludeIds = selectedSpeakingDates
    .filter((d, i) => d && d.id && i !== activeSlotIndex)
    .map((d) => d.id);
  const pickedDates = selectedSpeakingDates
    .filter((d, i) => d && d.date && i !== activeSlotIndex)
    .map((d) => d.date);

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <StepProgress current={4} />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-2">
            {t('testRegistration.step4Extended.title')}
          </h1>
          <p className="text-slate-600">{t('testRegistration.step4Extended.subtitle')}</p>
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
            <p className="text-lg font-bold text-slate-900">{registrationData?.package?.name}</p>
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
            <p className="text-lg font-bold text-slate-900">{registrationData?.branch?.name}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Speaking Date & Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-5 sm:p-8 border border-slate-200 mb-6"
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
                    onClick={() => setActiveSlotIndex(index)}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveDate(index);
                          }}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    {session ? (
                      <div>
                        <p className="text-sm font-bold text-slate-900">{formatDate(session.date)}</p>
                        <p className="text-xs text-slate-600">{session.time}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400">{t('testRegistration.common.selectDate')}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Date + Time picker for the active slot */}
            {registrationData?.branch?.id && (
              <SpeakingSlotPicker
                key={activeSlotIndex}
                branchId={registrationData.branch.id}
                value={selectedSpeakingDates[activeSlotIndex] || null}
                excludeIds={excludeIds}
                pickedDates={pickedDates}
                autoSelect
                onChange={handleSlotChange}
              />
            )}
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-between items-center gap-3">
            <Button variant="secondary" size="lg" type="button" onClick={handleBack}>
              {t('testRegistration.common.back')}
            </Button>
            <Button variant="primary" size="lg" type="submit">
              {t('testRegistration.common.review')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Step4SpeakingDates;
