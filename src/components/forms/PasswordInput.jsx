import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExclamationCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const PasswordInput = ({
  label,
  name,
  placeholder = 'Enter password',
  register,
  error,
  required = false,
  showStrength = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);

  const calculateStrength = (password) => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;
    return Math.min(score, 4);
  };

  const getStrengthColor = () => {
    if (strength <= 1) return 'bg-red-500';
    if (strength === 2) return 'bg-yellow-500';
    if (strength === 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (strength <= 1) return 'Weak';
    if (strength === 2) return 'Fair';
    if (strength === 3) return 'Good';
    return 'Strong';
  };

  const handlePasswordChange = (e) => {
    if (showStrength) {
      setStrength(calculateStrength(e.target.value));
    }
  };

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
        <input
          id={name}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          {...register(name, {
            onChange: handlePasswordChange,
          })}
          className={`w-full px-4 py-3 pr-12 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-200 animate-shake'
              : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
          }`}
          {...props}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {error && <ExclamationCircleIcon className="w-5 h-5 text-red-500" />}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-slate-500 hover:text-slate-700 transition-colors focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {showStrength && strength > 0 && !error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-2"
        >
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(strength / 4) * 100}%` }}
                transition={{ duration: 0.3 }}
                className={`h-full ${getStrengthColor()} transition-colors`}
              />
            </div>
            <span className={`text-xs font-medium ${
              strength <= 1 ? 'text-red-600' :
              strength === 2 ? 'text-yellow-600' :
              strength === 3 ? 'text-blue-600' :
              'text-green-600'
            }`}>
              {getStrengthText()}
            </span>
          </div>
        </motion.div>
      )}

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

export default PasswordInput;
