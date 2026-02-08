import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Button from '../../components/ui/Button';

const Step6Payment = () => {
  const navigate = useNavigate();
  const [registrationData, setRegistrationData] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('testRegistration');
    if (!savedData) {
      navigate('/test-registration');
      return;
    }
    const data = JSON.parse(savedData);
    if (!data.personalInfo || !data.testDates || !data.speakingDates) {
      navigate('/test-registration/speaking');
      return;
    }
    setRegistrationData(data);
  }, [navigate]);

  const handleBack = () => {
    navigate('/test-registration/review');
  };

  const handlePaymentMethod = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      alert("Iltimos, to'lov usulini tanlang!");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In real app, here you would:
    // 1. Call payment API based on selected method
    // 2. Redirect to payment gateway
    // 3. Handle callback/webhook
    // 4. Update registration status

    console.log('Payment initiated with:', selectedPaymentMethod);
    console.log('Registration data:', registrationData);

    setIsSuccess(true);
    setIsProcessing(false);

    // Clear localStorage
    localStorage.removeItem('testRegistration');

    // Redirect after 3 seconds
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' UZS';
  };

  const paymentMethods = [
    {
      id: 'payme',
      name: 'Payme',
      logo: '💳',
      description: 'Payme orqali to\'lash',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'click',
      name: 'Click',
      logo: '💰',
      description: 'Click orqali to\'lash',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'uzum',
      name: 'Uzum',
      logo: '🟣',
      description: 'Uzum Bank orqali to\'lash',
      color: 'from-violet-500 to-purple-500'
    }
  ];

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
              Muvaffaqiyatli Ro'yxatdan O'tdingiz!
            </h2>
            <p className="text-slate-700 mb-2">
              Test uchun ro'yxatdan o'tishingiz va to'lovingiz tasdiqlandi
            </p>
            <p className="text-sm text-slate-600 mb-6">
              Tez orada siz bilan bog'lanamiz
            </p>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-indigo-700 mb-1">To'lov summa:</p>
              <p className="text-2xl font-bold text-indigo-900">
                {formatPrice(registrationData?.package?.price || 0)}
              </p>
            </div>
            <p className="text-xs text-slate-400">
              Avtomatik ravishda bosh sahifaga yo'naltirilmoqda...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!registrationData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white">
                <CheckCircleSolidIcon className="w-6 h-6" />
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Paket</span>
            </div>
            <div className="w-12 h-0.5 bg-green-600" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white">
                <CheckCircleSolidIcon className="w-6 h-6" />
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Filial</span>
            </div>
            <div className="w-12 h-0.5 bg-green-600" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white">
                <CheckCircleSolidIcon className="w-6 h-6" />
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Test</span>
            </div>
            <div className="w-12 h-0.5 bg-green-600" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white">
                <CheckCircleSolidIcon className="w-6 h-6" />
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Speaking</span>
            </div>
            <div className="w-12 h-0.5 bg-green-600" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white">
                <CheckCircleSolidIcon className="w-6 h-6" />
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Ko'rish</span>
            </div>
            <div className="w-12 h-0.5 bg-indigo-600" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-semibold">
                6
              </div>
              <span className="ml-2 text-sm font-medium text-indigo-600">To'lov</span>
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
            To'lov Usulini Tanlang
          </h1>
          <p className="text-slate-600">
            Xavfsiz to'lov tizimlaridan birini tanlang
          </p>
        </motion.div>

        {/* Payment Amount */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white text-center"
        >
          <p className="text-lg mb-2 opacity-90">To'lov summa</p>
          <p className="text-5xl font-bold mb-2">
            {formatPrice(registrationData?.package?.price || 0)}
          </p>
          <p className="text-sm opacity-75">
            {registrationData?.package?.name} paketi
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
            To'lov Usulini Tanlang
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => handlePaymentMethod(method.id)}
                className={`p-6 rounded-xl border-2 transition-all text-center ${
                  selectedPaymentMethod === method.id
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${method.color} flex items-center justify-center mx-auto mb-4 text-3xl`}>
                  {method.logo}
                </div>
                <p className={`font-bold text-xl mb-2 ${
                  selectedPaymentMethod === method.id ? 'text-indigo-900' : 'text-slate-900'
                }`}>
                  {method.name}
                </p>
                <p className="text-sm text-slate-600">
                  {method.description}
                </p>
              </button>
            ))}
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Xavfsiz To'lov
                </p>
                <p className="text-sm text-blue-700">
                  Barcha to'lovlar xavfsiz protokol orqali amalga oshiriladi. Sizning bank ma'lumotlaringiz himoyalangan.
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
            Orqaga
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
                To'lov amalga oshirilmoqda...
              </span>
            ) : (
              "To'lovni Amalga Oshirish"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step6Payment;
