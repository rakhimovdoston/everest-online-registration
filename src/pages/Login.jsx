import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../services/api';
import OTPInput from '../components/forms/OTPInput';
import Button from '../components/ui/Button';
import Cookies from 'js-cookie';
import { ArrowLeftIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, UserPlusIcon } from '@heroicons/react/24/solid';

const RESEND_TIMEOUT = 120; // 2 minutes

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { login } = useAuth();

  // Form state: 'phone' | 'otp' | 'register'
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Loading states
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Tokens from OTP verify
  const [tokens, setTokens] = useState({ accessToken: null, refreshToken: null });

  // OTP state
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // Registration form state
  const [regForm, setRegForm] = useState({ username: '', firstname: '', lastname: '', email: '', password: '' });
  const [regErrors, setRegErrors] = useState({});

  // Server error
  const [serverError, setServerError] = useState('');

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Format phone number for display
  const formatPhoneDisplay = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`;
  };

  // Handle phone input change
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^\d\s]/g, '');
    const digits = value.replace(/\D/g, '');

    if (digits.length <= 9) {
      setPhone(digits);
      setPhoneError('');
    }
  };

  // Validate phone number
  const validatePhone = () => {
    const digits = phone.replace(/\D/g, '');

    if (!digits) {
      setPhoneError(t('auth.phoneRequired'));
      return false;
    }

    if (digits.length !== 9) {
      setPhoneError(t('auth.invalidPhone'));
      return false;
    }

    return true;
  };

  // Get full phone number with country code (no + prefix)
  const getFullPhone = () => {
    return `998${phone}`;
  };

  // Handle send code
  const handleSendCode = async () => {
    if (!validatePhone()) return;

    try {
      setIsSendingCode(true);
      setServerError('');

      await authApi.requestSmsCode(getFullPhone());

      setStep('otp');
      setResendTimer(RESEND_TIMEOUT);
    } catch (error) {
      setServerError(error.message || t('common.error'));
    } finally {
      setIsSendingCode(false);
    }
  };

  // Handle OTP change
  const handleOtpChange = (code) => {
    setOtpCode(code);
    setOtpError('');
  };

  // Handle OTP verify
  const handleOtpVerify = async () => {
    const code = otpCode;
    try {
      setIsVerifying(true);
      setOtpError('');
      setServerError('');

      const response = await authApi.verifySmsCode(getFullPhone(), code);

      const inner = response.data || response;
      const accessToken = inner.access_token || inner.accessToken;
      const refreshToken = inner.refresh_token || inner.refreshToken;
      const registrationRequired = inner.registration_required || inner.registrationRequired;

      // Store tokens in cookie and state
      if (accessToken) {
        Cookies.set('accessToken', accessToken, { expires: 7 });
      }
      if (refreshToken) {
        Cookies.set('refreshToken', refreshToken, { expires: 30 });
      }
      setTokens({ accessToken, refreshToken });

      if (registrationRequired) {
        // New user — show registration form
        setStep('register');
        setIsVerifying(false);
      } else {
        // Existing user — fetch profile and login
        const profileData = await authApi.getProfile();
        login(profileData, accessToken, refreshToken);

        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } catch (error) {
      setOtpError(t('auth.invalidCode'));
      setIsVerifying(false);
    }
  };

  // Validate registration form
  const validateRegForm = () => {
    const errors = {};

    if (!regForm.username.trim()) {
      errors.username = t('auth.usernameRequired');
    }
    if (!regForm.firstname.trim()) {
      errors.firstname = t('auth.firstNameRequired');
    }
    if (!regForm.lastname.trim()) {
      errors.lastname = t('auth.lastNameRequired');
    }
    if (!regForm.email.trim()) {
      errors.email = t('auth.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regForm.email)) {
      errors.email = t('auth.invalidEmail');
    }
    if (!regForm.password) {
      errors.password = t('auth.passwordRequired');
    } else if (regForm.password.length < 6) {
      errors.password = t('auth.passwordMin');
    }

    setRegErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle registration form change
  const handleRegChange = (field, value) => {
    setRegForm(prev => ({ ...prev, [field]: value }));
    if (regErrors[field]) {
      setRegErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle complete registration
  const handleCompleteRegistration = async () => {
    if (!validateRegForm()) return;

    try {
      setIsRegistering(true);
      setServerError('');

      const tokenHeader = { headers: { Authorization: `Bearer ${tokens.accessToken}` } };

      await authApi.completeRegistration(regForm, tokenHeader);

      // Fetch profile and login
      const profileData = await authApi.getProfile();
      login(profileData, tokens.accessToken, tokens.refreshToken);

      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      if (error.fieldErrors) {
        setRegErrors(error.fieldErrors);
      } else {
        setServerError(error.message || t('common.error'));
      }
    } finally {
      setIsRegistering(false);
    }
  };

  // Handle resend code
  const handleResendCode = async () => {
    if (resendTimer > 0) return;

    try {
      setIsSendingCode(true);
      setServerError('');
      setOtpError('');

      await authApi.resendSmsCode(getFullPhone());

      setResendTimer(RESEND_TIMEOUT);
    } catch (error) {
      setServerError(error.message || t('common.error'));
    } finally {
      setIsSendingCode(false);
    }
  };

  // Handle change number
  const handleChangeNumber = () => {
    setStep('phone');
    setOtpError('');
    setServerError('');
  };

  // Format timer as M:SS
  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">
              {step === 'register' ? t('auth.completeRegistration') : t('auth.welcomeBack')}
            </h1>
            <p className="text-slate-600">
              {step === 'register' ? t('auth.completeRegSubtitle') : t('auth.signInSubtitle')}
            </p>
          </motion.div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          {/* Server Error */}
          <AnimatePresence>
            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-sm text-red-600 text-center">{serverError}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {step === 'phone' && (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Phone Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                    <DevicePhoneMobileIcon className="w-8 h-8 text-indigo-600" />
                  </div>
                </div>

                {/* Phone Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('auth.phoneNumber')}
                  </label>
                  <div className="flex">
                    <div className="flex items-center px-4 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg">
                      <span className="text-slate-600 font-medium">+998</span>
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={formatPhoneDisplay(phone)}
                      onChange={handlePhoneChange}
                      placeholder="90 123 45 67"
                      className={`
                        flex-1 px-4 py-3 border rounded-r-lg
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                        transition-colors
                        ${phoneError ? 'border-red-500 bg-red-50' : 'border-slate-300'}
                      `}
                      disabled={isSendingCode}
                    />
                  </div>
                  {phoneError && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-600"
                    >
                      {phoneError}
                    </motion.p>
                  )}
                </div>

                {/* Send Code Button */}
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={handleSendCode}
                  disabled={isSendingCode}
                  className="w-full"
                >
                  {isSendingCode ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      {t('auth.sendingCode')}
                    </span>
                  ) : (
                    t('auth.sendCode')
                  )}
                </Button>
              </motion.div>
            )}

            {step === 'otp' && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Back Button */}
                <button
                  type="button"
                  onClick={handleChangeNumber}
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  <span className="text-sm">{t('auth.changeNumber')}</span>
                </button>

                {/* Success Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="w-10 h-10 text-green-600" />
                  </div>
                </div>

                {/* OTP Info */}
                <div className="text-center mb-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-2">
                    {t('auth.enterVerificationCode')}
                  </h2>
                  <p className="text-sm text-slate-600">
                    {t('auth.codeSentTo')}
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    +998 {formatPhoneDisplay(phone)}
                  </p>
                </div>

                {/* OTP Input */}
                <div className="mb-6">
                  <OTPInput
                    length={6}
                    onChange={handleOtpChange}
                    error={otpError}
                    disabled={isVerifying}
                  />
                </div>

                {/* Verify Button */}
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={handleOtpVerify}
                  disabled={otpCode.length !== 6 || isVerifying}
                  className="w-full mb-6"
                >
                  {isVerifying ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      {t('auth.verifying')}
                    </span>
                  ) : (
                    t('auth.verifyCode')
                  )}
                </Button>

                {/* Resend Code */}
                <div className="text-center">
                  {resendTimer > 0 ? (
                    <p className="text-sm text-slate-500">
                      {t('auth.resendIn')} {formatTimer(resendTimer)}
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={isSendingCode}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors disabled:opacity-50"
                    >
                      {isSendingCode ? t('auth.sendingCode') : t('auth.resendCode')}
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {step === 'register' && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Register Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                    <UserPlusIcon className="w-8 h-8 text-indigo-600" />
                  </div>
                </div>

                {/* Registration Form */}
                <div className="space-y-4">
                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {t('auth.username')}
                    </label>
                    <input
                      type="text"
                      value={regForm.username}
                      onChange={(e) => handleRegChange('username', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${regErrors.username ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                      disabled={isRegistering}
                    />
                    {regErrors.username && (
                      <p className="mt-1 text-xs text-red-600">{regErrors.username}</p>
                    )}
                  </div>

                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {t('auth.firstName')}
                    </label>
                    <input
                      type="text"
                      value={regForm.firstname}
                      onChange={(e) => handleRegChange('firstname', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${regErrors.firstname ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                      disabled={isRegistering}
                    />
                    {regErrors.firstname && (
                      <p className="mt-1 text-xs text-red-600">{regErrors.firstname}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {t('auth.lastName')}
                    </label>
                    <input
                      type="text"
                      value={regForm.lastname}
                      onChange={(e) => handleRegChange('lastname', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${regErrors.lastname ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                      disabled={isRegistering}
                    />
                    {regErrors.lastname && (
                      <p className="mt-1 text-xs text-red-600">{regErrors.lastname}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {t('auth.email')}
                    </label>
                    <input
                      type="email"
                      value={regForm.email}
                      onChange={(e) => handleRegChange('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${regErrors.email ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                      disabled={isRegistering}
                    />
                    {regErrors.email && (
                      <p className="mt-1 text-xs text-red-600">{regErrors.email}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {t('auth.password')}
                    </label>
                    <input
                      type="password"
                      value={regForm.password}
                      onChange={(e) => handleRegChange('password', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${regErrors.password ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                      disabled={isRegistering}
                    />
                    {regErrors.password && (
                      <p className="mt-1 text-xs text-red-600">{regErrors.password}</p>
                    )}
                  </div>
                </div>

                {/* Save Button */}
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={handleCompleteRegistration}
                  disabled={isRegistering}
                  className="w-full mt-6"
                >
                  {isRegistering ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      {t('auth.registerSaving')}
                    </span>
                  ) : (
                    t('auth.registerSave')
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Text */}
        <p className="mt-6 text-center text-xs text-slate-400">
          {t('auth.agreeToTerms')}{' '}
          <a href="#terms" className="underline hover:text-slate-600">
            {t('auth.termsOfService')}
          </a>{' '}
          {t('auth.and')}{' '}
          <a href="#privacy" className="underline hover:text-slate-600">
            {t('auth.privacyPolicy')}
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
