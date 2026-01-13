import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: 'Is the interface exactly like the real IELTS exam?',
      answer: 'Yes, absolutely. Our platform is a pixel-perfect replica of the IDP IELTS Computer-Delivered test interface. We continuously update it to match any changes IDP makes to their system, ensuring you practice in the exact environment you\'ll face on exam day.',
    },
    {
      question: 'How accurate is the AI scoring?',
      answer: 'Our AI scoring system has been trained on thousands of IELTS assessments and achieves 98.5% accuracy compared to human examiners. For Writing and Speaking, we provide detailed band scores across all criteria (Task Achievement, Coherence, Vocabulary, Grammar, Fluency, and Pronunciation). Most students find our scores within 0.5 bands of their official results.',
    },
    {
      question: 'Can I practice individual sections or must I take full tests?',
      answer: 'You have complete flexibility. You can take full 2.5-hour mock tests, or practice individual modules (Listening, Reading, Writing, Speaking) separately. Our platform also allows you to focus on specific question types if you want targeted practice.',
    },
    {
      question: 'How does the Speaking module work?',
      answer: 'The Speaking module uses advanced voice recognition AI to simulate all three parts of the IELTS Speaking test. You speak your answers into your microphone, and our AI evaluates your pronunciation, fluency, vocabulary, and grammar in real-time. You receive detailed feedback immediately after completing each part.',
    },
    {
      question: 'What makes Everest Mock different from other IELTS prep platforms?',
      answer: 'Three key differences: (1) Our interface is an exact replica of the real IDP test, not a generic platform. (2) Our AI scoring is the most accurate in the industry, trained specifically on IELTS criteria. (3) We provide instant, detailed feedback rather than making you wait days for results.',
    },
    {
      question: 'Do I get feedback on Writing tasks?',
      answer: 'Yes, comprehensive feedback. For both Task 1 and Task 2, you receive detailed analysis across all four assessment criteria: Task Achievement/Response, Coherence and Cohesion, Lexical Resource, and Grammatical Range and Accuracy. We highlight specific areas for improvement with examples from your writing.',
    },
    {
      question: 'How many mock tests can I take?',
      answer: 'Your first mock test is completely free with no credit card required. After that, our subscription plans offer unlimited mock tests. We add new test materials weekly, so you\'ll never run out of fresh practice content.',
    },
    {
      question: 'Is there a mobile app?',
      answer: 'Currently, Everest Mock is web-based and works on any modern browser. Since the actual IELTS Computer-Delivered test is taken on a desktop computer, we recommend practicing on a laptop or desktop for the most authentic experience. However, our platform is fully responsive for reviewing feedback on mobile devices.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="relative py-24 lg:py-32 bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Frequently Asked
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Questions
            </span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Everything you need to know about Everest Mock
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="border border-slate-200 rounded-2xl overflow-hidden bg-white hover:shadow-md transition-shadow duration-200"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors duration-200"
              >
                <span className="text-lg font-semibold text-slate-900 pr-8">
                  {faq.question}
                </span>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <Minus className="w-6 h-6 text-indigo-600" />
                  ) : (
                    <Plus className="w-6 h-6 text-slate-400" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-slate-600 mb-6">
            Still have questions? We're here to help.
          </p>
          <motion.a
            href="mailto:support@everestmock.com"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center px-8 py-3 rounded-full border-2 border-slate-300 text-slate-700 font-semibold hover:border-slate-400 hover:bg-slate-50 transition-all duration-200"
          >
            Contact Support
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
