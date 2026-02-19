import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon, UserIcon, UsersIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import { usePackages } from '../../contexts/PackageContext';
import Button from '../../components/ui/Button';
import { useTranslation } from 'react-i18next';

const Step1Package = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { activePackages, isLoading } = usePackages();
  const [registrationType, setRegistrationType] = useState('myself'); // 'myself' or 'other'
  const [selectedPackage, setSelectedPackage] = useState(null);

  const handleNext = () => {
    if (!selectedPackage) {
      alert(t('testRegistration.alerts.selectPackage'));
      return;
    }

    // Save to localStorage or state management
    const registrationData = {
      registrationType,
      package: selectedPackage
    };
    localStorage.setItem('testRegistration', JSON.stringify(registrationData));

    // Navigate to step 2
    navigate('/test-registration/branch');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' UZS';
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-semibold">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-indigo-600">{t('testRegistration.progress.package')}</span>
            </div>
            <div className="w-16 h-0.5 bg-slate-300" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-300 text-slate-600 font-semibold">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-slate-500">{t('testRegistration.progress.branch')}</span>
            </div>
            <div className="w-16 h-0.5 bg-slate-300" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-300 text-slate-600 font-semibold">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-slate-500">{t('testRegistration.progress.details')}</span>
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
            {t('testRegistration.step1.title')}
          </h1>
          <p className="text-slate-600">
            {t('testRegistration.step1.subtitle')}
          </p>
        </motion.div>

        {/* Registration Type */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 mb-6"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            {t('testRegistration.step1.whoRegistering')}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setRegistrationType('myself')}
              className={`relative flex items-center gap-3 p-4 border-2 rounded-xl transition-all ${
                registrationType === 'myself'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                registrationType === 'myself' ? 'bg-indigo-100' : 'bg-slate-100'
              }`}>
                <UserIcon className={`w-6 h-6 ${
                  registrationType === 'myself' ? 'text-indigo-600' : 'text-slate-600'
                }`} />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-slate-900">{t('testRegistration.step1.forMyself')}</div>
                <div className="text-sm text-slate-600">{t('testRegistration.step1.forMyselfDesc')}</div>
              </div>
              {registrationType === 'myself' && (
                <CheckCircleSolidIcon className="w-6 h-6 text-indigo-600 absolute top-2 right-2" />
              )}
            </button>

            <button
              onClick={() => setRegistrationType('other')}
              className={`relative flex items-center gap-3 p-4 border-2 rounded-xl transition-all ${
                registrationType === 'other'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                registrationType === 'other' ? 'bg-indigo-100' : 'bg-slate-100'
              }`}>
                <UsersIcon className={`w-6 h-6 ${
                  registrationType === 'other' ? 'text-indigo-600' : 'text-slate-600'
                }`} />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-slate-900">{t('testRegistration.step1.forOther')}</div>
                <div className="text-sm text-slate-600">{t('testRegistration.step1.forOtherDesc')}</div>
              </div>
              {registrationType === 'other' && (
                <CheckCircleSolidIcon className="w-6 h-6 text-indigo-600 absolute top-2 right-2" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Packages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            {t('testRegistration.step1.selectPackage')}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {isLoading && (
              <div className="col-span-2 text-center py-12">
                <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-slate-600">{t('common.loading')}</p>
              </div>
            )}
            {!isLoading && activePackages.map((pkg) => (
              <motion.button
                key={pkg.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedPackage(pkg)}
                className={`relative text-left p-6 border-2 rounded-2xl transition-all ${
                  selectedPackage?.id === pkg.id
                    ? 'border-indigo-600 bg-indigo-50 shadow-lg'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {selectedPackage?.id === pkg.id && (
                  <CheckCircleSolidIcon className="w-8 h-8 text-indigo-600 absolute top-4 right-4" />
                )}

                <div className="mb-3">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    {pkg.name}
                  </h3>
                  <p className="text-2xl font-bold text-indigo-600">
                    {formatPrice(pkg.price)}
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    <span>{pkg.totalSessions} {t('testRegistration.step1.sessions')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    <span>{pkg.speakingSessions} {t('testRegistration.step1.speakingSessions')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    <span>{pkg.durationWeeks} {t('testRegistration.step1.weeks')}</span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 line-clamp-3">
                  {pkg.description}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/')}
          >
            {t('testRegistration.common.cancel')}
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleNext}
            disabled={!selectedPackage}
          >
            {t('testRegistration.common.next')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step1Package;
