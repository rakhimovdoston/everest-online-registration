import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

const WritingResults = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);
  const [expandedFeedback, setExpandedFeedback] = useState({});

  useEffect(() => {
    // Mock API call - replace with real API
    const fetchResults = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data
      const mockData = {
        questions: [
          {
            id: 102,
            active: true,
            title: "The maps show the changes of an office building between the present and the future.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
            image: "https://cdn.everestexams.uz/modules/16d4941a-7077-4e17-9c9a-0a4de9552a56png.png",
            task: true
          },
          {
            id: 34,
            active: true,
            title: "Some people say that a lot of scientific research done today is a waste of time and money.\n\nTo what extent do you agree disagree?",
            image: "",
            task: false
          }
        ],
        answers: [
          {
            id: 26963,
            writingId: 102,
            task: false,
            answer: "The map illustrates present and future redevelopments of an office building. Left grass area will constitude with outdoor seating area and chairs while WCs, meeting area , chairs, coffee machine will be replaced to the right grass area. Storerooms location will be chaned. Offices above the entarance to grass area will be replaced with kitchen and  canteen. offices near to the main entarance will be enlarged and mainenterence will be located between two offices",
            score: 5.0,
            feedback: null,
            axiomFeedback: {
              cohesionAndCoherence: {
                Score: "5",
                Description: "The essay provides a basic comparison of the present and future office layouts, but lacks clear organization and logical flow.",
                Suggestions: [
                  "Use linking words to improve the flow between sentences.",
                  "Organize the information more logically, perhaps by discussing each area separately.",
                  "Ensure that each sentence clearly relates to the main topic."
                ],
                Revisions: []
              },
              lexicalResource: {
                Score: "5",
                Description: "The vocabulary is basic and lacks variety. Some spelling errors are present.",
                Suggestions: [],
                Revisions: [
                  {
                    sentenceExample: "constitude",
                    revision: "constitute",
                    explanation: "Corrected spelling error."
                  }
                ]
              },
              grammaticalRangeAndAccuracy: {
                Score: "5",
                Description: "The essay contains several grammatical errors that affect clarity.",
                Suggestions: [],
                Revisions: []
              },
              taskAchievement: {
                Score: "5",
                Description: "The essay attempts to describe the changes but lacks detail and clarity in some areas.",
                Suggestions: [
                  "Provide more detailed descriptions of the changes.",
                  "Ensure all main features are clearly described and compared."
                ],
                Revisions: []
              }
            }
          },
          {
            id: 26964,
            writingId: 34,
            task: false,
            answer: "Great deal of scientific research done today are  thought as waste of money and time nowdays. I am totally disagree with this argument.\n First of all results of scientific reasersch are made eathier more comfortable our life. Kent university`s professors invented a new matwerial for bulding road which exist about 40 years.",
            score: 4.0,
            feedback: null,
            axiomFeedback: {
              cohesionAndCoherence: {
                Score: "4.0",
                Description: "The essay has a basic structure with an introduction, two body paragraphs, and a conclusion. However, the use of cohesive devices is limited.",
                Suggestions: [
                  "Use a variety of cohesive devices to better connect your ideas.",
                  "Try to avoid repetition and ensure that your ideas are logically ordered."
                ],
                Revisions: []
              },
              lexicalResource: {
                Score: "4.0",
                Description: "The essay uses a limited range of vocabulary and there are several spelling errors.",
                Suggestions: [],
                Revisions: []
              },
              grammaticalRangeAndAccuracy: {
                Score: "4.0",
                Description: "The essay demonstrates a limited range of grammatical structures, with some attempts at complex sentences.",
                Suggestions: [],
                Revisions: []
              },
              taskAchievement: {
                Score: "4.0",
                Description: "The essay addresses the task and presents a position throughout the response.",
                Suggestions: [
                  "Make your position more clear in the introduction and conclusion.",
                  "Provide more specific and well-explained examples to support your arguments."
                ],
                Revisions: []
              }
            }
          }
        ],
        score: "4.5"
      };

      setResults(mockData);
      setLoading(false);
    };

    fetchResults();
  }, [sessionId]);

  const toggleFeedback = (answerIdx, criteriaKey) => {
    const key = `${answerIdx}-${criteriaKey}`;
    setExpandedFeedback(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const downloadPDF = () => {
    console.log('Downloading Writing PDF for session:', sessionId);
    // TODO: Implement PDF download API call
  };

  const getCriteriaColor = (score) => {
    const numScore = parseFloat(score);
    if (numScore >= 7) return 'text-green-600 bg-green-50 border-green-200';
    if (numScore >= 5) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-slate-600">{t('common.loading')}</p>
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
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-4 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>{t('common.backToProfile')}</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">
                Writing Results
              </h1>
              <p className="text-slate-600">
                Session #{sessionId}
              </p>
            </div>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              <span>{t('profile.downloadPDF')}</span>
            </button>
          </div>
        </motion.div>

        {/* Overall Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl shadow-xl p-8 mb-8 border-2 border-orange-200 text-center"
        >
          <p className="text-sm text-slate-600 mb-2">Overall Writing Score</p>
          <p className="text-6xl font-bold text-orange-600">{results.score}</p>
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
                transition={{ duration: 0.5, delay: 0.2 + answerIdx * 0.1 }}
                className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200"
              >
                {/* Task Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-slate-900">
                      Task {taskNumber}
                    </h2>
                    <div className="bg-orange-100 border-2 border-orange-300 rounded-lg px-6 py-2">
                      <span className="text-sm text-slate-600">Score: </span>
                      <span className="text-3xl font-bold text-orange-600">{answer.score}</span>
                    </div>
                  </div>

                  {/* Question */}
                  <div className="bg-slate-50 rounded-lg p-6 mb-4">
                    <p className="text-slate-800 whitespace-pre-line">{question.title}</p>
                    {question.image && (
                      <img
                        src={question.image}
                        alt="Task illustration"
                        className="mt-4 rounded-lg max-w-full h-auto"
                      />
                    )}
                  </div>

                  {/* User Answer */}
                  <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
                    <p className="text-sm font-semibold text-indigo-900 mb-2">Your Answer:</p>
                    <p className="text-slate-800 whitespace-pre-line leading-relaxed">{answer.answer}</p>
                  </div>
                </div>

                {/* Feedback Criteria */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Detailed Feedback</h3>

                  {Object.entries(answer.axiomFeedback).map(([criteriaKey, criteria]) => {
                    const isExpanded = expandedFeedback[`${answerIdx}-${criteriaKey}`];
                    const criteriaTitle = criteriaKey
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, str => str.toUpperCase());

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
                            <span className="font-semibold text-slate-900">{criteriaTitle}</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getCriteriaColor(criteria.Score)}`}>
                              {criteria.Score}
                            </span>
                          </div>
                          {isExpanded ? (
                            <ChevronUpIcon className="w-5 h-5 text-slate-600" />
                          ) : (
                            <ChevronDownIcon className="w-5 h-5 text-slate-600" />
                          )}
                        </button>

                        {/* Criteria Details */}
                        {isExpanded && (
                          <div className="p-6 bg-white space-y-4">
                            {/* Description */}
                            <div>
                              <p className="text-sm font-semibold text-slate-700 mb-2">Description:</p>
                              <p className="text-slate-600">{criteria.Description}</p>
                            </div>

                            {/* Suggestions */}
                            {criteria.Suggestions && criteria.Suggestions.length > 0 && (
                              <div>
                                <p className="text-sm font-semibold text-slate-700 mb-2">Suggestions:</p>
                                <ul className="list-disc list-inside space-y-2">
                                  {criteria.Suggestions.map((suggestion, idx) => (
                                    <li key={idx} className="text-slate-600">{suggestion}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Revisions */}
                            {criteria.Revisions && criteria.Revisions.length > 0 && (
                              <div>
                                <p className="text-sm font-semibold text-slate-700 mb-3">Revisions:</p>
                                <div className="space-y-4">
                                  {criteria.Revisions.map((revision, idx) => (
                                    <div key={idx} className="bg-slate-50 rounded-lg p-4">
                                      <div className="mb-2">
                                        <span className="text-xs font-semibold text-slate-600">Original:</span>
                                        <p className="text-red-700 mt-1 italic">"{revision.sentenceExample}"</p>
                                      </div>
                                      <div className="mb-2">
                                        <span className="text-xs font-semibold text-slate-600">Revision:</span>
                                        <p className="text-green-700 mt-1 font-medium">"{revision.revision}"</p>
                                      </div>
                                      <div>
                                        <span className="text-xs font-semibold text-slate-600">Explanation:</span>
                                        <p className="text-slate-600 mt-1 text-sm">{revision.explanation}</p>
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
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WritingResults;
