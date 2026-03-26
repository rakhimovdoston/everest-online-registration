import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { testSessionApi } from '../../services/api';
import AnswerTable from '../../components/results/AnswerTable';

const LISTENING_SECTIONS = [
  { label: 'Part 1', range: [1, 10],  color: 'bg-indigo-50 text-indigo-700' },
  { label: 'Part 2', range: [11, 20], color: 'bg-blue-50 text-blue-700' },
  { label: 'Part 3', range: [21, 30], color: 'bg-violet-50 text-violet-700' },
  { label: 'Part 4', range: [31, 40], color: 'bg-purple-50 text-purple-700' },
];

const ListeningResults = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await testSessionApi.getListeningResults(sessionId);
        const data = res?.data || res;
        setResults(data);
      } catch (err) {
        console.error('Failed to fetch listening results:', err);
        setError(err?.message || 'Failed to load results');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-slate-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Results not available'}</p>
          <button
            onClick={() => navigate('/profile')}
            className="text-indigo-600 hover:underline"
          >
            {t('common.backToProfile')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>{t('common.backToProfile')}</span>
          </button>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-slate-900">
                Listening Results
              </h1>
              <p className="text-slate-500 text-sm mt-1">Session #{sessionId}</p>
            </div>
          </div>
        </motion.div>

        {/* Answer Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <AnswerTable
            answers={results.answers || []}
            userAnswers={results.userAnswers || []}
            sections={LISTENING_SECTIONS}
            accentColor="indigo"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default ListeningResults;
