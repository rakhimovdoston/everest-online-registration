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
import Button from '../../components/ui/Button';

const Step5Review = () => {
  const navigate = useNavigate();
  const [registrationData, setRegistrationData] = useState(null);

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

  const handleSubmit = () => {
    // Navigate to payment page
    navigate('/test-registration/payment');
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

  if (!registrationData) {
    return null;
  }

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
              <span className="ml-2 text-sm font-medium text-green-600">Paket</span>
            </div>
            <div className="w-12 h-0.5 bg-green-600" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white">
                <CheckCircleSolidIcon className="w-6 h-6" />
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Filial</span>
            </div>
            <div className="w-12 h-0.5 bg-green-600" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white">
                <CheckCircleSolidIcon className="w-6 h-6" />
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Test</span>
            </div>
            <div className="w-12 h-0.5 bg-green-600" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white">
                <CheckCircleSolidIcon className="w-6 h-6" />
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Speaking</span>
            </div>
            <div className="w-12 h-0.5 bg-indigo-600" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-semibold">
                5
              </div>
              <span className="ml-2 text-sm font-medium text-indigo-600">Tasdiqlash</span>
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
                <h3 className="text-lg font-bold text-slate-900 mb-3">Test Sanalar</h3>
                <div className="space-y-2">
                  {registrationData.testDates.map((testDate, index) => (
                    <div key={testDate.id} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-slate-900 font-medium">{formatDate(testDate.date)}</p>
                        <p className="text-sm text-slate-600">{testDate.timeString} • {testDate.dayOfWeek}</p>
                      </div>
                    </div>
                  ))}
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
                <h3 className="text-lg font-bold text-slate-900 mb-3">Speaking Sanalar</h3>
                <div className="space-y-2">
                  {registrationData.speakingDates.map((speakingDate, index) => (
                    <div key={speakingDate.id} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-slate-900 font-medium">{formatDate(speakingDate.date)} - {speakingDate.time}</p>
                        <p className="text-sm text-slate-600">{speakingDate.speakerName} • {speakingDate.type}</p>
                      </div>
                    </div>
                  ))}
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
          >
            Orqaga
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
          >
            To'lovga O'tish
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step5Review;
