import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircleIcon, MapPinIcon } from '@heroicons/react/24/solid';
import CalendarFilledIcon from '../ui/CalendarFilledIcon';
import { usePackages } from '../../contexts/PackageContext';
import { trackInitiateCheckout } from '../../utils/pixel';

const HeroSection = () => {
  const { t } = useTranslation();
  const { activeBranches, testTimes } = usePackages();

  const stats = [
    { icon: MapPinIcon, value: activeBranches.length || '—', label: t('hero.branches'), circle: 'bg-hot-light', color: 'text-hot' },
    { icon: CalendarFilledIcon, value: testTimes.length || '—', label: t('hero.dailyTests'), circle: 'bg-indigo-50', color: 'text-indigo-600' },
  ];

  return (
    <section className="flex min-h-[max(520px,100svh)] items-center justify-center bg-white px-5 pb-12 pt-[70px]">
      <div className="mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-sm font-semibold text-ink"
        >
          <CheckCircleIcon className="h-5 w-5 text-indigo-600" />
          {t('hero.badge')}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="mb-7 text-[40px] font-extrabold leading-[1.12] tracking-[-0.02em] text-ink sm:text-5xl lg:text-[64px]"
        >
          {t('hero.titleLine1')}
          <br />
          <span className="text-hot">{t('hero.titleLine2')}</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="mb-12 flex flex-wrap justify-center gap-3"
        >
          <Link
            to="/test-registration"
            onClick={trackInitiateCheckout}
            className="rounded-xl bg-indigo-600 px-7 py-3.5 text-[15px] font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-700"
          >
            {t('hero.startButton')}
          </Link>
          <a
            href="#pricing"
            className="rounded-xl bg-control px-7 py-3.5 text-[15px] font-semibold text-ink transition duration-200 hover:-translate-y-0.5 hover:bg-control-hover"
          >
            {t('hero.pricingButton')}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="flex justify-center gap-11"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full ${stat.circle}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <p className="text-lg font-bold text-ink">{stat.value} {stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
