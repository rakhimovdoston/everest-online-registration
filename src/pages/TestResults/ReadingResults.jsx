import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { testSessionApi } from '../../services/api';
import AnswerTable from '../../components/results/AnswerTable';

const READING_SECTIONS = [
  { label: 'Passage 1', range: [1, 13],  color: 'bg-emerald-50 text-emerald-700' },
  { label: 'Passage 2', range: [14, 26], color: 'bg-green-50 text-green-700' },
  { label: 'Passage 3', range: [27, 40], color: 'bg-teal-50 text-teal-700' },
];

const ReadingResults = () => {
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
        const res = await testSessionApi.getReadingResults(sessionId);
        const data = res?.data || res;
        setResults(data);
      } catch (err) {
        console.error('Failed to fetch reading results:', err);
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
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4" />
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
            className="text-green-600 hover:underline"
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
            className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>{t('common.backToProfile')}</span>
          </button>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-slate-900">
                Reading Results
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
            sections={READING_SECTIONS}
            accentColor="green"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default ReadingResults;
