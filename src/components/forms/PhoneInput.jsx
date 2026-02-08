import { useState } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

const PhoneInput = ({
  label,
  name,
  placeholder = '+998901234567',
  register,
  error,
  required = false
}) => {
  const [value, setValue] = useState('');

  const formatPhoneNumber = (input) => {
    // Remove all non-digit characters except +
    const cleaned = input.replace(/[^\d+]/g, '');

    // If starts with +998, format as +998 XX XXX XX XX
    if (cleaned.startsWith('+998')) {
      const digits = cleaned.slice(4); // Remove +998
      let formatted = '+998';

      if (digits.length > 0) {
        formatted += ' ' + digits.slice(0, 2);
      }
      if (digits.length > 2) {
        formatted += ' ' + digits.slice(2, 5);
      }
      if (digits.length > 5) {
        formatted += ' ' + digits.slice(5, 7);
      }
      if (digits.length > 7) {
        formatted += ' ' + digits.slice(7, 9);
      }

      return formatted;
    }

    // If starts with +, keep as is (for other countries)
    if (cleaned.startsWith('+')) {
      return cleaned;
    }

    // If no + at start, assume Uzbekistan and add +998
    if (cleaned.length > 0) {
      return '+998' + (cleaned.length > 0 ? ' ' + cleaned : '');
    }

    return '';
  };

  const handleChange = (e) => {
    const input = e.target.value;
    const formatted = formatPhoneNumber(input);
    setValue(formatted);

    // Update the actual value for react-hook-form (remove spaces)
    e.target.value = formatted.replace(/\s/g, '');
  };

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          id={name}
          type="tel"
          placeholder={placeholder}
          value={value}
          {...register(name)}
          onChange={(e) => {
            handleChange(e);
            register(name).onChange(e);
          }}
          className={`
            block w-full px-4 py-3 rounded-lg border
            ${error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500'
            }
            placeholder:text-slate-400
            focus:outline-none focus:ring-2
            transition-colors duration-200
            ${error ? 'pr-10' : ''}
          `}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error.message}
        </p>
      )}
      <p className="mt-1 text-xs text-slate-500">
        Format: +998 XX XXX XX XX
      </p>
    </div>
  );
};

export default PhoneInput;
