import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { usePackages } from '../../contexts/PackageContext';

// Two-tone icons that pick up the brand blue when their card is hovered
const dark = 'fill-[#9AA1A9] transition-colors duration-200 group-hover:fill-indigo-600';
const light = 'fill-[#D3D7DC] transition-colors duration-200 group-hover:fill-indigo-200';

const TrophyIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    <path className={light} d="M6 8h9v4H10c0 6 3 10 7 11l-1 4C10 25 6 18 6 8Zm36 0h-9v4h5c0 6-3 10-7 11l1 4c6-2 10-9 10-19Z" />
    <path className={dark} d="M13 5h22v15c0 7-5 12-11 12s-11-5-11-12V5Zm9 26h4v9h-4v-9Zm-7 8h18a2 2 0 0 1 2 2v2H13v-2a2 2 0 0 1 2-2Z" />
  </svg>
);

const UsersIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    <circle className={light} cx="36" cy="18" r="6" />
    <path className={light} d="M31 27h5c6 0 10 4 10 10v3H34c0-5-1-9-3-13Z" />
    <circle className={dark} cx="19" cy="13" r="9" />
    <path className={dark} d="M15 25h8c7 0 13 6 13 13v2H2v-2c0-7 6-13 13-13Z" />
  </svg>
);

const BookIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    <path className={light} d="M12 34h30v9H12a4.500 4.500 0 0 1 0-9Z" />
    <path className={dark} d="M12 4h30v32H12c-3 0-5 1-6 3V10a6 6 0 0 1 6-6Z" />
    <path fill="#fff" d="M16 13h18v4H16v-4Zm0 8h11v4H16v-4Z" />
  </svg>
);

const PinIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    <ellipse className={light} cx="24" cy="42" rx="14" ry="4" />
    <path className={dark} d="M24 3c9 0 16 7 16 16 0 11-16 24-16 24S8 30 8 19C8 10 15 3 24 3Z" />
    <circle fill="#fff" cx="24" cy="19" r="6" />
  </svg>
);

const WhyEverest = () => {
  const { t } = useTranslation();
  const { activeBranches } = usePackages();

  const items = [
    { key: 'score', icon: TrophyIcon },
    { key: 'users', icon: UsersIcon },
    { key: 'materials', icon: BookIcon },
    { key: 'branches', icon: PinIcon, options: { count: activeBranches.length || 9 } },
  ];

  return (
    <section className="bg-surface px-5 py-10 md:py-16">
      <div className="mx-auto max-w-[1200px]">
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-6 text-[30px] font-extrabold leading-tight tracking-[-0.02em] text-ink md:mb-8 md:text-center md:text-[44px]"
        >
          {t('why.title')} <span className="text-indigo-600">{t('why.titleHighlight')}</span>
        </motion.h2>

        <div className="grid gap-3 md:grid-cols-2 md:gap-4">
          {items.map((item, index) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group flex gap-4 rounded-3xl bg-white p-5 shadow-[0_12px_32px_rgba(28,35,41,0.05)] transition-shadow duration-200 hover:shadow-[0_20px_44px_rgba(28,35,41,0.1)] md:flex-col md:p-7"
            >
              <item.icon className="h-10 w-10 flex-shrink-0 md:h-12 md:w-12" />
              <div>
                <h3 className="mb-1.5 text-lg font-bold text-ink md:text-[22px]">
                  {t(`why.${item.key}.title`, item.options)}
                </h3>
                <p className="text-sm leading-5 text-ink-soft md:text-[15px] md:leading-6">
                  {t(`why.${item.key}.description`)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyEverest;
