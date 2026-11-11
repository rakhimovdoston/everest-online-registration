import { useTranslation } from 'react-i18next';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';

const STEPS = ['package', 'branch', 'testDates', 'speaking', 'review', 'payment'];

// Wizard progress indicator shared by all /test-registration steps.
// Mobile: numbered circles + caption with the current step; md+: every step labelled.
//
// Props:
//   current   number   1-based index of the active step
const StepProgress = ({ current }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <ol className="flex items-center justify-center">
        {STEPS.map((key, i) => {
          const step = i + 1;
          const isDone = step < current;
          const isActive = step === current;

          return (
            <li key={key} className="flex items-center">
              {i > 0 && (
                <div className={`w-4 sm:w-8 lg:w-10 h-0.5 mx-1 sm:mx-2 ${isDone || isActive ? 'bg-indigo-600' : 'bg-slate-300'}`} />
              )}
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full text-sm font-semibold flex-shrink-0 ${
                    isDone
                      ? 'bg-green-600 text-white'
                      : isActive
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isDone ? <CheckCircleSolidIcon className="w-5 h-5" /> : step}
                </div>
                <span
                  className={`hidden lg:inline ml-2 text-sm font-medium whitespace-nowrap ${
                    isDone ? 'text-green-600' : isActive ? 'text-indigo-600' : 'text-slate-400'
                  }`}
                >
                  {t(`testRegistration.progress.${key}`)}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="lg:hidden mt-3 text-center text-sm font-medium text-indigo-600">
        {current}/{STEPS.length} · {t(`testRegistration.progress.${STEPS[current - 1]}`)}
      </p>
    </div>
  );
};

export default StepProgress;
