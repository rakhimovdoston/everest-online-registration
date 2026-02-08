import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeftIcon,
  XCircleIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';

const ReadingResults = () => {
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

      // Mock data - same structure as Listening
      const mockData = {
        answers: [
          { key: 21, value: "they make their statements with confidence.", keys: null, values: [] },
          { key: 22, value: "Some of the data were gathered some time ago.", keys: null, values: [] },
          { key: 23, value: "how long the event lasts.", keys: null, values: [] },
          { key: 24, value: "fail to compare the photos with their memory of the event.", keys: null, values: [] },
          { key: 31, value: "army", keys: null, values: [] },
          { key: 32, value: "safety", keys: null, values: [] },
        ],
        userAnswers: [
          { key: 21, value: "they use sophisticated language in their accounts.", keys: null, values: null },
          { key: 22, value: "The studies involved comparatively few people.", keys: null, values: null },
          { key: 23, value: "how long the event lasts.", keys: null, values: null },
          { key: 24, value: "fail to compare the photos with their memory of the event.", keys: null, values: null },
          { key: 31, value: "strh", keys: null, values: null },
          { key: 32, value: "safety", keys: null, values: null },
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
    console.log('Downloading Reading PDF for session:', sessionId);
    // TODO: Implement PDF download API call
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
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
            className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>{t('common.backToProfile')}</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">
                Reading Results
              </h1>
              <p className="text-slate-600">
                Session #{sessionId}
              </p>
            </div>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
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
          className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-xl p-8 mb-8 border-2 border-green-200"
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
              <p className="text-4xl font-bold text-green-600">{percentage}%</p>
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
              <thead className="bg-green-600">
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
                          <span className="bg-green-600 text-white font-bold px-3 py-1 rounded-lg text-sm">
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

export default ReadingResults;
