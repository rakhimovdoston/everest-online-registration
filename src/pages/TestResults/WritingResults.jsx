import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { testSessionApi } from '../../services/api';

const CRITERIA_LABELS = {
  cohesionAndCoherence: 'Cohesion & Coherence',
  lexicalResource: 'Lexical Resource',
  grammaticalRangeAndAccuracy: 'Grammatical Range & Accuracy',
  taskAchievement: 'Task Achievement',
};

const getCriteriaColor = (score) => {
  const n = parseFloat(score);
  if (n >= 7) return 'text-green-600 bg-green-50 border-green-200';
  if (n >= 5) return 'text-orange-600 bg-orange-50 border-orange-200';
  return 'text-red-600 bg-red-50 border-red-200';
};

const getOverallColor = (score) => {
  const n = parseFloat(score);
  if (n >= 7) return 'text-green-600';
  if (n >= 5) return 'text-orange-600';
  return 'text-red-600';
};

const WritingResults = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [expandedFeedback, setExpandedFeedback] = useState({});

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await testSessionApi.getWritingResults(sessionId);
        const data = res?.data || res;
        setResults(data);
      } catch (err) {
        console.error('Failed to fetch writing results:', err);
        setError(err?.message || 'Failed to load results');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [sessionId]);

  const toggleFeedback = (answerIdx, criteriaKey) => {
    const key = `${answerIdx}-${criteriaKey}`;
    setExpandedFeedback(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4" />
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
            className="text-orange-600 hover:underline"
          >
            {t('common.backToProfile')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-4 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>{t('common.backToProfile')}</span>
          </button>

          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">
              Writing Results
            </h1>
            <p className="text-slate-500 text-sm mt-1">Session #{sessionId}</p>
          </div>
        </motion.div>

        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl shadow-xl p-8 mb-8 border-2 border-orange-200 text-center"
        >
          <p className="text-sm text-slate-600 mb-2">Overall Writing Score</p>
          <p className={`text-6xl font-bold ${getOverallColor(results.score)}`}>
            {results.score}
          </p>
        </motion.div>

        {/* Tasks */}
        <div className="space-y-8">
          {results.answers.map((answer, answerIdx) => {
            const question = results.questions.find(q => q.id === answer.writingId);
            const taskNumber = answerIdx + 1;

            return (
              <motion.div
                key={answer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + answerIdx * 0.1 }}
                className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200"
              >
                {/* Task Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Task {taskNumber}
                  </h2>
                  <div className={`rounded-xl px-6 py-2 border-2 text-center ${
                    parseFloat(answer.score) >= 7
                      ? 'bg-green-50 border-green-300'
                      : parseFloat(answer.score) >= 5
                      ? 'bg-orange-50 border-orange-300'
                      : 'bg-red-50 border-red-300'
                  }`}>
                    <span className="text-sm text-slate-600 block">Score</span>
                    <span className={`text-3xl font-bold ${getOverallColor(answer.score)}`}>
                      {answer.score}
                    </span>
                  </div>
                </div>

                {/* Question */}
                {question && (
                  <div className="bg-slate-50 rounded-xl p-6 mb-4">
                    <p className="text-slate-800 whitespace-pre-line leading-relaxed">
                      {question.title}
                    </p>
                    {question.image && (
                      <img
                        src={question.image}
                        alt="Task illustration"
                        className="mt-4 rounded-lg max-w-full h-auto"
                      />
                    )}
                  </div>
                )}

                {/* User Answer */}
                <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200 mb-6">
                  <p className="text-sm font-semibold text-indigo-900 mb-2">Your Answer</p>
                  <p className="text-slate-800 whitespace-pre-line leading-relaxed">
                    {answer.answer}
                  </p>
                </div>

                {/* Detailed Feedback */}
                {answer.axiomFeedback && (
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Detailed Feedback</h3>
                    <div className="space-y-3">
                      {Object.entries(answer.axiomFeedback).map(([criteriaKey, criteria]) => {
                        const isExpanded = expandedFeedback[`${answerIdx}-${criteriaKey}`];
                        const label = CRITERIA_LABELS[criteriaKey] || criteriaKey
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, s => s.toUpperCase());

                        return (
                          <div
                            key={criteriaKey}
                            className="border border-slate-200 rounded-xl overflow-hidden"
                          >
                            {/* Criteria Header */}
                            <button
                              onClick={() => toggleFeedback(answerIdx, criteriaKey)}
                              className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-slate-100 transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <span className="font-semibold text-slate-900 text-left">
                                  {label}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getCriteriaColor(criteria.Score)}`}>
                                  {criteria.Score}
                                </span>
                              </div>
                              {isExpanded
                                ? <ChevronUpIcon className="w-5 h-5 text-slate-500 shrink-0" />
                                : <ChevronDownIcon className="w-5 h-5 text-slate-500 shrink-0" />
                              }
                            </button>

                            {/* Criteria Details */}
                            {isExpanded && (
                              <div className="p-6 bg-white space-y-5">

                                {/* Description */}
                                <div>
                                  <p className="text-sm font-semibold text-slate-700 mb-1">Description</p>
                                  <p className="text-slate-600 leading-relaxed">{criteria.Description}</p>
                                </div>

                                {/* Suggestions */}
                                {criteria.Suggestions?.length > 0 && (
                                  <div>
                                    <p className="text-sm font-semibold text-slate-700 mb-2">Suggestions</p>
                                    <ul className="space-y-1.5">
                                      {criteria.Suggestions.map((s, i) => (
                                        <li key={i} className="flex gap-2 text-slate-600">
                                          <span className="text-orange-500 shrink-0">•</span>
                                          {s}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {/* Revisions */}
                                {criteria.Revisions?.length > 0 && (
                                  <div>
                                    <p className="text-sm font-semibold text-slate-700 mb-3">Revisions</p>
                                    <div className="space-y-3">
                                      {criteria.Revisions.map((rev, i) => (
                                        <div key={i} className="bg-slate-50 rounded-xl p-4 space-y-2">
                                          <div>
                                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                              Original
                                            </span>
                                            <p className="text-red-700 mt-1 italic">
                                              "{rev.sentenceExample}"
                                            </p>
                                          </div>
                                          <div>
                                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                              Revision
                                            </span>
                                            <p className="text-green-700 mt-1 font-medium">
                                              "{rev.revision}"
                                            </p>
                                          </div>
                                          <div>
                                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                              Explanation
                                            </span>
                                            <p className="text-slate-600 mt-1 text-sm">
                                              {rev.explanation}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WritingResults;
