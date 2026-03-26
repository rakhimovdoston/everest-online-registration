import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Button from '../../components/ui/Button';
import { bookingApi } from '../../services/api';

const Step6Payment = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const { t } = useTranslation();
  const [bookingData, setBookingData] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState(null);

  useEffect(() => {
    if (!bookingId) {
      navigate('/test-registration');
      return;
    }

    setIsLoading(true);
    bookingApi.getPaymentMethods(bookingId)
      .then((response) => {
        const data = response.data || response;
        setBookingData({
          packageName: data.packageName,
          packagePrice: data.packagePrice,
          packageDescription: data.packageDescription,
          totalSessions: data.totalSessions,
          speakingSessions: data.speakingSessions,
        });
        const methods = data.methods || [];
        setPaymentMethods(Array.isArray(methods) ? methods : []);
      })
      .catch((err) => {
        console.error('Error fetching payment methods:', err);
        setPaymentMethods([]);
        setError(err.message || t('testRegistration.step6.paymentError'));
        if (err.fieldErrors) setFieldErrors(err.fieldErrors);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [navigate, bookingId]);

  const handleBack = () => {
    navigate('/test-registration/review');
  };

  const handlePaymentMethod = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      alert(t('testRegistration.step6.selectMethodAlert'));
      return;
    }

    setIsProcessing(true);
    setError('');
    setFieldErrors(null);

    try {
      await bookingApi.makePayment(Number(bookingId), selectedPaymentMethod);

      setIsSuccess(true);

      // Clear localStorage
      localStorage.removeItem('testRegistration');

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || t('testRegistration.step6.paymentError'));
      if (err.fieldErrors) setFieldErrors(err.fieldErrors);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' UZS';
  };

  const methodStyles = {
    payme: { logo: '💳', color: 'from-blue-500 to-cyan-500' },
    click: { logo: '💰', color: 'from-purple-500 to-pink-500' },
    uzum: { logo: '🟣', color: 'from-violet-500 to-purple-500' },
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircleIcon className="w-12 h-12 text-green-600" />
            </motion.div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">
              {t('testRegistration.step6.success')}
            </h2>
            <p className="text-slate-700 mb-2">
              {t('testRegistration.step6.successMessage')}
            </p>
            <p className="text-sm text-slate-600 mb-6">
              {t('testRegistration.step6.contactSoon')}
            </p>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-indigo-700 mb-1">{t('testRegistration.step6.paymentAmount')}:</p>
              <p className="text-2xl font-bold text-indigo-900">
                {formatPrice(bookingData?.packagePrice || 0)}
              </p>
            </div>
            <p className="text-xs text-slate-400">
              {t('testRegistration.step6.redirecting')}
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-slate-600 mt-4">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!bookingData && !error && !fieldErrors) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Error Message - top of page */}
        {(error || fieldErrors) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            {error && <p className="text-sm font-medium text-red-700">{error}</p>}
            {fieldErrors && (
              <ul className={`text-sm text-red-600 space-y-1 ${error ? 'mt-2' : ''}`}>
                {Object.entries(fieldErrors).map(([field, message]) => (
                  <li key={field}>• {message}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {bookingData && (<>
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white">
                <CheckCircleSolidIcon className="w-6 h-6" />
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">{t('testRegistration.progress.package')}</span>
            </div>
            <div className="w-12 h-0.5 bg-green-600" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white">
                <CheckCircleSolidIcon className="w-6 h-6" />
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">{t('testRegistration.progress.branch')}</span>
            </div>
            <div className="w-12 h-0.5 bg-green-600" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white">
                <CheckCircleSolidIcon className="w-6 h-6" />
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">{t('testRegistration.progress.test')}</span>
            </div>
            <div className="w-12 h-0.5 bg-green-600" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white">
                <CheckCircleSolidIcon className="w-6 h-6" />
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">{t('testRegistration.progress.speaking')}</span>
            </div>
            <div className="w-12 h-0.5 bg-green-600" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white">
                <CheckCircleSolidIcon className="w-6 h-6" />
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">{t('testRegistration.progress.view')}</span>
            </div>
            <div className="w-12 h-0.5 bg-indigo-600" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-semibold">
                6
              </div>
              <span className="ml-2 text-sm font-medium text-indigo-600">{t('testRegistration.progress.payment')}</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">
            {t('testRegistration.step6.title')}
          </h1>
          <p className="text-slate-600">
            {t('testRegistration.step6.subtitle')}
          </p>
        </motion.div>

        {/* Payment Amount */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white text-center"
        >
          <p className="text-lg mb-2 opacity-90">{t('testRegistration.step6.paymentAmount')}</p>
          <p className="text-5xl font-bold mb-2">
            {formatPrice(bookingData.packagePrice || 0)}
          </p>
          <p className="text-sm opacity-75">
            {bookingData.packageName} {t('testRegistration.step6.package')}
          </p>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 mb-6"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-6">
            {t('testRegistration.step6.selectMethod')}
          </h2>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-slate-600 mt-3">{t('common.loading')}</p>
            </div>
          ) : paymentMethods.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p>{t('testRegistration.step6.noMethods')}</p>
            </div>
          ) : (
            <div className={`grid gap-4 ${paymentMethods.length >= 3 ? 'md:grid-cols-3' : paymentMethods.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-1 max-w-sm mx-auto'}`}>
              {paymentMethods.map((method) => {
                const methodId = method.id || method.key || method.name?.toLowerCase();
                const style = methodStyles[methodId] || { logo: '💳', color: 'from-slate-400 to-slate-500' };

                return (
                  <button
                    key={methodId}
                    type="button"
                    onClick={() => handlePaymentMethod(methodId)}
                    className={`p-6 rounded-xl border-2 transition-all text-center ${
                      selectedPaymentMethod === methodId
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${style.color} flex items-center justify-center mx-auto mb-4 text-3xl`}>
                      {method.logo || style.logo}
                    </div>
                    <p className={`font-bold text-xl mb-2 ${
                      selectedPaymentMethod === methodId ? 'text-indigo-900' : 'text-slate-900'
                    }`}>
                      {method.name || methodId}
                    </p>
                    {method.description && (
                      <p className="text-sm text-slate-600">
                        {method.description}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 mb-1">
                  {t('testRegistration.step6.securePayment')}
                </p>
                <p className="text-sm text-blue-700">
                  {t('testRegistration.step6.securePaymentDesc')}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="secondary"
            size="lg"
            onClick={handleBack}
            disabled={isProcessing}
          >
            {t('testRegistration.common.back')}
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handlePayment}
            disabled={isProcessing || !selectedPaymentMethod}
          >
            {isProcessing ? (
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
                {t('testRegistration.step6.processing')}
              </span>
            ) : (
              t('testRegistration.step6.pay')
            )}
          </Button>
        </div>
        </>)}
      </div>
    </div>
  );
};

export default Step6Payment;
