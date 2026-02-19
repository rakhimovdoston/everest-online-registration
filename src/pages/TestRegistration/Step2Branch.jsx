import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BuildingOfficeIcon, MapPinIcon, UsersIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import { usePackages } from '../../contexts/PackageContext';
import Button from '../../components/ui/Button';
import { useTranslation } from 'react-i18next';

const Step2Branch = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { activeBranches, isLoading } = usePackages();
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [registrationData, setRegistrationData] = useState(null);

  useEffect(() => {
    // Load previous step data
    const savedData = localStorage.getItem('testRegistration');
    if (!savedData) {
      navigate('/test-registration');
      return;
    }
    setRegistrationData(JSON.parse(savedData));
  }, [navigate]);

  const handleNext = () => {
    if (!selectedBranch) {
      alert(t('testRegistration.alerts.selectBranch'));
      return;
    }

    // Update localStorage
    const updatedData = {
      ...registrationData,
      branch: selectedBranch
    };
    localStorage.setItem('testRegistration', JSON.stringify(updatedData));

    // Navigate to step 3
    navigate('/test-registration/details');
  };

  const handleBack = () => {
    navigate('/test-registration');
  };

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
            <div className="w-16 h-0.5 bg-indigo-600" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-semibold">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-indigo-600">{t('testRegistration.progress.branch')}</span>
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
            {t('testRegistration.step2.title')}
          </h1>
          <p className="text-slate-600">
            {t('testRegistration.step2.subtitle')}
          </p>
        </motion.div>

        {/* Selected Package Info */}
        {registrationData?.package && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-indigo-700">{t('testRegistration.common.selectedPackage')}:</p>
                <p className="text-lg font-bold text-indigo-900">
                  {registrationData.package.name}
                </p>
              </div>
              <p className="text-2xl font-bold text-indigo-600">
                {new Intl.NumberFormat('uz-UZ').format(registrationData.package.price)} UZS
              </p>
            </div>
          </motion.div>
        )}

        {/* Branches Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
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
            {!isLoading && activeBranches.map((branch) => (
              <motion.button
                key={branch.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedBranch(branch)}
                className={`relative text-left p-6 border-2 rounded-2xl transition-all ${
                  selectedBranch?.id === branch.id
                    ? 'border-indigo-600 bg-indigo-50 shadow-lg'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {selectedBranch?.id === branch.id && (
                  <CheckCircleSolidIcon className="w-8 h-8 text-indigo-600 absolute top-4 right-4" />
                )}

                <div className="flex items-start gap-3 mb-3">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                    selectedBranch?.id === branch.id ? 'bg-indigo-100' : 'bg-slate-100'
                  }`}>
                    <BuildingOfficeIcon className={`w-6 h-6 ${
                      selectedBranch?.id === branch.id ? 'text-indigo-600' : 'text-slate-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      {branch.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{branch.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <UsersIcon className="w-4 h-4" />
                      <span>{branch.maxStudents} {t('testRegistration.common.seats')}</span>
                    </div>
                  </div>
                </div>

                {branch.description && (
                  <p className="text-sm text-slate-600 mt-2">
                    {branch.description}
                  </p>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="secondary"
            size="lg"
            onClick={handleBack}
          >
            {t('testRegistration.common.back')}
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleNext}
            disabled={!selectedBranch}
          >
            {t('testRegistration.common.next')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step2Branch;
