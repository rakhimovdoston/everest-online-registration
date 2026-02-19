import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  PencilIcon,
  CheckCircleIcon,
  ClockIcon,
  CreditCardIcon,
  CalendarIcon,
  TrophyIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../services/api';
import Button from '../components/ui/Button';
import FormInput from '../components/forms/FormInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const profileSchema = z.object({
  username: z.string().min(1, "Username kiritish majburiy"),
  firstName: z.string().min(1, "Ism kiritish majburiy"),
  lastName: z.string().min(1, "Familiya kiritish majburiy"),
  email: z.string().email("Email noto'g'ri").or(z.literal('')).optional(),
  phone: z.string().optional(),
});

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Check if profile is incomplete
  const isProfileIncomplete = user && (!user.username || !user.firstName || !user.lastName || !user.email);

  // Test registrations from API
  const [testRegistrations, setTestRegistrations] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    mode: 'onBlur',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Set initial form values
    if (user) {
      setValue('username', user.username || '');
      setValue('firstName', user.firstName || '');
      setValue('lastName', user.lastName || '');
      setValue('phone', user.phone || '');
      setValue('email', user.email || '');
    }
  }, [isAuthenticated, navigate, user, setValue]);

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) return;
      try {
        setIsLoadingBookings(true);
        const response = await authApi.getBookingsByUser(user.id);
        const bookings = response.data || response || [];
        setTestRegistrations(Array.isArray(bookings) ? bookings : []);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
        setTestRegistrations([]);
      } finally {
        setIsLoadingBookings(false);
      }
    };

    fetchBookings();
  }, [user?.id]);

  // Auto-open edit mode if profile is incomplete
  useEffect(() => {
    if (isProfileIncomplete) {
      setIsEditing(true);
    }
  }, [isProfileIncomplete]);

  const onSubmit = async (data) => {
    setIsSaving(true);
    setSaveError('');

    try {
      await authApi.completeRegistration({
        username: data.username,
        firstname: data.firstName,
        lastname: data.lastName,
        email: data.email,
      });

      // Re-fetch profile to get updated data
      const profileData = await authApi.getProfile();
      updateUser(profileData);
      setIsEditing(false);
    } catch (error) {
      if (error.fieldErrors) {
        // Map API field errors to form fields
        Object.entries(error.fieldErrors).forEach(([field, message]) => {
          const fieldMap = { firstname: 'firstName', lastname: 'lastName', username: 'username', email: 'email' };
          const formField = fieldMap[field] || field;
          setError(formField, { message });
        });
      } else {
        setSaveError(error.message || t('common.error'));
      }
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = t('common.months', { returnObjects: true });
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' UZS';
  };

  const getStatusBadge = (status) => {
    const styles = {
      COMPLETED: 'bg-green-100 text-green-800 border-green-200',
      WAITING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      SCHEDULED: 'bg-blue-100 text-blue-800 border-blue-200',
      CANCELLED: 'bg-red-100 text-red-800 border-red-200'
    };

    const labels = {
      COMPLETED: t('profile.status.completed'),
      WAITING: t('profile.status.pending'),
      SCHEDULED: t('profile.status.scheduled'),
      CANCELLED: t('profile.status.cancelled')
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.WAITING}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getTimeLabel = (time) => {
    const timeLabels = {
      morning: t('profile.time.morning'),
      afternoon: t('profile.time.afternoon'),
      evening: t('profile.time.evening')
    };
    return timeLabels[time] || time;
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">
            {t('profile.title')}
          </h1>
          <p className="text-slate-600">
            {t('profile.subtitle')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - User Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 sticky top-24"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  {t('profile.personalInfo')}
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                )}
              </div>

              {isProfileIncomplete && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 text-center">
                    {t('profile.incompleteProfile')}
                  </p>
                </div>
              )}

              {saveError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 text-center">{saveError}</p>
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <FormInput
                    label={t('auth.username')}
                    name="username"
                    type="text"
                    register={register}
                    error={errors.username}
                    required
                  />
                  <FormInput
                    label={t('auth.firstName')}
                    name="firstName"
                    type="text"
                    register={register}
                    error={errors.firstName}
                    required
                  />
                  <FormInput
                    label={t('auth.lastName')}
                    name="lastName"
                    type="text"
                    register={register}
                    error={errors.lastName}
                    required
                  />
                  <FormInput
                    label={t('auth.email')}
                    name="email"
                    type="email"
                    register={register}
                    error={errors.email}
                  />
                  <FormInput
                    label={t('testRegistration.step3.phone')}
                    name="phone"
                    type="tel"
                    register={register}
                    error={errors.phone}
                    disabled
                  />
                  <div className="flex gap-3 mt-2">
                    {!isProfileIncomplete && (
                      <Button
                        variant="secondary"
                        size="lg"
                        type="button"
                        onClick={() => { setIsEditing(false); setSaveError(''); }}
                        disabled={isSaving}
                        className="flex-1"
                      >
                        {t('common.cancel')}
                      </Button>
                    )}
                    <Button
                      variant="primary"
                      size="lg"
                      type="submit"
                      disabled={isSaving}
                      className="flex-1"
                    >
                      {isSaving ? t('common.saving') : t('common.save')}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <UserCircleIcon className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-600">{t('auth.username')}</p>
                      <p className="text-slate-900">{user.username ? `@${user.username}` : '—'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <UserCircleIcon className="w-12 h-12 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-600">{t('profile.fullName')}</p>
                      <p className="font-semibold text-slate-900">
                        {user.firstName || user.lastName
                          ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                          : '—'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <EnvelopeIcon className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-600">Email</p>
                      <p className="text-slate-900">{user.email || '—'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <PhoneIcon className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-600">{t('profile.phone')}</p>
                      <p className="text-slate-900">{user.phone || '—'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Statistics */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">
                  {t('profile.statistics')}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-indigo-50 rounded-lg">
                    <p className="text-2xl font-bold text-indigo-600">
                      {testRegistrations.reduce((sum, reg) => sum + (reg.results?.length || 0), 0)}
                    </p>
                    <p className="text-xs text-slate-600">{t('profile.totalTests')}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {testRegistrations.reduce((sum, reg) => sum + (reg.results?.filter(r => r.examStatus === 'COMPLETED').length || 0), 0)}
                    </p>
                    <p className="text-xs text-slate-600">{t('profile.completedTests')}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Test History */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {t('profile.testHistory')}
              </h2>

              <div className="space-y-6">
                {testRegistrations.map((registration) => (
                  <div
                    key={registration.id}
                    className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200"
                  >
                    {/* Registration Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                          {registration.mockPackages.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            {formatDate(registration.date)}
                          </div>
                          <div className="flex items-center gap-1">
                            <CreditCardIcon className="w-4 h-4" />
                            {registration.results[0]?.branchName || 'EVEREST'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-indigo-600">
                          {formatPrice(registration.mockPackages.price)}
                        </p>
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium mt-2">
                          {t('profile.payment.paid')}
                        </span>
                      </div>
                    </div>

                    {/* Test Sessions */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <TrophyIcon className="w-5 h-5 text-indigo-600" />
                        {t('profile.testSessions')} ({registration.results.length})
                      </h4>
                      <div className="space-y-3">
                        {registration.results.map((testSession, idx) => {
                          // Find speaking score for this test session
                          const relatedSpeaking = registration.speakings.find(speaking =>
                            speaking.examResponses.some(exam => exam.id === testSession.id)
                          );

                          return (
                            <div
                              key={testSession.id}
                              className="p-5 bg-gradient-to-br from-slate-50 to-white rounded-xl border-2 border-slate-200 hover:border-indigo-300 transition-all shadow-sm hover:shadow-md"
                            >
                              {/* Session Header */}
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="bg-indigo-100 rounded-lg px-3 py-1">
                                    <span className="text-sm font-bold text-indigo-700">
                                      {t('profile.session')} {idx + 1}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-slate-900">
                                      {formatDate(testSession.testDate)}
                                    </p>
                                    <p className="text-xs text-slate-600">
                                      {getTimeLabel(testSession.time)} • {testSession.branchName}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  {testSession.examStatus === 'COMPLETED' && (
                                    <button
                                      onClick={() => {
                                        // PDF yuklab olish funksiyasi
                                        console.log('Downloading PDF for session:', testSession.id);
                                        // TODO: PDF yuklab olish API chaqiruvi
                                      }}
                                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
                                    >
                                      <ArrowDownTrayIcon className="w-4 h-4" />
                                      <span>{t('profile.downloadPDF')}</span>
                                    </button>
                                  )}
                                  {getStatusBadge(testSession.examStatus)}
                                  {testSession.examStatus === 'COMPLETED' ? (
                                    <CheckCircleSolidIcon className="w-6 h-6 text-green-600" />
                                  ) : (
                                    <ClockIcon className="w-6 h-6 text-yellow-600" />
                                  )}
                                </div>
                              </div>

                              {/* Test Scores */}
                              {testSession.examStatus === 'COMPLETED' ? (
                                <div className="grid grid-cols-5 gap-4">
                                  {/* Listening */}
                                  <Link
                                    to={`/test-results/${testSession.id}/listening`}
                                    className="bg-white rounded-lg p-4 border border-slate-200 text-center hover:border-blue-400 hover:shadow-lg transition-all group relative"
                                  >
                                    <ArrowTopRightOnSquareIcon className="w-4 h-4 text-blue-400 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                      </svg>
                                      <p className="text-xs font-semibold text-slate-700">Listening</p>
                                    </div>
                                    <p className="text-3xl font-bold text-blue-600">
                                      {testSession.listening || '-'}
                                    </p>
                                  </Link>

                                  {/* Reading */}
                                  <Link
                                    to={`/test-results/${testSession.id}/reading`}
                                    className="bg-white rounded-lg p-4 border border-slate-200 text-center hover:border-green-400 hover:shadow-lg transition-all group relative"
                                  >
                                    <ArrowTopRightOnSquareIcon className="w-4 h-4 text-green-400 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                      </svg>
                                      <p className="text-xs font-semibold text-slate-700">Reading</p>
                                    </div>
                                    <p className="text-3xl font-bold text-green-600">
                                      {testSession.reading || '-'}
                                    </p>
                                  </Link>

                                  {/* Writing */}
                                  <Link
                                    to={`/test-results/${testSession.id}/writing`}
                                    className="bg-white rounded-lg p-4 border border-slate-200 text-center hover:border-orange-400 hover:shadow-lg transition-all group relative"
                                  >
                                    <ArrowTopRightOnSquareIcon className="w-4 h-4 text-orange-400 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                      </svg>
                                      <p className="text-xs font-semibold text-slate-700">Writing</p>
                                    </div>
                                    <p className="text-3xl font-bold text-orange-600">
                                      {testSession.writing || '-'}
                                    </p>
                                  </Link>

                                  {/* Speaking */}
                                  <div className="bg-white rounded-lg p-4 border border-slate-200 text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                      </svg>
                                      <p className="text-xs font-semibold text-slate-700">Speaking</p>
                                    </div>
                                    <p className="text-3xl font-bold text-purple-600">
                                      {relatedSpeaking?.score || testSession.speaking || '-'}
                                    </p>
                                    {relatedSpeaking && (
                                      <p className="text-[10px] text-slate-500 mt-1">
                                        {relatedSpeaking.speakerName}
                                      </p>
                                    )}
                                  </div>

                                  {/* Overall */}
                                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border-2 border-indigo-300 text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                      <TrophyIcon className="w-5 h-5 text-indigo-600" />
                                      <p className="text-xs font-semibold text-slate-700">Overall</p>
                                    </div>
                                    <p className="text-3xl font-bold text-indigo-600">
                                      {(() => {
                                        const scores = [
                                          testSession.listening,
                                          testSession.reading,
                                          testSession.writing,
                                          relatedSpeaking?.score || testSession.speaking
                                        ].filter(score => score !== null && score !== undefined);

                                        if (scores.length === 0) return '-';
                                        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
                                        return avg.toFixed(1);
                                      })()}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <div className="py-6 text-center">
                                  <ClockIcon className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                                  <p className="text-sm text-slate-600">
                                    {t('profile.resultsNotAvailable')}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {isLoadingBookings && (
                <div className="bg-white rounded-2xl shadow-xl p-12 border border-slate-200 text-center">
                  <svg className="animate-spin h-10 w-10 text-indigo-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p className="text-slate-600">{t('common.loading')}</p>
                </div>
              )}

              {!isLoadingBookings && testRegistrations.length === 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-12 border border-slate-200 text-center">
                  <TrophyIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {t('profile.noTests')}
                  </h3>
                  <p className="text-slate-600 mb-6">
                    {t('profile.noTestsDescription')}
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate('/test-registration')}
                  >
                    {t('profile.registerForTest')}
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
