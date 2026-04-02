import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import { usePackages } from '../../contexts/PackageContext';
import Button from '../../components/ui/Button';
import { useTranslation } from 'react-i18next';

const getPackageKey = (name) => {
  const normalized = name?.toLowerCase().replace(/\s+/g, ' ').trim();
  if (normalized?.includes('one') || normalized?.includes('1')) return 'onetime';
  if (normalized?.includes('three') || normalized?.includes('3')) return 'three';
  if (normalized?.includes('six') || normalized?.includes('6')) return 'six';
  if (normalized?.includes('twelve') || normalized?.includes('12')) return 'twelve';
  return normalized?.replace(/\s+/g, '');
};

const Step1Package = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { activePackages, isLoading } = usePackages();
  const [registrationType] = useState('myself');
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Pre-selected package ID from Pricing page (Router state or sessionStorage fallback)
  const preselectedId =
    location.state?.preselectedPackageId != null
      ? String(location.state.preselectedPackageId)
      : sessionStorage.getItem('preselectedPackageId');

  // Auto-select and skip to step 2 when a package was chosen from the Home page
  useEffect(() => {
    if (!preselectedId || isLoading || activePackages.length === 0) return;

    const pkg = activePackages.find((p) => String(p.id) === preselectedId);
    if (!pkg) return;

    sessionStorage.removeItem('preselectedPackageId');
    localStorage.setItem(
      'testRegistration',
      JSON.stringify({ registrationType: 'myself', package: pkg })
    );
    navigate('/test-registration/branch', { replace: true });
  }, [preselectedId, isLoading, activePackages]);

  const handleNext = () => {
    if (!selectedPackage) {
      alert(t('testRegistration.alerts.selectPackage'));
      return;
    }

    const registrationData = {
      registrationType,
      package: selectedPackage
    };
    localStorage.setItem('testRegistration', JSON.stringify(registrationData));
    navigate('/test-registration/branch');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' UZS';
  };

  // While packages are loading and a preselected ID exists, show a simple loader
  // so the user doesn't see a flash of the package selection UI before redirecting
  if (preselectedId && (isLoading || activePackages.length === 0)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-slate-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

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
            {!isLoading && activePackages.map((pkg) => {
              const key = getPackageKey(pkg.name);
              const regFeatures = t(`pricing.plans.${key}.regFeatures`, { returnObjects: true });
              const regDescription = t(`pricing.plans.${key}.regDescription`, { defaultValue: pkg.description });
              const planName = t(`pricing.plans.${key}.name`, { defaultValue: pkg.name });

              return (
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
                      {planName}
                    </h3>
                    <p className="text-2xl font-bold text-indigo-600">
                      {formatPrice(pkg.price)}
                    </p>
                  </div>

                  <div className="space-y-2 mb-4">
                    {Array.isArray(regFeatures) && regFeatures.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-sm text-slate-600 line-clamp-3">
                    {regDescription}
                  </p>
                </motion.button>
              );
            })}
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
