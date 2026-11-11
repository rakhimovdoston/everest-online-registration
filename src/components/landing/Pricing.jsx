import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import CalendarFilledIcon from '../ui/CalendarFilledIcon';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { usePackages } from '../../contexts/PackageContext';

const POPULAR_PLAN = 'twelve';

const Pricing = () => {
  const { t } = useTranslation();
  const { activePackages, isLoading } = usePackages();

  // Map package names to translation keys (case-insensitive)
  const getPackageKey = (name) => {
    const normalized = name?.toLowerCase().replace(/\s+/g, ' ').trim();
    if (normalized?.includes('one') || normalized?.includes('1')) return 'onetime';
    if (normalized?.includes('three') || normalized?.includes('3')) return 'three';
    if (normalized?.includes('six') || normalized?.includes('6')) return 'six';
    if (normalized?.includes('twelve') || normalized?.includes('12')) return 'twelve';
    return normalized?.replace(/\s+/g, '');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  return (
    <section id="pricing" className="scroll-mt-[70px] bg-white px-5 py-14 md:py-16">
      <div className="mx-auto max-w-[1200px]">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-10 max-w-4xl text-center md:mb-14"
        >
          <h2 className="mb-4 text-[30px] font-extrabold leading-tight tracking-[-0.02em] text-ink md:text-[44px]">
            {t('pricing.title')}{' '}
            <span className="text-hot">{t('pricing.titleHighlight')}</span>
          </h2>
          <p className="text-base leading-relaxed text-ink-soft md:text-lg">
            {t('pricing.subtitle')}
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid gap-6 md:grid-cols-2 min-[1100px]:grid-cols-4">
          {isLoading ? (
            <div className="col-span-full py-12 text-center">
              <svg className="mx-auto mb-3 h-8 w-8 animate-spin text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-ink-soft">{t('common.loading')}</p>
            </div>
          ) : (
            activePackages.map((pkg, index) => {
              const key = getPackageKey(pkg.name);
              const features = t(`pricing.plans.${key}.features`, { returnObjects: true });
              const isPopular = key === POPULAR_PLAN;

              return (
                <motion.article
                  key={pkg.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -4 }}
                  className={`relative flex flex-col rounded-3xl p-6 transition-shadow duration-200 hover:shadow-[0_20px_44px_rgba(28,35,41,0.1)] ${
                    isPopular
                      ? 'border border-transparent bg-[linear-gradient(160deg,#0154F8_0%,#0B46C8_55%,#0A3A9E_100%)] bg-origin-border text-white'
                      : 'border border-line bg-white text-ink'
                  }`}
                >
                  {isPopular && (
                    <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-white px-3 py-1 text-[13px] font-semibold text-indigo-600 shadow-sm">
                      {t('pricing.popular')}
                    </span>
                  )}

                  {/* Plan Header */}
                  <div className="mb-6 text-center">
                    <h3 className="mb-2 text-2xl font-bold tracking-[-0.02em]">
                      {t(`pricing.plans.${key}.name`, { defaultValue: pkg.name })}
                    </h3>
                    <span className={`mb-5 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] font-medium ${
                      isPopular ? 'border-white/40' : 'border-line'
                    }`}>
                      <CalendarFilledIcon className={`h-3.5 w-3.5 ${isPopular ? 'text-white' : 'text-indigo-600'}`} />
                      {t(`pricing.plans.${key}.period`, { defaultValue: `${pkg.durationWeeks} week program` })}
                    </span>

                    <div className="mb-4 flex items-baseline justify-center gap-1.5">
                      <span className="text-[36px] font-extrabold leading-none tracking-[-0.02em]">{formatPrice(pkg.price)}</span>
                      <span className={`text-sm font-medium ${isPopular ? 'text-white/90' : 'text-ink-soft'}`}>UZS</span>
                    </div>

                    <p className={`text-[15px] leading-5 min-[1100px]:min-h-10 ${isPopular ? 'text-white' : 'text-ink'}`}>
                      {t(`pricing.plans.${key}.description`, { defaultValue: pkg.description })}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="mb-6 space-y-2.5">
                    {Array.isArray(features) && features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2">
                        <CheckCircleIcon className={`h-[22px] w-[22px] flex-shrink-0 ${isPopular ? 'text-white' : 'text-indigo-600'}`} />
                        <span className="text-sm leading-5">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link
                    to="/test-registration"
                    state={{ preselectedPackageId: pkg.id }}
                    onClick={() => sessionStorage.setItem('preselectedPackageId', String(pkg.id))}
                    className={`mt-auto flex items-center justify-center gap-2 rounded-[14px] py-3.5 text-[15px] font-semibold transition-colors duration-200 ${
                      isPopular
                        ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {t('pricing.choosePlan')}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.article>
              );
            })
          )}
        </div>

        {/* Bottom Note */}
        <p className="mt-12 text-center text-sm font-medium text-ink-soft">
          {t('pricing.bottomNote')}
        </p>
      </div>
    </section>
  );
};

export default Pricing;
