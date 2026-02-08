import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthModal } from '../../contexts/AuthModalContext';
import { authApi } from '../../services/api';
import OTPInput from '../forms/OTPInput';
import Button from '../ui/Button';
import { XMarkIcon, ArrowLeftIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const RESEND_TIMEOUT = 60;

const LoginModal = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { isOpen, closeLoginModal, onLoginSuccess } = useAuthModal();

  // Form state
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Loading states
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // OTP state
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // Server error
  const [serverError, setServerError] = useState('');

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('phone');
        setPhone('');
        setPhoneError('');
        setOtpError('');
        setServerError('');
        setResendTimer(0);
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

  // Format phone number for display
  const formatPhoneDisplay = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    if (digits.length <= 7) return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
    return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`;
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

  // Get full phone number with country code
  const getFullPhone = () => {
    return `+998${phone}`;
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

  // Handle OTP complete
  const handleOtpComplete = async (code) => {
    try {
      setIsVerifying(true);
      setOtpError('');
      setServerError('');

      const response = await authApi.verifySmsCode(getFullPhone(), code);

      // Store user data and token
      login(response.user, response.token);

      // Call success callback
      onLoginSuccess();
    } catch (error) {
      setOtpError(t('auth.invalidCode'));
      setIsVerifying(false);
    }
  };

  // Handle resend code
  const handleResendCode = async () => {
    if (resendTimer > 0) return;

    try {
      setIsSendingCode(true);
      setServerError('');
      setOtpError('');

      await authApi.requestSmsCode(getFullPhone());

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

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeLoginModal}>
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
                {/* Close Button */}
                <button
                  type="button"
                  onClick={closeLoginModal}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>

                <div className="p-8">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <Dialog.Title className="text-2xl font-bold text-slate-900 mb-1">
                      {t('auth.welcomeBack')}
                    </Dialog.Title>
                    <p className="text-sm text-slate-600">
                      {t('auth.signInSubtitle')}
                    </p>
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

                  <AnimatePresence mode="wait">
                    {step === 'phone' ? (
                      <motion.div
                        key="phone"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Phone Icon */}
                        <div className="flex justify-center mb-6">
                          <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center">
                            <DevicePhoneMobileIcon className="w-7 h-7 text-indigo-600" />
                          </div>
                        </div>

                        {/* Phone Input */}
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
                              className={`
                                flex-1 px-3 py-2.5 border rounded-r-lg text-sm
                                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                                transition-colors
                                ${phoneError ? 'border-red-500 bg-red-50' : 'border-slate-300'}
                              `}
                              disabled={isSendingCode}
                              autoFocus
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
                    ) : (
                      <motion.div
                        key="otp"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Back Button */}
                        <button
                          type="button"
                          onClick={handleChangeNumber}
                          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
                        >
                          <ArrowLeftIcon className="w-4 h-4" />
                          <span className="text-sm">{t('auth.changeNumber')}</span>
                        </button>

                        {/* Success Icon */}
                        <div className="flex justify-center mb-4">
                          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircleIcon className="w-8 h-8 text-green-600" />
                          </div>
                        </div>

                        {/* OTP Info */}
                        <div className="text-center mb-5">
                          <h3 className="text-base font-semibold text-slate-900 mb-1">
                            {t('auth.enterVerificationCode')}
                          </h3>
                          <p className="text-sm text-slate-600">
                            {t('auth.codeSentTo')}
                          </p>
                          <p className="text-sm font-medium text-slate-900">
                            +998 {formatPhoneDisplay(phone)}
                          </p>
                        </div>

                        {/* OTP Input */}
                        <div className="mb-5">
                          <OTPInput
                            length={6}
                            onComplete={handleOtpComplete}
                            error={otpError}
                            disabled={isVerifying}
                          />
                        </div>

                        {/* Verifying */}
                        {isVerifying && (
                          <div className="flex justify-center mb-5">
                            <div className="flex items-center gap-2 text-indigo-600">
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
                              <span className="text-sm font-medium">{t('auth.verifying')}</span>
                            </div>
                          </div>
                        )}

                        {/* Resend Code */}
                        <div className="text-center">
                          {resendTimer > 0 ? (
                            <p className="text-sm text-slate-500">
                              {t('auth.resendIn')} {resendTimer} {t('auth.seconds')}
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
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="px-8 py-4 bg-slate-50 border-t border-slate-100">
                  <p className="text-center text-xs text-slate-400">
                    {t('auth.agreeToTerms')}{' '}
                    <a href="#terms" className="underline hover:text-slate-600">
                      {t('auth.termsOfService')}
                    </a>{' '}
                    {t('auth.and')}{' '}
                    <a href="#privacy" className="underline hover:text-slate-600">
                      {t('auth.privacyPolicy')}
                    </a>
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
