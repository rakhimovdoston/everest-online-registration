import { motion } from 'framer-motion';
import { Check, Zap } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      id: 2,
      name: 'One Timer',
      price: '100,000',
      currency: 'UZS',
      period: 'One-time payment',
      description: 'Perfect for trying out the platform',
      features: [
        '1 Mock Test Session',
        '1 Speaking Assessment',
        'All 4 Modules (L, R, W, S)',
        'Same-day results',
        'Computer-based format',
      ],
      cta: 'Start Now',
      popular: false,
      gradient: 'from-blue-500 to-blue-600',
      totalSessions: 1,
      speakingSessions: 1,
      durationWeeks: 1,
    },
    {
      id: 4,
      name: 'Three Sessions',
      price: '200,000',
      currency: 'UZS',
      period: '1 week program',
      description: 'Ideal for rapid score improvement',
      features: [
        '3 Mock Test Sessions',
        '1 Speaking Assessment',
        'Alternate day scheduling',
        'Speaking applies to all tests',
        'Progress analytics',
        'Computer-based format',
      ],
      cta: 'Get Started',
      popular: true,
      gradient: 'from-indigo-600 to-violet-600',
      totalSessions: 3,
      speakingSessions: 1,
      durationWeeks: 1,
    },
    {
      id: 1,
      name: 'Six Sessions',
      price: '300,000',
      currency: 'UZS',
      period: '2 week program',
      description: 'Comprehensive exam preparation',
      features: [
        '6 Mock Test Sessions',
        '2 Speaking Assessments',
        'Alternate day scheduling',
        'Weekly speaking reviews',
        'Advanced analytics',
        'Computer-based format',
      ],
      cta: 'Choose Plan',
      popular: false,
      gradient: 'from-purple-500 to-pink-500',
      totalSessions: 6,
      speakingSessions: 2,
      durationWeeks: 2,
    },
    {
      id: 3,
      name: 'Twelve Sessions',
      price: '500,000',
      currency: 'UZS',
      period: '4 week program',
      description: 'Maximum preparation for high scores',
      features: [
        '12 Mock Test Sessions',
        '4 Speaking Assessments',
        'Alternate day scheduling',
        'Weekly speaking reviews',
        'Full progress tracking',
        'Computer-based format',
        'Priority support',
      ],
      cta: 'Ultimate Plan',
      popular: false,
      gradient: 'from-emerald-500 to-teal-500',
      totalSessions: 12,
      speakingSessions: 4,
      durationWeeks: 4,
    },
  ];

  return (
    <section id="pricing" className="relative py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Choose Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Perfect Plan
            </span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Flexible pricing packages designed for every preparation goal. All plans include authentic IELTS test experience.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="relative bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 p-6"
            >
              {/* Plan Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-xs text-slate-500 mb-4">{plan.period}</p>

                <div className="flex items-baseline justify-center gap-1 mb-1">
                  <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-sm text-slate-600 font-medium">{plan.currency}</span>
                </div>

                <p className="text-sm text-slate-600 mt-4">
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-xs leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl font-semibold text-sm bg-slate-900 text-white hover:bg-slate-800 shadow-md transition-all duration-200"
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-20"
        >
          <div className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-50 rounded-full mb-4">
            <Check className="w-5 h-5 text-indigo-600" />
            <p className="text-slate-700 font-medium">
              All plans include authentic IDP IELTS interface
            </p>
          </div>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            Secure payment • Same-day results • Expert support • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
