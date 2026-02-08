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
import Button from '../components/ui/Button';
import FormInput from '../components/forms/FormInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const profileSchema = z.object({
  firstName: z.string().min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak"),
  lastName: z.string().min(2, "Familiya kamida 2 ta belgidan iborat bo'lishi kerak"),
  phone: z.string().regex(/^[\+]?[0-9]{9,13}$/, "Telefon raqami noto'g'ri"),
  email: z.string().email("Email noto'g'ri").optional().or(z.literal('')),
});

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Mock test registrations data - Updated to match API structure
  const [testRegistrations] = useState([
    {
      id: 5687,
      mockPackages: {
        id: 4,
        active: true,
        name: 'Three Sessions',
        tariff: 'Three Sessions - 200 000 UZS',
        orders: 2,
        description: "Ushbu tarifimiz bir hafta doirasida kun ora, haftaning toq yoki juft kunlarida ketma-ket CDI mock imtihonini topshiruvchi kandidatlarni nazarda tutadi! Kandidat registratsiya qilgach o'zi uchun qulay vaqt va hafta kunlarini hamda o'sha hafta ichida qulay bo'lgan Speaking kuni va vaqtini tanlaydi! Bu tarif doirasida kandidat faqat bir marta Speaking qilish imkoniga ega bo'ladi va o'sha Speaking natijasi har uchchala mock session uchun amal qiladi!",
        price: 200000.0,
        totalSessions: 3,
        speakingSessions: 1,
        durationWeeks: 1
      },
      date: '2026-01-15T14:21:26.139+00:00',
      results: [
        {
          id: 17581,
          startDate: null,
          endDate: null,
          reading: 7.5,
          listening: 8.0,
          writing: 7.0,
          speaking: null,
          status: null,
          smsStatus: null,
          examStatus: 'COMPLETED',
          type: 'booking',
          testDate: '2026-01-17',
          time: 'morning',
          branchName: 'EVEREST INTEGRO',
          bookingId: 17581
        },
        {
          id: 17582,
          startDate: null,
          endDate: null,
          reading: 6.5,
          listening: 7.0,
          writing: 6.5,
          speaking: null,
          status: null,
          smsStatus: null,
          examStatus: 'COMPLETED',
          type: 'booking',
          testDate: '2026-01-20',
          time: 'morning',
          branchName: 'EVEREST INTEGRO',
          bookingId: 17582
        },
        {
          id: 17583,
          startDate: null,
          endDate: null,
          reading: null,
          listening: null,
          writing: null,
          speaking: null,
          status: null,
          smsStatus: null,
          examStatus: 'WAITING',
          type: 'booking',
          testDate: '2026-01-23',
          time: 'morning',
          branchName: 'EVEREST INTEGRO',
          bookingId: 17583
        }
      ],
      speakings: [
        {
          id: 7669,
          date: '2026-01-17',
          time: '16:40',
          branchName: 'EVEREST INTEGRO',
          speakerName: 'Dilshod Suvonqulov',
          score: 7.5,
          speakerId: null,
          type: null,
          status: 'COMPLETED',
          reason: null,
          examResponses: [
            {
              id: 17581,
              testDate: '2026-01-17',
              time: 'morning',
              examStatus: 'COMPLETED'
            },
            {
              id: 17582,
              testDate: '2026-01-20',
              time: 'morning',
              examStatus: 'COMPLETED'
            },
            {
              id: 17583,
              testDate: '2026-01-23',
              time: 'morning',
              examStatus: 'WAITING'
            }
          ]
        }
      ],
      groups: []
    }
  ]);

  const {
    register,
    handleSubmit,
    setValue,
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
      setValue('firstName', user.firstName || '');
      setValue('lastName', user.lastName || '');
      setValue('phone', user.phone || '');
      setValue('email', user.email || '');
    }
  }, [isAuthenticated, navigate, user, setValue]);

  const onSubmit = async (data) => {
    setIsSaving(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    updateUser(data);
    setIsEditing(false);
    setIsSaving(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    label={t('testRegistration.step3.phone')}
                    name="phone"
                    type="tel"
                    register={register}
                    error={errors.phone}
                    required
                  />
                  <FormInput
                    label={t('auth.email')}
                    name="email"
                    type="email"
                    register={register}
                    error={errors.email}
                  />
                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      type="button"
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                    >
                      {t('common.cancel')}
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      type="submit"
                      disabled={isSaving}
                    >
                      {isSaving ? t('common.saving') : t('common.save')}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <UserCircleIcon className="w-12 h-12 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-600">{t('profile.fullName')}</p>
                      <p className="font-semibold text-slate-900">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                  </div>

                  {user.email && (
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                      <EnvelopeIcon className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-600">Email</p>
                        <p className="text-slate-900">{user.email}</p>
                      </div>
                    </div>
                  )}

                  {user.phone && (
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                      <PhoneIcon className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-600">{t('profile.phone')}</p>
                        <p className="text-slate-900">{user.phone}</p>
                      </div>
                    </div>
                  )}
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
                      {testRegistrations.length}
                    </p>
                    <p className="text-xs text-slate-600">{t('profile.totalTests')}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {testRegistrations.filter(t => t.results).length}
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

              {testRegistrations.length === 0 && (
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
