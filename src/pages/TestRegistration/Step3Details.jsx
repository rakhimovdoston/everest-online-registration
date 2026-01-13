import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircleIcon as CheckCircleSolidIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../contexts/AuthContext';
import FormInput from '../../components/forms/FormInput';
import Button from '../../components/ui/Button';

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
  const [speakingDates, setSpeakingDates] = useState([]);
  const [selectedTestDates, setSelectedTestDates] = useState([]);
  const [selectedSpeakingDates, setSelectedSpeakingDates] = useState([]);
  const [isLoadingTestDates, setIsLoadingTestDates] = useState(false);
  const [isLoadingSpeakingDates, setIsLoadingSpeakingDates] = useState(false);

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
      // Mock API call - replace with real API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock data
      const mockTestDates = [
        {
          id: 8600,
          date: "2026-01-13",
          time: "morning",
          timeString: "10:00",
          existedSpace: 18,
          branchName: registrationData.branch.name,
          dayOfWeek: "TUESDAY"
        },
        {
          id: 8601,
          date: "2026-01-13",
          time: "afternoon",
          timeString: "14:30",
          existedSpace: 11,
          branchName: registrationData.branch.name,
          dayOfWeek: "TUESDAY"
        },
        {
          id: 8602,
          date: "2026-01-13",
          time: "evening",
          timeString: "18:30",
          existedSpace: 19,
          branchName: registrationData.branch.name,
          dayOfWeek: "TUESDAY"
        },
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
          existedSpace: 10,
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
        }
      ];

      setTestDates(mockTestDates);
    } catch (error) {
      console.error('Error fetching test dates:', error);
    } finally {
      setIsLoadingTestDates(false);
    }
  };

  const fetchSpeakingDates = async () => {
    setIsLoadingSpeakingDates(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const mockSpeakingDates = [
        {
          id: 36503,
          date: "2026-01-15",
          time: "14:00",
          branchName: registrationData.branch.name,
          speakerName: "Sevinch Rustambekova",
          speakerId: 844,
          type: "ONLINE"
        },
        {
          id: 36504,
          date: "2026-01-15",
          time: "14:20",
          branchName: registrationData.branch.name,
          speakerName: "Sevinch Rustambekova",
          speakerId: 844,
          type: "ONLINE"
        },
        {
          id: 36505,
          date: "2026-01-15",
          time: "14:40",
          branchName: registrationData.branch.name,
          speakerName: "Sevinch Rustambekova",
          speakerId: 844,
          type: "ONLINE"
        },
        {
          id: 36506,
          date: "2026-01-15",
          time: "15:00",
          branchName: registrationData.branch.name,
          speakerName: "Sevinch Rustambekova",
          speakerId: 844,
          type: "ONLINE"
        }
      ];

      setSpeakingDates(mockSpeakingDates);
    } catch (error) {
      console.error('Error fetching speaking dates:', error);
    } finally {
      setIsLoadingSpeakingDates(false);
    }
  };

  const handleTestDateSelect = (testDate) => {
    const maxTestDates = registrationData?.package?.totalSessions || 0;

    const isSelected = selectedTestDates.some(d => d.id === testDate.id);

    if (isSelected) {
      setSelectedTestDates(selectedTestDates.filter(d => d.id !== testDate.id));
    } else {
      if (selectedTestDates.length < maxTestDates) {
        setSelectedTestDates([...selectedTestDates, testDate]);
      } else {
        alert(`Maksimal ${maxTestDates} ta test sanasini tanlashingiz mumkin!`);
      }
    }
  };

  const handleSpeakingDateSelect = (speakingDate) => {
    const maxSpeakingDates = registrationData?.package?.speakingSessions || 0;

    const isSelected = selectedSpeakingDates.some(d => d.id === speakingDate.id);

    if (isSelected) {
      setSelectedSpeakingDates(selectedSpeakingDates.filter(d => d.id !== speakingDate.id));
    } else {
      if (selectedSpeakingDates.length < maxSpeakingDates) {
        setSelectedSpeakingDates([...selectedSpeakingDates, speakingDate]);
      } else {
        alert(`Maksimal ${maxSpeakingDates} ta speaking sanasini tanlashingiz mumkin!`);
      }
    }
  };

  const handleBack = () => {
    navigate('/test-registration/branch');
  };

  const onSubmit = (formData) => {
    // Validate test dates
    if (selectedTestDates.length !== registrationData?.package?.totalSessions) {
      alert(`Iltimos, ${registrationData?.package?.totalSessions} ta test sanasini tanlang!`);
      return;
    }

    // Validate speaking dates
    if (selectedSpeakingDates.length !== registrationData?.package?.speakingSessions) {
      alert(`Iltimos, ${registrationData?.package?.speakingSessions} ta speaking sanasini tanlang!`);
      return;
    }

    const updatedData = {
      ...registrationData,
      personalInfo: formData,
      testDates: selectedTestDates,
      speakingDates: selectedSpeakingDates
    };

    localStorage.setItem('testRegistration', JSON.stringify(updatedData));
    navigate('/test-registration/review');
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

  useEffect(() => {
    // Fetch speaking dates when all test dates are selected
    if (selectedTestDates.length === registrationData?.package?.totalSessions) {
      fetchSpeakingDates();
    }
  }, [selectedTestDates.length, registrationData?.package?.totalSessions]);

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
              <span className="ml-2 text-sm font-medium text-indigo-600">Ma'lumotlar</span>
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
            {registrationData?.registrationType === 'myself'
              ? 'Shaxsiy Ma\'lumotlar'
              : 'Test Topshiruvchi Ma\'lumotlari'}
          </h1>
          <p className="text-slate-600">
            Shaxsiy ma'lumotlar, test va speaking vaqtlarini tanlang
          </p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <p className="text-sm text-slate-600 mb-1">Tanlangan paket</p>
            <p className="text-lg font-bold text-slate-900">
              {registrationData?.package?.name}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <p className="text-sm text-slate-600 mb-1">Filial</p>
            <p className="text-lg font-bold text-slate-900">
              {registrationData?.branch?.name}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <p className="text-sm text-slate-600 mb-1">Test / Speaking</p>
            <p className="text-lg font-bold text-slate-900">
              {registrationData?.package?.totalSessions} / {registrationData?.package?.speakingSessions}
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Test Sanalarini Tanlang
              </h2>
              <span className="text-sm text-slate-600">
                {selectedTestDates.length} / {registrationData?.package?.totalSessions} tanlandi
              </span>
            </div>

            {isLoadingTestDates ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="text-slate-600 mt-2">Yuklanmoqda...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {testDates.map((testDate) => {
                  const isSelected = selectedTestDates.some(d => d.id === testDate.id);
                  return (
                    <button
                      key={testDate.id}
                      type="button"
                      onClick={() => handleTestDateSelect(testDate)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CalendarIcon className={`w-5 h-5 ${isSelected ? 'text-indigo-600' : 'text-slate-600'}`} />
                          <div>
                            <p className={`font-semibold ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>
                              {formatDate(testDate.date)} - {getTimeLabel(testDate.time)}
                            </p>
                            <p className="text-sm text-slate-600">
                              {testDate.timeString} • {testDate.existedSpace} ta joy mavjud
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircleSolidIcon className="w-6 h-6 text-indigo-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Speaking Dates Selection */}
          {selectedTestDates.length === registrationData?.package?.totalSessions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 mb-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  Speaking Sanalarini Tanlang
                </h2>
                <span className="text-sm text-slate-600">
                  {selectedSpeakingDates.length} / {registrationData?.package?.speakingSessions} tanlandi
                </span>
              </div>

              {isLoadingSpeakingDates ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="text-slate-600 mt-2">Yuklanmoqda...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {speakingDates.map((speakingDate) => {
                    const isSelected = selectedSpeakingDates.some(d => d.id === speakingDate.id);
                    return (
                      <button
                        key={speakingDate.id}
                        type="button"
                        onClick={() => handleSpeakingDateSelect(speakingDate)}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <ClockIcon className={`w-5 h-5 ${isSelected ? 'text-indigo-600' : 'text-slate-600'}`} />
                            <div>
                              <p className={`font-semibold ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>
                                {formatDate(speakingDate.date)} - {speakingDate.time}
                              </p>
                              <p className="text-sm text-slate-600">
                                {speakingDate.speakerName} • {speakingDate.type}
                              </p>
                            </div>
                          </div>
                          {isSelected && (
                            <CheckCircleSolidIcon className="w-6 h-6 text-indigo-600" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

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
              Ko'rib chiqish
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Step3Details;
