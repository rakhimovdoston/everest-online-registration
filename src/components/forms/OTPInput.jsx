import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const OTPInput = ({ length = 6, onChange, error, disabled = false }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    const otpValue = newOtp.join('');
    onChange?.(otpValue);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1].focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    }

    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);

    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    const focusIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[focusIndex].focus();

    onChange?.(newOtp.join(''));
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-2 sm:gap-3">
        {otp.map((digit, index) => (
          <motion.input
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            onFocus={handleFocus}
            disabled={disabled}
            className={`
              w-10 h-12 sm:w-12 sm:h-14
              text-center text-xl sm:text-2xl font-semibold
              border-2 rounded-lg
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              disabled:bg-slate-100 disabled:cursor-not-allowed
              ${error
                ? 'border-red-500 bg-red-50 text-red-600'
                : 'border-slate-300 bg-white text-slate-900'
              }
              ${digit ? 'border-indigo-500 bg-indigo-50' : ''}
            `}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
          />
        ))}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default OTPInput;
