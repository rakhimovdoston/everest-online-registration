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
  CreditCardIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { testTimesLabels } from '../../data/testData';
import Button from '../../components/ui/Button';

const Step4Review = () => {
  const navigate = useNavigate();
  const [registrationData, setRegistrationData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('testRegistration');
    if (!savedData) {
      navigate('/test-registration');
      return;
    }
    const data = JSON.parse(savedData);
    if (!data.personalInfo || !data.testTime) {
      navigate('/test-registration/details');
      return;
    }
    setRegistrationData(data);
  }, [navigate]);

  const handleBack = () => {
    navigate('/test-registration/details');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log('Registration submitted:', registrationData);
    setIsSuccess(true);
    setIsSubmitting(false);

    // Clear localStorage
    localStorage.removeItem('testRegistration');

    // Redirect after 3 seconds
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' UZS';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircleIcon className="w-12 h-12 text-green-600" />
            </motion.div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">
              Muvaffaqiyatli Ro'yxatdan O'tdingiz!
            </h2>
            <p className="text-slate-700 mb-2">
              Test uchun ro'yxatdan o'tishingiz tasdiqlandi
            </p>
            <p className="text-sm text-slate-600 mb-6">
              Tez orada siz bilan bog'lanamiz
            </p>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-indigo-700 mb-1">Test sanasi:</p>
              <p className="text-lg font-bold text-indigo-900">
                {registrationData?.testDate && formatDate(registrationData.testDate)}
              </p>
              <p className="text-sm text-indigo-700 mt-2">
                {testTimesLabels[registrationData?.testTime]}
              </p>
            </div>
            <p className="text-xs text-slate-400">
              Avtomatik ravishda bosh sahifaga yo'naltirilmoqda...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!registrationData) {
    return null;
  }

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
              <span className="ml-2 text-sm font-medium text-green-600">Paket</span>
            </div>
            <div className="w-16 h-0.5 bg-green-600" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white">
                <CheckCircleSolidIcon className="w-6 h-6" />
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Filial</span>
            </div>
            <div className="w-16 h-0.5 bg-green-600" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white">
                <CheckCircleSolidIcon className="w-6 h-6" />
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Ma'lumotlar</span>
            </div>
            <div className="w-16 h-0.5 bg-indigo-600" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-semibold">
                4
              </div>
              <span className="ml-2 text-sm font-medium text-indigo-600">Ko'rib chiqish</span>
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
            Ma'lumotlarni Tasdiqlang
          </h1>
          <p className="text-slate-600">
            Barcha ma'lumotlarni tekshiring va tasdiqlang
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
                <h3 className="text-lg font-bold text-slate-900 mb-2">Tanlangan Paket</h3>
                <div className="space-y-1">
                  <p className="text-slate-700">
                    <span className="font-semibold">{registrationData.package.name}</span>
                  </p>
                  <p className="text-sm text-slate-600">
                    {registrationData.package.totalSessions} ta test sessiyasi •{' '}
                    {registrationData.package.speakingSessions} ta Speaking
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
                <h3 className="text-lg font-bold text-slate-900 mb-2">Filial</h3>
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
                <h3 className="text-lg font-bold text-slate-900 mb-3">Shaxsiy Ma'lumotlar</h3>
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

          {/* Test Time */}
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
                <h3 className="text-lg font-bold text-slate-900 mb-3">Test Vaqti</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-slate-500" />
                    <span className="text-slate-700">{formatDate(registrationData.testDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-5 h-5 text-slate-500" />
                    <span className="text-slate-700">{testTimesLabels[registrationData.testTime]}</span>
                  </div>
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
            Orqaga
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Yuborilmoqda...
              </span>
            ) : (
              'Tasdiqlash va Yuborish'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step4Review;
