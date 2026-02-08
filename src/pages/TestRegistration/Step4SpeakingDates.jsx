import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon as CheckCircleSolidIcon, PencilIcon } from '@heroicons/react/24/solid';
import Button from '../../components/ui/Button';

const Step4SpeakingDates = () => {
  const navigate = useNavigate();
  const [registrationData, setRegistrationData] = useState(null);
  const [speakingType, setSpeakingType] = useState('');
  const [speakingDates, setSpeakingDates] = useState([]);
  const [selectedSpeakingDates, setSelectedSpeakingDates] = useState([]);
  const [isLoadingSpeakingDates, setIsLoadingSpeakingDates] = useState(false);

  // Check and load registration data
  useEffect(() => {
    const savedData = localStorage.getItem('testRegistration');
    if (!savedData) {
      navigate('/test-registration');
      return;
    }
    const data = JSON.parse(savedData);
    if (!data.personalInfo || !data.testDates) {
      navigate('/test-registration/details');
      return;
    }
    setRegistrationData(data);

    // Load previously selected data if any
    if (data.speakingType) {
      setSpeakingType(data.speakingType);
    }
    if (data.speakingDates) {
      setSelectedSpeakingDates(data.speakingDates);
    }
  }, [navigate]);

  // Fetch speaking dates when speaking type is selected
  useEffect(() => {
    if (speakingType && registrationData?.branch) {
      fetchSpeakingDates();
    }
  }, [speakingType, registrationData?.branch]);

  const fetchSpeakingDates = async () => {
    setIsLoadingSpeakingDates(true);
    try {
      // Mock API call - replace with real API endpoint
      // Real API: GET /api/speaking-dates?branchId={branchId}&type={speakingType}
      await new Promise(resolve => setTimeout(resolve, 500));

      const mockSpeakingDates = [
        {
          id: 36633,
          date: "2026-01-14",
          time: "14:00",
          branchName: registrationData.branch.name,
          speakerName: "Sevinch Rustambekova",
          score: null,
          speakerId: 844,
          type: speakingType,
          status: null,
          reason: null,
          examResponses: []
        },
        {
          id: 36634,
          date: "2026-01-14",
          time: "14:20",
          branchName: registrationData.branch.name,
          speakerName: "Sevinch Rustambekova",
          score: null,
          speakerId: 844,
          type: speakingType,
          status: null,
          reason: null,
          examResponses: []
        },
        {
          id: 36635,
          date: "2026-01-14",
          time: "14:40",
          branchName: registrationData.branch.name,
          speakerName: "Sevinch Rustambekova",
          score: null,
          speakerId: 844,
          type: speakingType,
          status: null,
          reason: null,
          examResponses: []
        },
        {
          id: 36636,
          date: "2026-01-14",
          time: "15:00",
          branchName: registrationData.branch.name,
          speakerName: "Sevinch Rustambekova",
          score: null,
          speakerId: 844,
          type: speakingType,
          status: null,
          reason: null,
          examResponses: []
        },
        {
          id: 36637,
          date: "2026-01-14",
          time: "15:20",
          branchName: registrationData.branch.name,
          speakerName: "Sevinch Rustambekova",
          score: null,
          speakerId: 844,
          type: speakingType,
          status: null,
          reason: null,
          examResponses: []
        },
        {
          id: 36638,
          date: "2026-01-14",
          time: "15:40",
          branchName: registrationData.branch.name,
          speakerName: "Sevinch Rustambekova",
          score: null,
          speakerId: 844,
          type: speakingType,
          status: null,
          reason: null,
          examResponses: []
        },
        {
          id: 36645,
          date: "2026-01-15",
          time: "14:00",
          branchName: registrationData.branch.name,
          speakerName: "John Doe",
          score: null,
          speakerId: 845,
          type: speakingType,
          status: null,
          reason: null,
          examResponses: []
        },
        {
          id: 36646,
          date: "2026-01-15",
          time: "14:20",
          branchName: registrationData.branch.name,
          speakerName: "John Doe",
          score: null,
          speakerId: 845,
          type: speakingType,
          status: null,
          reason: null,
          examResponses: []
        },
        {
          id: 36647,
          date: "2026-01-15",
          time: "14:40",
          branchName: registrationData.branch.name,
          speakerName: "John Doe",
          score: null,
          speakerId: 845,
          type: speakingType,
          status: null,
          reason: null,
          examResponses: []
        },
        {
          id: 36648,
          date: "2026-01-15",
          time: "15:00",
          branchName: registrationData.branch.name,
          speakerName: "John Doe",
          score: null,
          speakerId: 845,
          type: speakingType,
          status: null,
          reason: null,
          examResponses: []
        },
        {
          id: 36649,
          date: "2026-01-16",
          time: "14:00",
          branchName: registrationData.branch.name,
          speakerName: "Jane Smith",
          score: null,
          speakerId: 846,
          type: speakingType,
          status: null,
          reason: null,
          examResponses: []
        },
        {
          id: 36650,
          date: "2026-01-16",
          time: "14:20",
          branchName: registrationData.branch.name,
          speakerName: "Jane Smith",
          score: null,
          speakerId: 846,
          type: speakingType,
          status: null,
          reason: null,
          examResponses: []
        },
        {
          id: 36651,
          date: "2026-01-16",
          time: "14:40",
          branchName: registrationData.branch.name,
          speakerName: "Jane Smith",
          score: null,
          speakerId: 846,
          type: speakingType,
          status: null,
          reason: null,
          examResponses: []
        },
        {
          id: 36652,
          date: "2026-01-16",
          time: "15:00",
          branchName: registrationData.branch.name,
          speakerName: "Jane Smith",
          score: null,
          speakerId: 846,
          type: speakingType,
          status: null,
          reason: null,
          examResponses: []
        }
      ];

      setSpeakingDates(mockSpeakingDates);
    } catch (error) {
      console.error('Error fetching speaking dates:', error);
    } finally {
      setIsLoadingSpeakingDates(false);
    }
  };

  const handleSpeakingDateChange = (index, speakingDateId) => {
    const speakingDate = speakingDates.find(d => d.id === parseInt(speakingDateId));
    if (!speakingDate) return;

    const newSelectedDates = [...selectedSpeakingDates];
    newSelectedDates[index] = speakingDate;
    setSelectedSpeakingDates(newSelectedDates);
  };

  const handleBack = () => {
    navigate('/test-registration/details');
  };

  const handleEditPackage = () => {
    navigate('/test-registration');
  };

  const handleEditBranch = () => {
    navigate('/test-registration/branch');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate speaking type
    if (!speakingType) {
      alert('Iltimos, speaking turini tanlang!');
      return;
    }

    // Validate speaking dates
    const requiredSpeakingDates = registrationData?.package?.speakingSessions || 0;
    const validSelectedDates = selectedSpeakingDates.filter(d => d && d.id);

    if (validSelectedDates.length !== requiredSpeakingDates) {
      alert(`Iltimos, ${requiredSpeakingDates} ta speaking sanasini tanlang!`);
      return;
    }

    const updatedData = {
      ...registrationData,
      speakingType,
      speakingDates: validSelectedDates
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

  const formatSpeakingDateOption = (speakingDate) => {
    return `${formatDate(speakingDate.date)} - ${speakingDate.time} - ${speakingDate.speakerName}`;
  };

  const totalSpeakingDates = registrationData?.package?.speakingSessions || 0;

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
            <div className="w-16 h-0.5 bg-green-600" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white">
                <CheckCircleSolidIcon className="w-6 h-6" />
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Test</span>
            </div>
            <div className="w-16 h-0.5 bg-indigo-600" />
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-semibold">
                4
              </div>
              <span className="ml-2 text-sm font-medium text-indigo-600">Speaking</span>
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
            Speaking Sanalarini Tanlang
          </h1>
          <p className="text-slate-600">
            Speaking turini va sanalarini tanlang
          </p>
        </motion.div>

        {/* Summary Cards with Edit */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">Tanlangan paket</p>
              <button
                onClick={handleEditPackage}
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
              {totalSpeakingDates} ta speaking sessiyasi
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">Filial</p>
              <button
                onClick={handleEditBranch}
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

        <form onSubmit={handleSubmit}>
          {/* Speaking Type Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 mb-6"
          >
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">
                Speaking Turini Tanlang
              </h2>
              <p className="text-sm text-slate-600">
                Online yoki Face to Face speaking testini tanlang
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSpeakingType('ONLINE')}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  speakingType === 'ONLINE'
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    speakingType === 'ONLINE' ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}>
                    <svg className={`w-6 h-6 ${speakingType === 'ONLINE' ? 'text-white' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className={`font-bold text-lg ${speakingType === 'ONLINE' ? 'text-indigo-900' : 'text-slate-900'}`}>
                      Online
                    </p>
                    <p className="text-sm text-slate-600">
                      Video orqali speaking test
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSpeakingType('FACE_TO_FACE')}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  speakingType === 'FACE_TO_FACE'
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    speakingType === 'FACE_TO_FACE' ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}>
                    <svg className={`w-6 h-6 ${speakingType === 'FACE_TO_FACE' ? 'text-white' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className={`font-bold text-lg ${speakingType === 'FACE_TO_FACE' ? 'text-indigo-900' : 'text-slate-900'}`}>
                      Face to Face
                    </p>
                    <p className="text-sm text-slate-600">
                      Filialdagi speaking test
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </motion.div>

          {/* Speaking Dates Selection */}
          {speakingType && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 mb-6"
            >
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-2">
                  Speaking Sanalarini Tanlang
                </h2>
                <p className="text-sm text-slate-600">
                  {totalSpeakingDates} ta speaking sanasini tanlashingiz kerak
                </p>
              </div>

              {isLoadingSpeakingDates ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="text-slate-600 mt-2">Yuklanmoqda...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Array.from({ length: totalSpeakingDates }).map((_, index) => (
                    <div key={index}>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Speaking sana {index + 1}
                      </label>
                      <select
                        value={selectedSpeakingDates[index]?.id || ''}
                        onChange={(e) => handleSpeakingDateChange(index, e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        required
                      >
                        <option value="">Sanani tanlang</option>
                        {speakingDates.map((speakingDate) => (
                          <option key={speakingDate.id} value={speakingDate.id}>
                            {formatSpeakingDateOption(speakingDate)}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
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

export default Step4SpeakingDates;
