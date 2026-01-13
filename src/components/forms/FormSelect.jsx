import { motion } from 'framer-motion';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

const FormSelect = ({
  label,
  name,
  options,
  placeholder = 'Select an option',
  register,
  error,
  required = false,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <label htmlFor={name} className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          id={name}
          {...register(name)}
          className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 appearance-none bg-white cursor-pointer ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-200 animate-shake'
              : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
          }`}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {error ? (
            <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
          ) : (
            <svg
              className="w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </div>
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600 flex items-center gap-1"
        >
          {error.message}
        </motion.p>
      )}
    </motion.div>
  );
};

export default FormSelect;
