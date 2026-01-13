import { motion } from 'framer-motion';
import { Brain, Clock, BarChart3, Headphones, FileText, MessageSquare, CheckCircle2, Zap } from 'lucide-react';

const ValueProposition = () => {
  const features = [
    {
      icon: Brain,
      title: 'Real Exam Interface',
      description: 'Practice with an exact replica of the IDP IELTS CD test platform. Every pixel, every interaction matches the real exam.',
      gradient: 'from-indigo-500 to-purple-500',
      bgGradient: 'from-indigo-50 to-purple-50',
    },
    {
      icon: Zap,
      title: 'AI-Powered Scoring',
      description: 'Get instant band scores powered by advanced AI trained on thousands of IELTS assessments. Accurate, fast, and detailed.',
      gradient: 'from-violet-500 to-fuchsia-500',
      bgGradient: 'from-violet-50 to-fuchsia-50',
    },
    {
      icon: MessageSquare,
      title: 'Speaking Simulation',
      description: 'Practice all three parts of Speaking with AI voice recognition. Get pronunciation and fluency feedback instantly.',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
    },
    {
      icon: FileText,
      title: 'Writing Task Evaluation',
      description: 'Receive detailed feedback on Task Achievement, Coherence, Vocabulary, and Grammar for both Task 1 and Task 2.',
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50',
    },
    {
      icon: Headphones,
      title: 'Authentic Listening Tests',
      description: 'Experience real exam audio quality with British, Australian, and American accents. Adjustable playback controls.',
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50',
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Track your progress over time. Identify weak areas and watch your scores improve with detailed performance graphs.',
      gradient: 'from-pink-500 to-rose-500',
      bgGradient: 'from-pink-50 to-rose-50',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="features" className="relative py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-4">
            <CheckCircle2 className="w-4 h-4" />
            Why Everest Mock?
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Everything You Need to
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Ace Your IELTS
            </span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            We've built the most comprehensive and authentic IELTS practice platform.
            From the interface to the scoring, everything mirrors the real exam.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="group relative bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl hover:border-slate-300 transition-all duration-300"
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.bgGradient} mb-6`}>
                <feature.icon className={`w-7 h-7 bg-gradient-to-br ${feature.gradient} text-transparent`} strokeWidth={2} style={{ stroke: `url(#gradient-${index})` }} />
                <svg width="0" height="0">
                  <defs>
                    <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" className={feature.gradient.split(' ')[0].replace('from-', '')} />
                      <stop offset="100%" className={feature.gradient.split(' ')[1].replace('to-', '')} />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect Gradient */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <p className="text-slate-600 mb-6">
            Join thousands of successful IELTS candidates who trust Everest Mock
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span>Instant access</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span>Free first mock test</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ValueProposition;
