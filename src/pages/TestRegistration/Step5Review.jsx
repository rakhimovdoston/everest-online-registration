import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircleIcon as CheckCircleSolidIcon,
  BuildingOfficeIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  ClockIcon,
  CreditCardIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import { useTranslation } from 'react-i18next';
import { bookingApi } from '../../services/api';
import SessionChangeModal from '../../components/review/SessionChangeModal';

const Step5Review = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [registrationData, setRegistrationData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState(null);
  const [changingSession, setChangingSession] = useState(null);
  // Tracks which sessions have API errors: [{ type: 'test'|'speaking', index: number, message: string }]
  const [sessionErrors, setSessionErrors] = useState([]);

  useEffect(() => {
    const savedData = localStorage.getItem('testRegistration');
    if (!savedData) {
      navigate('/test-registration');
      return;
    }
    const data = JSON.parse(savedData);
    if (!data.personalInfo || !data.testDates || !data.speakingDates) {
      navigate('/test-registration/speaking');
      return;
    }
    setRegistrationData(data);
  }, [navigate]);

  const handleBack = () => {
    navigate('/test-registration/speaking');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    setFieldErrors(null);
    setSessionErrors([]);

    try {
      const payload = {
        packageId: registrationData.package.id,
        branchId: registrationData.branch.id,
        testSessionIds: registrationData.testDates.map(d => d.id),
        speakingSessionIds: registrationData.speakingDates.map(d => d.id),
        personalInfo: {
          firstName: registrationData.personalInfo.firstName,
          lastName: registrationData.personalInfo.lastName,
          phone: registrationData.personalInfo.phone,
          email: registrationData.personalInfo.email || '',
        },
      };

      const response = await bookingApi.save(payload);
      const bookingData = response.data || response;
      const bookingId = bookingData.bookingId;
      localStorage.removeItem('testRegistration');
      navigate(`/test-registration/payment/${bookingId}`);
    } catch (err) {
      console.error('Booking save error:', err);
      // Match error to specific session
      const matched = matchErrorToSession(err, registrationData);
      setSessionErrors(matched);
      if (matched.length > 0) {
        // Session-specific error — scroll to the error card after render
        setTimeout(() => {
          const first = matched[0];
          const el = document.getElementById(`session-${first.type}-${first.index}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      } else {
        // Generic error — show at top
        setError(err.message || t('testRegistration.step5.saveError'));
        if (err.fieldErrors) {
          setFieldErrors(err.fieldErrors);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSessionChange = (newSession) => {
    if (!changingSession || !registrationData) return;

    const updatedData = { ...registrationData };

    if (changingSession.type === 'test') {
      const newTestDates = [...updatedData.testDates];
      newTestDates[changingSession.index] = newSession;
      updatedData.testDates = newTestDates;
    } else {
      const newSpeakingDates = [...updatedData.speakingDates];
      newSpeakingDates[changingSession.index] = newSession;
      updatedData.speakingDates = newSpeakingDates;
    }

    setRegistrationData(updatedData);
    localStorage.setItem('testRegistration', JSON.stringify(updatedData));
    // Clear error for this session
    setSessionErrors(prev => prev.filter(
      e => !(e.type === changingSession.type && e.index === changingSession.index)
    ));
    setChangingSession(null);
  };

  // Parse API error and find which session(s) it refers to
  const matchErrorToSession = (err, data) => {
    if (!err || !data) return [];
    const errData = err.fieldErrors || err.data?.error;
    if (!errData || typeof errData !== 'object') return [];
    const message = err.message || '';
    const results = [];

    if (errData.sessionId) {
      // Match by sessionId
      const sid = String(errData.sessionId);
      const testIdx = data.testDates.findIndex(d => String(d.id) === sid);
      if (testIdx !== -1) {
        results.push({ type: 'test', index: testIdx, message });
      }
      const speakIdx = data.speakingDates.findIndex(d => String(d.id) === sid);
      if (speakIdx !== -1) {
        results.push({ type: 'speaking', index: speakIdx, message });
      }
    }

    if (errData.date) {
      // Match by date + time
      const testIdx = data.testDates.findIndex(d =>
        d.date === errData.date && (!errData.time || d.time === errData.time)
      );
      if (testIdx !== -1) {
        results.push({ type: 'test', index: testIdx, message });
      }
      const speakIdx = data.speakingDates.findIndex(d =>
        d.date === errData.date && (!errData.time || d.time === errData.time)
      );
      if (speakIdx !== -1) {
        results.push({ type: 'speaking', index: speakIdx, message });
      }
    }

    return results;
  };

  // Check if a specific session has an error
  const getSessionError = (type, index) => {
    return sessionErrors.find(e => e.type === type && e.index === index);
  };

  const getExcludeIds = () => {
    if (!changingSession || !registrationData) return [];
    const dates = changingSession.type === 'test'
      ? registrationData.testDates
      : registrationData.speakingDates;
    return dates
      .filter((_, i) => i !== changingSession.index)
      .map(d => d.id);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' UZS';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = t('common.months', { returnObjects: true });
    const weekDaysArr = t('common.weekDays', { returnObjects: true });
    const dayOfWeek = date.getDay();
    const weekDay = weekDaysArr[dayOfWeek === 0 ? 6 : dayOfWeek - 1];
    return `${weekDay}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  if (!registrationData && !error && !fieldErrors) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Error Message - top of page */}
        {(error || fieldErrors) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            {error && <p className="text-sm font-medium text-red-700">{error}</p>}
            {fieldErrors && (
              <ul className={`text-sm text-red-600 space-y-1 ${error ? 'mt-2' : ''}`}>
                {Object.entries(fieldErrors).map(([field, message]) => (
                  <li key={field}>• {message}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {registrationData && (<>
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
            <div className="w-12 h-0.5 bg-green-600" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white">
                <CheckCircleSolidIcon className="w-6 h-6" />
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">{t('testRegistration.progress.speaking')}</span>
            </div>
            <div className="w-12 h-0.5 bg-indigo-600" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-semibold">
                5
              </div>
              <span className="ml-2 text-sm font-medium text-indigo-600">{t('testRegistration.progress.confirm')}</span>
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
            {t('testRegistration.step5.title')}
          </h1>
          <p className="text-slate-600">
            {t('testRegistration.step5.subtitle')}
          </p>
        </motion.div>

        {/* Review Cards */}
        <div className="space-y-6 mb-8">
          {/* Package Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <CreditCardIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{t('testRegistration.step5.selectedPackage')}</h3>
                <div className="space-y-1">
                  <p className="text-slate-700">
                    <span className="font-semibold">{registrationData.package.name}</span>
                  </p>
                  <p className="text-sm text-slate-600">
                    {registrationData.package.totalSessions} {t('testRegistration.step5.sessions')} •{' '}
                    {registrationData.package.speakingSessions} {t('testRegistration.step5.speaking')}
                  </p>
                  <p className="text-2xl font-bold text-indigo-600 mt-2">
                    {formatPrice(registrationData.package.price)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Branch Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <BuildingOfficeIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{t('testRegistration.step5.branch')}</h3>
                <p className="text-slate-700 font-semibold">{registrationData.branch.name}</p>
                <p className="text-sm text-slate-600">{registrationData.branch.location}</p>
              </div>
            </div>
          </motion.div>

          {/* Personal Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-3">{t('testRegistration.step5.personalInfo')}</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-slate-500" />
                    <span className="text-slate-700">
                      {registrationData.personalInfo.firstName} {registrationData.personalInfo.lastName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="w-5 h-5 text-slate-500" />
                    <span className="text-slate-700">{registrationData.personalInfo.phone}</span>
                  </div>
                  {registrationData.personalInfo.email && (
                    <div className="flex items-center gap-2">
                      <EnvelopeIcon className="w-5 h-5 text-slate-500" />
                      <span className="text-slate-700">{registrationData.personalInfo.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Test Dates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-3">{t('testRegistration.step5.testDates')}</h3>
                <div className="space-y-2">
                  {registrationData.testDates.map((testDate, index) => {
                    const sessionErr = getSessionError('test', index);
                    return (
                      <div key={testDate.id} id={`session-test-${index}`} className={`flex items-start gap-2 p-2 rounded-lg transition-colors ${
                        sessionErr
                          ? 'bg-red-50 border border-red-300 ring-1 ring-red-200'
                          : 'bg-slate-50'
                      }`}>
                        <span className={`flex-shrink-0 w-6 h-6 text-white rounded-full flex items-center justify-center text-xs font-bold ${
                          sessionErr ? 'bg-red-500' : 'bg-indigo-600'
                        }`}>
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <p className={`font-medium ${sessionErr ? 'text-red-900' : 'text-slate-900'}`}>{formatDate(testDate.date)}</p>
                          <p className={`text-sm ${sessionErr ? 'text-red-600' : 'text-slate-600'}`}>{testDate.timeString} • {testDate.dayOfWeek}</p>
                          {sessionErr && (
                            <p className="text-xs text-red-600 font-medium mt-1">{sessionErr.message}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setChangingSession({ type: 'test', index })}
                          className={`flex-shrink-0 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg ${
                            sessionErr
                              ? 'text-red-600 hover:text-red-700 hover:bg-red-100'
                              : 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50'
                          }`}
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                          <span className="text-xs font-medium">{t('testRegistration.step5.change')}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Speaking Dates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-3">{t('testRegistration.step5.speakingDates')}</h3>
                <div className="space-y-2">
                  {registrationData.speakingDates.map((speakingDate, index) => {
                    const sessionErr = getSessionError('speaking', index);
                    return (
                      <div key={speakingDate.id} id={`session-speaking-${index}`} className={`flex items-start gap-2 p-2 rounded-lg transition-colors ${
                        sessionErr
                          ? 'bg-red-50 border border-red-300 ring-1 ring-red-200'
                          : 'bg-slate-50'
                      }`}>
                        <span className={`flex-shrink-0 w-6 h-6 text-white rounded-full flex items-center justify-center text-xs font-bold ${
                          sessionErr ? 'bg-red-500' : 'bg-green-600'
                        }`}>
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <p className={`font-medium ${sessionErr ? 'text-red-900' : 'text-slate-900'}`}>{formatDate(speakingDate.date)} - {speakingDate.time}</p>
                          <p className={`text-sm ${sessionErr ? 'text-red-600' : 'text-slate-600'}`}>{speakingDate.type}</p>
                          {sessionErr && (
                            <p className="text-xs text-red-600 font-medium mt-1">{sessionErr.message}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setChangingSession({ type: 'speaking', index })}
                          className={`flex-shrink-0 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg ${
                            sessionErr
                              ? 'text-red-600 hover:text-red-700 hover:bg-red-100'
                              : 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50'
                          }`}
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                          <span className="text-xs font-medium">{t('testRegistration.step5.change')}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="secondary"
            size="lg"
            onClick={handleBack}
            disabled={isSubmitting}
          >
            {t('testRegistration.common.back')}
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {t('testRegistration.step5.saving')}
              </span>
            ) : (
              t('testRegistration.step5.goToPayment')
            )}
          </Button>
        </div>
        </>)}
      </div>

      {/* Session Change Modal */}
      {changingSession && registrationData && (
        <SessionChangeModal
          type={changingSession.type}
          branchId={registrationData.branch.id}
          currentSession={
            changingSession.type === 'test'
              ? registrationData.testDates[changingSession.index]
              : registrationData.speakingDates[changingSession.index]
          }
          allSessions={
            changingSession.type === 'test'
              ? registrationData.testDates
              : registrationData.speakingDates
          }
          changingIndex={changingSession.index}
          excludeIds={getExcludeIds()}
          onSelect={handleSessionChange}
          onClose={() => setChangingSession(null)}
        />
      )}
    </div>
  );
};

export default Step5Review;
