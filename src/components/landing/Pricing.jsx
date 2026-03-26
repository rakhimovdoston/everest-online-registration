import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { usePackages } from '../../contexts/PackageContext';

const Pricing = () => {
  const { t } = useTranslation();
  const { activePackages, isLoading } = usePackages();

  // Map package names to translation keys
  const packageToKeyMap = {
    'One Timer': 'onetime',
    'Three Sessions': 'three',
    'Six Sessions': 'six',
    'Twelve Sessions': 'twelve',
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(price);
  };

  return (
    <section id="pricing" className="relative py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            {t('pricing.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              {t('pricing.titleHighlight')}
            </span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            {t('pricing.subtitle')}
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {isLoading ? (
            <div className="col-span-4 text-center py-12">
              <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-slate-600">{t('common.loading')}</p>
            </div>
          ) : (
            activePackages.map((pkg, index) => {
              const key = packageToKeyMap[pkg.name] || pkg.name.toLowerCase().replace(/\s+/g, '');
              const features = t(`pricing.plans.${key}.features`, { returnObjects: true });

              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="relative flex flex-col bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 p-6"
                >
                  {/* Plan Header */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      {t(`pricing.plans.${key}.name`, { defaultValue: pkg.name })}
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">
                      {t(`pricing.plans.${key}.period`, { defaultValue: `${pkg.durationWeeks} week program` })}
                    </p>

                    <div className="flex items-baseline justify-center gap-1 mb-1">
                      <span className="text-4xl font-bold text-slate-900">{formatPrice(pkg.price)}</span>
                      <span className="text-sm text-slate-600 font-medium">UZS</span>
                    </div>

                    <p className="text-sm text-slate-600 mt-4">
                      {t(`pricing.plans.${key}.description`, { defaultValue: pkg.description })}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {Array.isArray(features) && features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700 text-xs leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <div className="mt-auto">
                    <Link
                      to="/test-registration"
                      state={{ preselectedPackageId: pkg.id }}
                      onClick={() => sessionStorage.setItem('preselectedPackageId', String(pkg.id))}
                    >
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 rounded-xl font-semibold text-sm bg-slate-900 text-white hover:bg-slate-800 shadow-md transition-all duration-200"
                      >
                        {t('pricing.choosePlan')}
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-20"
        >
          <div className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-50 rounded-full mb-4">
            <Check className="w-5 h-5 text-indigo-600" />
            <p className="text-slate-700 font-medium">
              {t('pricing.bottomBadge')}
            </p>
          </div>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            {t('pricing.bottomNote')}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
