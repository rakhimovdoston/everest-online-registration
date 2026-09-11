import { useTranslation } from 'react-i18next';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

// Standing warning shown before/around the test: arrive 10 minutes early,
// latecomers are not admitted to the Mock test. Reused on Review and Profile.
const LateArrivalWarning = ({ className = '' }) => {
  const { t } = useTranslation();

  return (
    <div className={`bg-amber-50 border border-amber-300 rounded-2xl p-5 flex items-start gap-3 ${className}`}>
      <ExclamationTriangleIcon className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-amber-800">
          {t('testRegistration.lateWarning.title')}
        </p>
        <p className="text-sm text-amber-700 mt-1">
          {t('testRegistration.lateWarning.arriveEarly')}
        </p>
        <p className="text-sm font-medium text-amber-800 mt-1">
          {t('testRegistration.lateWarning.lateNotAdmitted')}
        </p>
      </div>
    </div>
  );
};

export default LateArrivalWarning;
