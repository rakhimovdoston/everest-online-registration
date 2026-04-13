import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, UserPlusIcon } from '@heroicons/react/24/solid';
import { authApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

const SpinnerIcon = () => (
  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const StepIndicator = ({ current }) => (
  <div className="flex items-center justify-center mb-6">
    <div className="flex items-center gap-2">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${current >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>1</div>
      <div className={`w-16 h-0.5 transition-colors ${current >= 2 ? 'bg-indigo-400' : 'bg-slate-200'}`} />
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${current >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>2</div>
    </div>
  </div>
);

const CompleteProfileModal = ({ onComplete }) => {
  const { t } = useTranslation();
  const { updateUser } = useAuth();

  const [step, setStep] = useState('register1');
  const [regForm, setRegForm] = useState({ username: '', firstname: '', lastname: '', email: '', password: '' });
  const [regErrors, setRegErrors] = useState({});
  const [usernameStatus, setUsernameStatus] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [serverError, setServerError] = useState('');

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

  const handleRegChange = (field, value) => {
    setRegForm(prev => ({ ...prev, [field]: value }));
    if (regErrors[field]) setRegErrors(prev => ({ ...prev, [field]: '' }));
  };

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

  const validateStep2 = () => {
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

  const handleCompleteRegistration = async () => {
    if (!validateStep2()) return;
    if (usernameStatus !== 'available') return;

    try {
      setIsRegistering(true);
      setServerError('');
      await authApi.completeRegistration(regForm);
      const profileData = await authApi.getProfile();
      updateUser(profileData);
      onComplete();
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

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                {/* Header */}
                <div className="bg-indigo-600 px-6 py-5 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <UserPlusIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <Dialog.Title className="text-lg font-bold">
                        {step === 'register1' ? t('auth.register1Title') : t('auth.register2Title')}
                      </Dialog.Title>
                      <p className="text-indigo-200 text-sm">
                        {step === 'register1' ? t('auth.register1Subtitle') : t('auth.register2Subtitle')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Server Error */}
                  <AnimatePresence>
                    {serverError && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                      >
                        <p className="text-sm text-red-600 text-center">{serverError}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence mode="wait">
                    {/* ── Step 1: firstname / lastname / email ── */}
                    {step === 'register1' && (
                      <motion.div
                        key="register1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.25 }}
                      >
                        <StepIndicator current={1} />

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.firstName')}</label>
                            <input
                              type="text"
                              value={regForm.firstname}
                              onChange={(e) => handleRegChange('firstname', e.target.value)}
                              placeholder={t('auth.firstName')}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${regErrors.firstname ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                              autoFocus
                            />
                            {regErrors.firstname && <p className="mt-1 text-xs text-red-600">{regErrors.firstname}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.lastName')}</label>
                            <input
                              type="text"
                              value={regForm.lastname}
                              onChange={(e) => handleRegChange('lastname', e.target.value)}
                              placeholder={t('auth.lastName')}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${regErrors.lastname ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                            />
                            {regErrors.lastname && <p className="mt-1 text-xs text-red-600">{regErrors.lastname}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.email')}</label>
                            <input
                              type="email"
                              value={regForm.email}
                              onChange={(e) => handleRegChange('email', e.target.value)}
                              placeholder={t('auth.email')}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${regErrors.email ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                            />
                            {regErrors.email && <p className="mt-1 text-xs text-red-600">{regErrors.email}</p>}
                          </div>
                        </div>

                        <Button type="button" variant="primary" size="lg" onClick={handleNextStep} className="w-full mt-6">
                          {t('auth.registerNext')}
                        </Button>
                      </motion.div>
                    )}

                    {/* ── Step 2: username / password ── */}
                    {step === 'register2' && (
                      <motion.div
                        key="register2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                      >
                        <StepIndicator current={2} />

                        <button
                          type="button"
                          onClick={handleBackToStep1}
                          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-5 transition-colors"
                        >
                          <ArrowLeftIcon className="w-4 h-4" />
                          <span className="text-sm">{t('auth.registerBack')}</span>
                        </button>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.username')}</label>
                            <div className="relative">
                              <input
                                type="text"
                                value={regForm.username}
                                onChange={(e) => handleRegChange('username', e.target.value)}
                                placeholder={t('auth.usernamePlaceholder')}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors pr-10
                                  ${regErrors.username ? 'border-red-500 bg-red-50' :
                                    usernameStatus === 'available' ? 'border-green-500 bg-green-50/30' :
                                    usernameStatus === 'taken' ? 'border-red-500 bg-red-50' :
                                    'border-slate-300'}`}
                                disabled={isRegistering}
                                autoFocus
                              />
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {usernameStatus === 'checking' && <SpinnerIcon />}
                                {usernameStatus === 'available' && <CheckCircleIcon className="h-5 w-5 text-green-500" />}
                                {usernameStatus === 'taken' && <XMarkIcon className="h-5 w-5 text-red-500" />}
                              </div>
                            </div>
                            {!regErrors.username && usernameStatus === 'available' && <p className="mt-1 text-xs text-green-600">{t('auth.usernameAvailable')}</p>}
                            {!regErrors.username && usernameStatus === 'taken' && <p className="mt-1 text-xs text-red-600">{t('auth.usernameTaken')}</p>}
                            {!regErrors.username && usernameStatus === 'checking' && <p className="mt-1 text-xs text-slate-400">{t('auth.usernameChecking')}</p>}
                            {regErrors.username && <p className="mt-1 text-xs text-red-600">{regErrors.username}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.password')}</label>
                            <input
                              type="password"
                              value={regForm.password}
                              onChange={(e) => handleRegChange('password', e.target.value)}
                              placeholder={t('auth.passwordPlaceholder')}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${regErrors.password ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CompleteProfileModal;
