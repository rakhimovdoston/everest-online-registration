import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthModal } from '../../contexts/AuthModalContext';
import { authApi, setAuthToken } from '../../services/api';
import OTPInput from '../forms/OTPInput';
import Button from '../ui/Button';
import { XMarkIcon, ArrowLeftIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, UserPlusIcon } from '@heroicons/react/24/solid';
import { offertaPdf } from '../../assets';

const RESEND_TIMEOUT = 120; // 2 minutes

const LoginModal = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { isOpen, closeLoginModal, onLoginSuccess } = useAuthModal();

  // Form state: 'phone' | 'otp' | 'register1' | 'register2'
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Loading states
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // OTP state
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // Registration form state
  const [regForm, setRegForm] = useState({ username: '', firstname: '', lastname: '', email: '', password: '' });
  const [regErrors, setRegErrors] = useState({});

  // Username availability: null | 'checking' | 'available' | 'taken'
  const [usernameStatus, setUsernameStatus] = useState(null);

  // Server error / success
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('phone');
        setPhone('');
        setPhoneError('');
        setOtpCode('');
        setOtpError('');
        setServerError('');
        setResendTimer(0);
        setRegForm({ username: '', firstname: '', lastname: '', email: '', password: '' });
        setRegErrors({});
        setUsernameStatus(null);
        setIsVerifying(false);
        setSuccessMessage('');
      }, 300);
    }
  }, [isOpen]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Username availability check with debounce
  useEffect(() => {
    if (step !== 'register2') return;
    const username = regForm.username.trim();
    if (!username || username.length < 3) {
      setUsernameStatus(null);
      return;
    }
    setUsernameStatus('checking');
    const timer = setTimeout(async () => {
      try {
        await authApi.checkUsername(username);
        setUsernameStatus('available');
      } catch {
        setUsernameStatus('taken');
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [regForm.username, step]);

  // Format phone number for display
  const formatPhoneDisplay = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    if (digits.length <= 7) return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
    return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`;
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^\d\s]/g, '');
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 9) {
      setPhone(digits);
      setPhoneError('');
    }
  };

  const validatePhone = () => {
    const digits = phone.replace(/\D/g, '');
    if (!digits) { setPhoneError(t('auth.phoneRequired')); return false; }
    if (digits.length !== 9) { setPhoneError(t('auth.invalidPhone')); return false; }
    return true;
  };

  const getFullPhone = () => `998${phone}`;

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

  const handleOtpChange = (code) => {
    setOtpCode(code);
    setOtpError('');
  };

  const handleOtpVerify = async () => {
    try {
      setIsVerifying(true);
      setOtpError('');
      setServerError('');

      const response = await authApi.verifySmsCode(getFullPhone(), otpCode);
      const inner = response.data || response;
      const accessToken = inner.access_token || inner.accessToken;
      const refreshToken = inner.refresh_token || inner.refreshToken;
      const registrationRequired = inner.registration_required || inner.registrationRequired;

      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        setAuthToken(accessToken);
      }
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      if (registrationRequired) {
        setStep('register1');
      } else {
        const profileData = await authApi.getProfile();
        login(profileData, accessToken, refreshToken);
        onLoginSuccess();
      }
    } catch (error) {
      setOtpError(t('auth.invalidCode'));
    } finally {
      setIsVerifying(false);
    }
  };

  // Validate step 1 fields (firstname, lastname, email)
  const validateStep1 = () => {
    const errors = {};
    if (!regForm.firstname.trim()) errors.firstname = t('auth.firstNameRequired');
    if (!regForm.lastname.trim()) errors.lastname = t('auth.lastNameRequired');
    if (!regForm.email.trim()) {
      errors.email = t('auth.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regForm.email)) {
      errors.email = t('auth.invalidEmail');
    }
    setRegErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (!validateStep1()) return;
    setStep('register2');
    setServerError('');
    setRegErrors({});
  };

  const handleBackToStep1 = () => {
    setStep('register1');
    setServerError('');
    setRegErrors({});
  };

  // Full validation for final submission
  const validateRegForm = () => {
    const errors = {};
    if (!regForm.username.trim()) errors.username = t('auth.usernameRequired');
    if (!regForm.password) {
      errors.password = t('auth.passwordRequired');
    } else if (regForm.password.length < 6) {
      errors.password = t('auth.passwordMin');
    }
    setRegErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegChange = (field, value) => {
    setRegForm(prev => ({ ...prev, [field]: value }));
    if (regErrors[field]) {
      setRegErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCompleteRegistration = async () => {
    if (!validateRegForm()) return;
    if (usernameStatus !== 'available') return;

    try {
      setIsRegistering(true);
      setServerError('');

      const result = await authApi.completeRegistration(regForm);

      if (result?.success === true || result?.code === 200) {
        const profileData = await authApi.getProfile();
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        login(profileData, accessToken, refreshToken);
        onLoginSuccess();
      } else {
        setServerError(result?.message || t('common.error'));
      }
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

  const handleChangeNumber = () => {
    setStep('phone');
    setOtpError('');
    setServerError('');
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isRegisterStep = step === 'register1' || step === 'register2';

  const handleDialogClose = () => {
    if (isRegisterStep) return;
    closeLoginModal();
  };

  const getModalTitle = () => {
    if (step === 'register1') return t('auth.register1Title');
    if (step === 'register2') return t('auth.register2Title');
    return t('auth.welcomeBack');
  };

  const getModalSubtitle = () => {
    if (step === 'register1') return t('auth.register1Subtitle');
    if (step === 'register2') return t('auth.register2Subtitle');
    return t('auth.signInSubtitle');
  };

  const SpinnerIcon = () => (
    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  const StepIndicator = ({ current }) => (
    <div className="flex items-center justify-center mb-5">
      <div className="flex items-center gap-2">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${current >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>1</div>
        <div className={`w-16 h-0.5 transition-colors ${current >= 2 ? 'bg-indigo-400' : 'bg-slate-200'}`} />
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${current >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>2</div>
      </div>
    </div>
  );

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleDialogClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                {/* Close Button — hidden during registration steps */}
                {!isRegisterStep && (
                  <button
                    type="button"
                    onClick={closeLoginModal}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                )}

                <div className="p-8">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <Dialog.Title className="text-2xl font-bold text-slate-900 mb-1">
                      {getModalTitle()}
                    </Dialog.Title>
                    <p className="text-sm text-slate-600">{getModalSubtitle()}</p>
                  </div>

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

                  {/* Success Message */}
                  <AnimatePresence>
                    {successMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <p className="text-sm text-green-700 text-center">{successMessage}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence mode="wait">
                    {/* ── Step: Phone ── */}
                    {step === 'phone' && (
                      <motion.div
                        key="phone"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex justify-center mb-6">
                          <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center">
                            <DevicePhoneMobileIcon className="w-7 h-7 text-indigo-600" />
                          </div>
                        </div>

                        <div className="mb-6">
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            {t('auth.phoneNumber')}
                          </label>
                          <div className="flex">
                            <div className="flex items-center px-3 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg">
                              <span className="text-slate-600 font-medium text-sm">+998</span>
                            </div>
                            <input
                              type="tel"
                              inputMode="numeric"
                              value={formatPhoneDisplay(phone)}
                              onChange={handlePhoneChange}
                              placeholder="90 123 45 67"
                              className={`flex-1 px-3 py-2.5 border rounded-r-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${phoneError ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                              disabled={isSendingCode}
                              autoFocus
                            />
                          </div>
                          {phoneError && (
                            <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-sm text-red-600">
                              {phoneError}
                            </motion.p>
                          )}
                        </div>

                        <Button type="button" variant="primary" size="lg" onClick={handleSendCode} disabled={isSendingCode} className="w-full">
                          {isSendingCode ? <span className="flex items-center justify-center gap-2"><SpinnerIcon />{t('auth.sendingCode')}</span> : t('auth.sendCode')}
                        </Button>
                      </motion.div>
                    )}

                    {/* ── Step: OTP ── */}
                    {step === 'otp' && (
                      <motion.div
                        key="otp"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <button type="button" onClick={handleChangeNumber} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors">
                          <ArrowLeftIcon className="w-4 h-4" />
                          <span className="text-sm">{t('auth.changeNumber')}</span>
                        </button>

                        <div className="flex justify-center mb-4">
                          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircleIcon className="w-8 h-8 text-green-600" />
                          </div>
                        </div>

                        <div className="text-center mb-5">
                          <h3 className="text-base font-semibold text-slate-900 mb-1">{t('auth.enterVerificationCode')}</h3>
                          <p className="text-sm text-slate-600">{t('auth.codeSentTo')}</p>
                          <p className="text-sm font-medium text-slate-900">+998 {formatPhoneDisplay(phone)}</p>
                        </div>

                        <div className="mb-5">
                          <OTPInput length={6} onChange={handleOtpChange} error={otpError} disabled={isVerifying} />
                        </div>

                        <Button type="button" variant="primary" size="lg" onClick={handleOtpVerify} disabled={otpCode.length !== 6 || isVerifying} className="w-full mb-5">
                          {isVerifying ? <span className="flex items-center justify-center gap-2"><SpinnerIcon />{t('auth.verifying')}</span> : t('auth.verifyCode')}
                        </Button>

                        <div className="text-center">
                          {resendTimer > 0 ? (
                            <p className="text-sm text-slate-500">{t('auth.resendIn')} {formatTimer(resendTimer)}</p>
                          ) : (
                            <button type="button" onClick={handleResendCode} disabled={isSendingCode} className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors disabled:opacity-50">
                              {isSendingCode ? t('auth.sendingCode') : t('auth.resendCode')}
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* ── Register Step 1: firstname / lastname / email ── */}
                    {step === 'register1' && (
                      <motion.div
                        key="register1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <StepIndicator current={1} />

                        <div className="flex justify-center mb-4">
                          <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center">
                            <UserPlusIcon className="w-7 h-7 text-indigo-600" />
                          </div>
                        </div>

                        <div className="space-y-4">
                          {/* First Name */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.firstName')}</label>
                            <input
                              type="text"
                              value={regForm.firstname}
                              onChange={(e) => handleRegChange('firstname', e.target.value)}
                              placeholder={t('auth.firstName')}
                              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${regErrors.firstname ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                              autoFocus
                            />
                            {regErrors.firstname && <p className="mt-1 text-xs text-red-600">{regErrors.firstname}</p>}
                          </div>

                          {/* Last Name */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.lastName')}</label>
                            <input
                              type="text"
                              value={regForm.lastname}
                              onChange={(e) => handleRegChange('lastname', e.target.value)}
                              placeholder={t('auth.lastName')}
                              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${regErrors.lastname ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                            />
                            {regErrors.lastname && <p className="mt-1 text-xs text-red-600">{regErrors.lastname}</p>}
                          </div>

                          {/* Email */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.email')}</label>
                            <input
                              type="email"
                              value={regForm.email}
                              onChange={(e) => handleRegChange('email', e.target.value)}
                              placeholder={t('auth.email')}
                              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${regErrors.email ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                            />
                            {regErrors.email && <p className="mt-1 text-xs text-red-600">{regErrors.email}</p>}
                          </div>
                        </div>

                        <Button type="button" variant="primary" size="lg" onClick={handleNextStep} className="w-full mt-6">
                          {t('auth.registerNext')}
                        </Button>
                      </motion.div>
                    )}

                    {/* ── Register Step 2: username / password ── */}
                    {step === 'register2' && (
                      <motion.div
                        key="register2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <StepIndicator current={2} />

                        <button type="button" onClick={handleBackToStep1} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors">
                          <ArrowLeftIcon className="w-4 h-4" />
                          <span className="text-sm">{t('auth.registerBack')}</span>
                        </button>

                        <div className="space-y-4">
                          {/* Username */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.username')}</label>
                            <div className="relative">
                              <input
                                type="text"
                                value={regForm.username}
                                onChange={(e) => handleRegChange('username', e.target.value)}
                                placeholder={t('auth.usernamePlaceholder')}
                                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors pr-9
                                  ${regErrors.username ? 'border-red-500 bg-red-50' :
                                    usernameStatus === 'available' ? 'border-green-500 bg-green-50/30' :
                                    usernameStatus === 'taken' ? 'border-red-500 bg-red-50' :
                                    'border-slate-300'}`}
                                disabled={isRegistering}
                                autoFocus
                              />
                              {/* Status indicator icon */}
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {usernameStatus === 'checking' && (
                                  <svg className="animate-spin h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                )}
                                {usernameStatus === 'available' && (
                                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                )}
                                {usernameStatus === 'taken' && (
                                  <XMarkIcon className="h-4 w-4 text-red-500" />
                                )}
                              </div>
                            </div>
                            {/* Feedback text */}
                            {!regErrors.username && usernameStatus === 'available' && (
                              <p className="mt-1 text-xs text-green-600">{t('auth.usernameAvailable')}</p>
                            )}
                            {!regErrors.username && usernameStatus === 'taken' && (
                              <p className="mt-1 text-xs text-red-600">{t('auth.usernameTaken')}</p>
                            )}
                            {!regErrors.username && usernameStatus === 'checking' && (
                              <p className="mt-1 text-xs text-slate-400">{t('auth.usernameChecking')}</p>
                            )}
                            {regErrors.username && <p className="mt-1 text-xs text-red-600">{regErrors.username}</p>}
                          </div>

                          {/* Password */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.password')}</label>
                            <input
                              type="password"
                              value={regForm.password}
                              onChange={(e) => handleRegChange('password', e.target.value)}
                              placeholder={t('auth.passwordPlaceholder')}
                              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${regErrors.password ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                              disabled={isRegistering}
                            />
                            {regErrors.password && <p className="mt-1 text-xs text-red-600">{regErrors.password}</p>}
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="primary"
                          size="lg"
                          onClick={handleCompleteRegistration}
                          disabled={isRegistering || usernameStatus === 'taken' || usernameStatus === 'checking' || usernameStatus === null}
                          className="w-full mt-6"
                        >
                          {isRegistering
                            ? <span className="flex items-center justify-center gap-2"><SpinnerIcon />{t('auth.registerSaving')}</span>
                            : t('auth.registerSave')
                          }
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="px-8 py-4 bg-slate-50 border-t border-slate-100">
                  <p className="text-center text-xs text-slate-400">
                    {t('auth.agreeToTerms')}{' '}
                    <a href={offertaPdf} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">{t('auth.termsOfService')}</a>{' '}
                    {t('auth.and')}{' '}
                    <a href={offertaPdf} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">{t('auth.privacyPolicy')}</a>
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default LoginModal;
