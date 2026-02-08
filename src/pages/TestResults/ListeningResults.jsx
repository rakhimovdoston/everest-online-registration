import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';

const ListeningResults = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);

  useEffect(() => {
    // Mock API call - replace with real API
    const fetchResults = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data
      const mockData = {
        answers: [
          { key: 1, value: "leader", keys: null, values: [] },
          { key: 2, value: "tennis", keys: null, values: [] },
          { key: 3, value: "8; eight", keys: null, values: [] },
          { key: 4, value: "June", keys: null, values: [] },
          { key: 5, value: "training", keys: null, values: [] },
          { key: null, value: null, keys: "11-12", values: ["people with at least three years' experience", "people with or without qualifications"] },
          { key: 15, value: "She needed a job with flexible working hours.", keys: null, values: [] }
        ],
        userAnswers: [
          { key: 1, value: "leader", keys: null, values: null },
          { key: 2, value: "tennis", keys: null, values: null },
          { key: 3, value: "8", keys: null, values: null },
          { key: 4, value: "June", keys: null, values: null },
          { key: 5, value: "training", keys: null, values: null },
          { key: null, value: null, keys: "11-12", values: ["people working as temporary staff", "people with at least three years' experience"] },
          { key: 15, value: "She needed a job with flexible working hours.", keys: null, values: null }
        ]
      };

      setResults(mockData);
      setLoading(false);
    };

    fetchResults();
  }, [sessionId]);

  const checkAnswer = (correctAnswer, userAnswer) => {
    if (!correctAnswer || !userAnswer) return false;

    // Handle multi-value answers (keys like "11-12")
    if (correctAnswer.keys && userAnswer.keys) {
      if (!correctAnswer.values || !userAnswer.values) return false;

      const correctSet = new Set(correctAnswer.values.map(v => v.toLowerCase().trim()));
      const userSet = new Set(userAnswer.values.map(v => v.toLowerCase().trim()));

      // Check if user answers match correct answers
      return Array.from(userSet).every(ans => correctSet.has(ans));
    }

    // Handle single value answers with multiple correct options (separated by semicolon)
    if (correctAnswer.value && userAnswer.value) {
      const correctOptions = correctAnswer.value.split(';').map(v => v.toLowerCase().trim());
      const userAns = userAnswer.value.toLowerCase().trim();
      return correctOptions.includes(userAns);
    }

    return false;
  };

  const getScore = () => {
    if (!results) return { correct: 0, total: 0 };

    let correct = 0;
    const total = results.answers.length;

    results.answers.forEach((answer, idx) => {
      const userAnswer = results.userAnswers[idx];
      if (checkAnswer(answer, userAnswer)) {
        correct++;
      }
    });

    return { correct, total };
  };

  const downloadPDF = () => {
    console.log('Downloading Listening PDF for session:', sessionId);
    // TODO: Implement PDF download API call
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const score = getScore();
  const percentage = (score.correct / score.total * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>{t('common.backToProfile')}</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">
                Listening Results
              </h1>
              <p className="text-slate-600">
                Session #{sessionId}
              </p>
            </div>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              <span>{t('profile.downloadPDF')}</span>
            </button>
          </div>
        </motion.div>

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-8 mb-8 border-2 border-blue-200"
        >
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-sm text-slate-600 mb-2">Total Questions</p>
              <p className="text-4xl font-bold text-slate-900">{score.total}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-2">Correct Answers</p>
              <p className="text-4xl font-bold text-green-600">{score.correct}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-2">Score</p>
              <p className="text-4xl font-bold text-indigo-600">{percentage}%</p>
            </div>
          </div>
        </motion.div>

        {/* Answers Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-indigo-600">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Question
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Correct Answer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Your Answer
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {results.answers.map((answer, idx) => {
                  const userAnswer = results.userAnswers[idx];
                  const isCorrect = checkAnswer(answer, userAnswer);
                  const questionNumber = answer.key || answer.keys;

                  return (
                    <tr
                      key={idx}
                      className={`${
                        isCorrect ? 'bg-green-50' : 'bg-red-50'
                      } hover:bg-opacity-80 transition-colors`}
                    >
                      {/* Question Number */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="bg-indigo-600 text-white font-bold px-3 py-1 rounded-lg text-sm">
                            {questionNumber}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {isCorrect ? (
                            <>
                              <CheckCircleSolidIcon className="w-6 h-6 text-green-600" />
                              <span className="font-semibold text-green-600">Correct</span>
                            </>
                          ) : (
                            <>
                              <XCircleIcon className="w-6 h-6 text-red-600" />
                              <span className="font-semibold text-red-600">Incorrect</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Correct Answer */}
                      <td className="px-6 py-4">
                        {answer.value ? (
                          <div className="text-green-800 font-medium">{answer.value}</div>
                        ) : (
                          <ul className="list-disc list-inside space-y-1">
                            {answer.values.map((val, i) => (
                              <li key={i} className="text-green-800 font-medium text-sm">{val}</li>
                            ))}
                          </ul>
                        )}
                      </td>

                      {/* User Answer */}
                      <td className="px-6 py-4">
                        {userAnswer?.value ? (
                          <div className={`font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                            {userAnswer.value}
                          </div>
                        ) : userAnswer?.values ? (
                          <ul className="list-disc list-inside space-y-1">
                            {userAnswer.values.map((val, i) => (
                              <li key={i} className={`font-medium text-sm ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                                {val}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-slate-500 italic">No answer</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ListeningResults;
