import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Headphones, BookOpen, FileEdit, MessageSquare } from 'lucide-react';

const ExamEnvironment = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: 0,
      label: 'Listening',
      icon: Headphones,
      color: 'indigo',
    },
    {
      id: 1,
      label: 'Reading',
      icon: BookOpen,
      color: 'violet',
    },
    {
      id: 2,
      label: 'Writing',
      icon: FileEdit,
      color: 'blue',
    },
    {
      id: 3,
      label: 'Speaking',
      icon: MessageSquare,
      color: 'purple',
    },
  ];

  const mockUIs = [
    // Listening
    {
      header: 'Section 2 of 4',
      progress: 50,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                <Headphones className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-900">Now Playing</div>
                <div className="text-xs text-slate-600">Track 02 - Conversation</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-indigo-600">2:34</div>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-sm font-medium text-slate-900 mb-2">Question 11</div>
              <div className="text-sm text-slate-600 mb-3">The student wants to change his course to ___________.</div>
              <input
                type="text"
                placeholder="Type your answer..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-sm font-medium text-slate-900 mb-2">Question 12</div>
              <div className="text-sm text-slate-600 mb-3">The deadline for course changes is ___________.</div>
              <input
                type="text"
                placeholder="Type your answer..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      ),
    },
    // Reading
    {
      header: 'Passage 2 of 3',
      progress: 66,
      content: (
        <div className="space-y-4">
          <div className="p-6 bg-slate-50 rounded-lg border border-slate-200 max-h-64 overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-4">The History of Chocolate</h3>
            <p className="text-sm text-slate-700 leading-relaxed mb-3">
              Chocolate has been consumed in some form for over 3,000 years. The earliest evidence of chocolate consumption dates back to the Olmec civilization in Mesoamerica...
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              By the 15th century, the Aztecs had developed a sophisticated chocolate culture. They believed that cacao beans were a gift from the gods and used them as currency...
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <div className="text-sm font-medium text-slate-900 mb-3">Question 14: The Olmec civilization...</div>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border-2 border-violet-600 bg-violet-50 rounded-lg cursor-pointer">
                  <input type="radio" name="q14" className="w-4 h-4 text-violet-600" />
                  <span className="text-sm text-slate-700">was the first to consume chocolate</span>
                </label>
                <label className="flex items-center gap-3 p-3 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-slate-300">
                  <input type="radio" name="q14" className="w-4 h-4 text-violet-600" />
                  <span className="text-sm text-slate-700">traded chocolate with the Aztecs</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    // Writing
    {
      header: 'Task 2 of 2',
      progress: 50,
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm font-medium text-slate-900 mb-2">Essay Question</div>
            <p className="text-sm text-slate-700">
              Some people believe that the best way to reduce crime is to give longer prison sentences. Others, however, think there are better alternative ways. Discuss both views and give your opinion.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Word Count: 247 words (min. 250)</span>
              <span>Time: 28:45 remaining</span>
            </div>
            <textarea
              className="w-full h-48 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
              placeholder="Type your essay here..."
              defaultValue="In today's society, crime reduction remains a critical concern for governments worldwide. While some argue that lengthier prison sentences are the most effective deterrent..."
            />
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200">
              Save Draft
            </button>
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              Submit Answer
            </button>
          </div>
        </div>
      ),
    },
    // Speaking
    {
      header: 'Part 2 of 3',
      progress: 66,
      content: (
        <div className="space-y-4">
          <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-sm font-medium text-slate-900 mb-3">Topic Card</div>
            <div className="text-sm text-slate-700 space-y-2">
              <p className="font-semibold">Describe a place you have visited that you particularly enjoyed.</p>
              <p>You should say:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>where the place is</li>
                <li>when you went there</li>
                <li>what you did there</li>
                <li>and explain why you enjoyed it</li>
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-center p-8 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse" />
                </div>
              </div>
              <div className="text-lg font-bold text-slate-900 mb-2">Recording...</div>
              <div className="text-3xl font-bold text-purple-600 mb-4">1:23</div>
              <div className="text-sm text-slate-600">Speak clearly into your microphone</div>
            </div>
          </div>

          <button className="w-full px-4 py-3 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
            Stop Recording
          </button>
        </div>
      ),
    },
  ];

  return (
    <section id="exam-environment" className="relative py-24 lg:py-32 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Exact Exam</span> Experience
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Our interface is a pixel-perfect replica of the IDP IELTS Computer-Delivered test.
            Practice in the exact environment you'll face on exam day.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? `bg-${tab.color}-600 text-white shadow-lg shadow-${tab.color}-500/30`
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Mock UI Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Browser Window */}
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Window Header */}
            <div className="bg-slate-100 border-b border-slate-200 px-6 py-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 text-center text-sm text-slate-600 font-medium">
                  IELTS Computer-Delivered Test - {tabs[activeTab].label} Module
                </div>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${mockUIs[activeTab].progress}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-full bg-gradient-to-r from-${tabs[activeTab].color}-500 to-${tabs[activeTab].color}-600`}
                  />
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {mockUIs[activeTab].header}
                </span>
              </div>
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                {mockUIs[activeTab].content}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Info Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-200 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-slate-700">
                Interface updates in real-time to match IDP IELTS standards
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExamEnvironment;
