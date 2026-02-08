import { useState, useEffect, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircleIcon as CheckCircleSolidIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { Dialog, Transition } from '@headlessui/react';
import { useAuth } from '../../contexts/AuthContext';
import FormInput from '../../components/forms/FormInput';
import Button from '../../components/ui/Button';
import { packagesData, branchesData } from '../../data/testData';

const detailsSchema = z.object({
  firstName: z.string().min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak"),
  lastName: z.string().min(2, "Familiya kamida 2 ta belgidan iborat bo'lishi kerak"),
  phone: z.string().regex(/^[\+]?[0-9]{9,13}$/, "Telefon raqami noto'g'ri"),
  email: z.string().email("Email noto'g'ri").optional().or(z.literal('')),
});

const Step3Details = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [registrationData, setRegistrationData] = useState(null);
  const [testDates, setTestDates] = useState([]);
  const [selectedTestDates, setSelectedTestDates] = useState([]);
  const [isLoadingTestDates, setIsLoadingTestDates] = useState(false);
  const [selectedTestTime, setSelectedTestTime] = useState('');

  // Modals
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(detailsSchema),
    mode: 'onBlur',
  });

  // Check authentication and load registration data
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?returnUrl=${encodeURIComponent(location.pathname)}`);
      return;
    }

    const savedData = localStorage.getItem('testRegistration');
    if (!savedData) {
      navigate('/test-registration');
      return;
    }
    const data = JSON.parse(savedData);
    if (!data.branch) {
      navigate('/test-registration/branch');
      return;
    }
    setRegistrationData(data);

    // Load previously selected test dates if any
    if (data.testDates) {
      setSelectedTestDates(data.testDates);
    }
  }, [isAuthenticated, navigate, location.pathname]);

  // Auto-fill form if registrationType is 'myself'
  useEffect(() => {
    if (registrationData?.registrationType === 'myself' && isAuthenticated && user) {
      if (user.firstName) setValue('firstName', user.firstName, { shouldValidate: false });
      if (user.lastName) setValue('lastName', user.lastName, { shouldValidate: false });
      if (user.email) setValue('email', user.email, { shouldValidate: false });
      if (user.phone) setValue('phone', user.phone, { shouldValidate: false });
    }
  }, [registrationData, isAuthenticated, user, setValue]);

  // Fetch test dates when branch is selected
  useEffect(() => {
    if (registrationData?.branch) {
      fetchTestDates();
    }
  }, [registrationData?.branch]);

  const fetchTestDates = async () => {
    setIsLoadingTestDates(true);
    try {
      // Mock API call - replace with real API endpoint
      // Real API: GET /api/test-dates?branchId={branchId}
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock data matching real API response format
      const mockTestDates = [
        {
          id: 8603,
          date: "2026-01-14",
          time: "morning",
          timeString: "10:00",
          existedSpace: 18,
          branchName: registrationData.branch.name,
          dayOfWeek: "WEDNESDAY"
        },
        {
          id: 8604,
          date: "2026-01-14",
          time: "afternoon",
          timeString: "14:30",
          existedSpace: 9,
          branchName: registrationData.branch.name,
          dayOfWeek: "WEDNESDAY"
        },
        {
          id: 8605,
          date: "2026-01-14",
          time: "evening",
          timeString: "18:30",
          existedSpace: 23,
          branchName: registrationData.branch.name,
          dayOfWeek: "WEDNESDAY"
        },
        {
          id: 8606,
          date: "2026-01-15",
          time: "morning",
          timeString: "10:00",
          existedSpace: 20,
          branchName: registrationData.branch.name,
          dayOfWeek: "THURSDAY"
        },
        {
          id: 8607,
          date: "2026-01-15",
          time: "afternoon",
          timeString: "14:30",
          existedSpace: 8,
          branchName: registrationData.branch.name,
          dayOfWeek: "THURSDAY"
        },
        {
          id: 8608,
          date: "2026-01-15",
          time: "evening",
          timeString: "18:30",
          existedSpace: 20,
          branchName: registrationData.branch.name,
          dayOfWeek: "THURSDAY"
        },
        {
          id: 8609,
          date: "2026-01-16",
          time: "morning",
          timeString: "10:00",
          existedSpace: 18,
          branchName: registrationData.branch.name,
          dayOfWeek: "FRIDAY"
        },
        {
          id: 8610,
          date: "2026-01-16",
          time: "afternoon",
          timeString: "14:30",
          existedSpace: 12,
          branchName: registrationData.branch.name,
          dayOfWeek: "FRIDAY"
        },
        {
          id: 8611,
          date: "2026-01-16",
          time: "evening",
          timeString: "18:30",
          existedSpace: 23,
          branchName: registrationData.branch.name,
          dayOfWeek: "FRIDAY"
        },
        {
          id: 8612,
          date: "2026-01-17",
          time: "morning",
          timeString: "10:00",
          existedSpace: 10,
          branchName: registrationData.branch.name,
          dayOfWeek: "SATURDAY"
        },
        {
          id: 8613,
          date: "2026-01-17",
          time: "afternoon",
          timeString: "14:30",
          existedSpace: 4,
          branchName: registrationData.branch.name,
          dayOfWeek: "SATURDAY"
        },
        {
          id: 8614,
          date: "2026-01-17",
          time: "evening",
          timeString: "18:30",
          existedSpace: 21,
          branchName: registrationData.branch.name,
          dayOfWeek: "SATURDAY"
        },
        {
          id: 8615,
          date: "2026-01-18",
          time: "morning",
          timeString: "11:30",
          existedSpace: 20,
          branchName: registrationData.branch.name,
          dayOfWeek: "SUNDAY"
        },
        {
          id: 8616,
          date: "2026-01-18",
          time: "afternoon",
          timeString: "14:30",
          existedSpace: 9,
          branchName: registrationData.branch.name,
          dayOfWeek: "SUNDAY"
        },
        {
          id: 8619,
          date: "2026-01-19",
          time: "morning",
          timeString: "10:00",
          existedSpace: 20,
          branchName: registrationData.branch.name,
          dayOfWeek: "MONDAY"
        },
        {
          id: 8620,
          date: "2026-01-19",
          time: "afternoon",
          timeString: "14:30",
          existedSpace: 15,
          branchName: registrationData.branch.name,
          dayOfWeek: "MONDAY"
        },
        {
          id: 8621,
          date: "2026-01-19",
          time: "evening",
          timeString: "18:30",
          existedSpace: 23,
          branchName: registrationData.branch.name,
          dayOfWeek: "MONDAY"
        },
        {
          id: 8622,
          date: "2026-01-20",
          time: "morning",
          timeString: "10:00",
          existedSpace: 18,
          branchName: registrationData.branch.name,
          dayOfWeek: "TUESDAY"
        },
        {
          id: 8623,
          date: "2026-01-20",
          time: "afternoon",
          timeString: "14:30",
          existedSpace: 11,
          branchName: registrationData.branch.name,
          dayOfWeek: "TUESDAY"
        },
        {
          id: 8624,
          date: "2026-01-20",
          time: "evening",
          timeString: "18:30",
          existedSpace: 22,
          branchName: registrationData.branch.name,
          dayOfWeek: "TUESDAY"
        }
      ];

      setTestDates(mockTestDates);
    } catch (error) {
      console.error('Error fetching test dates:', error);
    } finally {
      setIsLoadingTestDates(false);
    }
  };

  const handlePackageChange = (newPackage) => {
    const oldTotalSessions = registrationData.package.totalSessions;
    const newTotalSessions = newPackage.totalSessions;

    let updatedTestDates = [...selectedTestDates];

    if (newTotalSessions < oldTotalSessions) {
      // Kamaysa - oxirgilarini o'chirish
      updatedTestDates = updatedTestDates.slice(0, newTotalSessions);
    } else if (newTotalSessions > oldTotalSessions) {
      // Ko'paysa - eskilarini saqlash, yangilarini bo'sh qoldirish
      // Array.from bilan yangi bo'sh joylar qo'shamiz
      while (updatedTestDates.length < newTotalSessions) {
        updatedTestDates.push(null);
      }
    }

    const updatedData = {
      ...registrationData,
      package: newPackage,
      testDates: updatedTestDates.filter(d => d !== null && d !== undefined)
    };

    setRegistrationData(updatedData);
    setSelectedTestDates(updatedTestDates);
    localStorage.setItem('testRegistration', JSON.stringify(updatedData));
    setIsPackageModalOpen(false);
  };

  const handleBranchChange = (newBranch) => {
    // Branch o'zgarsa - barcha datelarni reset qilish
    const updatedData = {
      ...registrationData,
      branch: newBranch,
      testDates: [],
      speakingDates: [],
      speakingType: ''
    };

    setRegistrationData(updatedData);
    setSelectedTestDates([]);
    localStorage.setItem('testRegistration', JSON.stringify(updatedData));
    setIsBranchModalOpen(false);

    // Yangi branch uchun test datelarni qayta yuklash
    fetchTestDates();
  };

  const handleTestDateChange = (index, testDateId) => {
    if (!testDateId) {
      // Clear selection
      const newSelectedDates = [...selectedTestDates];
      newSelectedDates[index] = null;
      setSelectedTestDates(newSelectedDates);
      return;
    }

    const testDate = testDates.find(d => d.id === parseInt(testDateId));
    if (!testDate) return;

    // Check for duplicates
    const isDuplicate = selectedTestDates.some((selected, i) =>
      i !== index && selected && selected.id === testDate.id
    );

    if (isDuplicate) {
      alert('Bu sana allaqachon tanlangan!');
      return;
    }

    const newSelectedDates = [...selectedTestDates];
    newSelectedDates[index] = testDate;
    setSelectedTestDates(newSelectedDates);
  };

  const handleBack = () => {
    navigate('/test-registration/branch');
  };

  const onSubmit = (formData) => {
    // Validate test dates
    const requiredTestDates = registrationData?.package?.totalSessions || 0;
    const validSelectedDates = selectedTestDates.filter(d => d && d.id);

    if (validSelectedDates.length !== requiredTestDates) {
      alert(`Iltimos, ${requiredTestDates} ta test sanasini tanlang!`);
      return;
    }

    const updatedData = {
      ...registrationData,
      personalInfo: formData,
      testDates: validSelectedDates
    };

    localStorage.setItem('testRegistration', JSON.stringify(updatedData));
    navigate('/test-registration/speaking');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeLabel = (time) => {
    const labels = {
      morning: 'Ertalab',
      afternoon: 'Kunduzi',
      evening: 'Kechqurun'
    };
    return labels[time] || time;
  };

  const getDayOfWeekLabel = (dayOfWeek) => {
    const labels = {
      MONDAY: 'Dushanba',
      TUESDAY: 'Seshanba',
      WEDNESDAY: 'Chorshanba',
      THURSDAY: 'Payshanba',
      FRIDAY: 'Juma',
      SATURDAY: 'Shanba',
      SUNDAY: 'Yakshanba'
    };
    return labels[dayOfWeek] || dayOfWeek;
  };

  const formatTestDateOption = (testDate) => {
    return `${formatDate(testDate.date)} - ${getDayOfWeekLabel(testDate.dayOfWeek)} - ${getTimeLabel(testDate.time)} (${testDate.timeString}) - ${testDate.existedSpace} joy`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' UZS';
  };

  // Filter test dates by selected time
  const filteredTestDates = selectedTestTime
    ? testDates.filter(d => d.time === selectedTestTime)
    : testDates;

  const totalTestDates = registrationData?.package?.totalSessions || 0;
  const activePackages = packagesData.filter(p => p.active);
  const activeBranches = branchesData.filter(b => b.active);

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white">
                <CheckCircleSolidIcon className="w-6 h-6" />
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Paket</span>
            </div>
            <div className="w-16 h-0.5 bg-green-600" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white">
                <CheckCircleSolidIcon className="w-6 h-6" />
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Filial</span>
            </div>
            <div className="w-16 h-0.5 bg-indigo-600" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-semibold">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-indigo-600">Test Sanalari</span>
            </div>
            <div className="w-16 h-0.5 bg-slate-300" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-300 text-slate-600 font-semibold">
                4
              </div>
              <span className="ml-2 text-sm font-medium text-slate-400">Speaking</span>
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
            Test Sanalarini Tanlang
          </h1>
          <p className="text-slate-600">
            Shaxsiy ma'lumotlar va test sanalarini kiriting
          </p>
        </motion.div>

        {/* Summary Cards with Edit */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">Tanlangan paket</p>
              <button
                onClick={() => setIsPackageModalOpen(true)}
                className="text-indigo-600 hover:text-indigo-700 transition-colors"
                title="Paketni o'zgartirish"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            </div>
            <p className="text-lg font-bold text-slate-900">
              {registrationData?.package?.name}
            </p>
            <p className="text-sm text-slate-600">
              {totalTestDates} ta test sessiyasi
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">Filial</p>
              <button
                onClick={() => setIsBranchModalOpen(true)}
                className="text-indigo-600 hover:text-indigo-700 transition-colors"
                title="Filialni o'zgartirish"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            </div>
            <p className="text-lg font-bold text-slate-900">
              {registrationData?.branch?.name}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 mb-6"
          >
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              Shaxsiy Ma'lumotlar
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <FormInput
                label="Ism"
                name="firstName"
                type="text"
                placeholder="Ismingizni kiriting"
                register={register}
                error={errors.firstName}
                required
              />
              <FormInput
                label="Familiya"
                name="lastName"
                type="text"
                placeholder="Familiyangizni kiriting"
                register={register}
                error={errors.lastName}
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <FormInput
                label="Telefon"
                name="phone"
                type="tel"
                placeholder="+998901234567"
                register={register}
                error={errors.phone}
                required
              />
              <FormInput
                label="Email (ixtiyoriy)"
                name="email"
                type="email"
                placeholder="email@example.com"
                register={register}
                error={errors.email}
              />
            </div>
          </motion.div>

          {/* Test Dates Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 mb-6"
          >
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">
                Test Sanalarini Tanlang
              </h2>
              <p className="text-sm text-slate-600">
                {totalTestDates} ta test sanasini tanlashingiz kerak
              </p>
            </div>

            {/* Test Time Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Vaqt bo'yicha filter (ixtiyoriy)
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedTestTime('')}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    selectedTestTime === ''
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  Hammasi
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTestTime('morning')}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    selectedTestTime === 'morning'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  Ertalab
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTestTime('afternoon')}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    selectedTestTime === 'afternoon'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  Kunduzi
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTestTime('evening')}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    selectedTestTime === 'evening'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  Kechqurun
                </button>
              </div>
            </div>

            {isLoadingTestDates ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="text-slate-600 mt-2">Yuklanmoqda...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Array.from({ length: totalTestDates }).map((_, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Test sana {index + 1}
                    </label>
                    <select
                      value={selectedTestDates[index]?.id || ''}
                      onChange={(e) => handleTestDateChange(index, e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Sanani tanlang</option>
                      {filteredTestDates.map((testDate) => (
                        <option key={testDate.id} value={testDate.id}>
                          {formatTestDateOption(testDate)}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="secondary"
              size="lg"
              type="button"
              onClick={handleBack}
            >
              Orqaga
            </Button>
            <Button
              variant="primary"
              size="lg"
              type="submit"
            >
              Keyingisi
            </Button>
          </div>
        </form>
      </div>

      {/* Package Modal */}
      <Transition appear show={isPackageModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsPackageModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="div" className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Paketni O'zgartirish
                    </h3>
                    <button
                      onClick={() => setIsPackageModalOpen(false)}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </Dialog.Title>

                  <div className="space-y-3">
                    {activePackages.map((pkg) => (
                      <button
                        key={pkg.id}
                        onClick={() => handlePackageChange(pkg)}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          registrationData?.package?.id === pkg.id
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-bold text-lg text-slate-900">{pkg.name}</p>
                            <p className="text-sm text-slate-600">
                              {pkg.totalSessions} ta test • {pkg.speakingSessions} ta speaking
                            </p>
                          </div>
                          <p className="text-xl font-bold text-indigo-600">
                            {formatPrice(pkg.price)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Branch Modal */}
      <Transition appear show={isBranchModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsBranchModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="div" className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Filialni O'zgartirish
                    </h3>
                    <button
                      onClick={() => setIsBranchModalOpen(false)}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </Dialog.Title>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Diqqat:</strong> Filialni o'zgartirsangiz, barcha tanlangan test va speaking datelar o'chib ketadi.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {activeBranches.map((branch) => (
                      <button
                        key={branch.id}
                        onClick={() => handleBranchChange(branch)}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          registrationData?.branch?.id === branch.id
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <p className="font-bold text-lg text-slate-900">{branch.name}</p>
                        <p className="text-sm text-slate-600">
                          {branch.location} • Maksimal {branch.maxStudents} ta o'quvchi
                        </p>
                      </button>
                    ))}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Step3Details;
