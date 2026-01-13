import { motion } from 'framer-motion';
import { Check, Zap } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Free Trial',
      price: '0',
      period: 'One-time',
      description: 'Perfect for trying out our platform',
      features: [
        '1 Complete Mock Test',
        'All 4 modules included',
        'Instant AI Scoring',
        'Basic performance report',
        'No credit card required',
      ],
      cta: 'Start Free Trial',
      popular: false,
      gradient: 'from-slate-600 to-slate-700',
    },
    {
      name: 'Pro',
      price: '29',
      period: 'per month',
      description: 'Most popular for serious candidates',
      features: [
        'Unlimited Mock Tests',
        'All 4 modules',
        'Advanced AI Scoring',
        'Detailed feedback & analytics',
        'Speaking AI with voice feedback',
        'Writing detailed evaluation',
        'Progress tracking',
        'Priority support',
      ],
      cta: 'Get Started',
      popular: true,
      gradient: 'from-indigo-600 to-violet-600',
    },
    {
      name: 'Ultimate',
      price: '79',
      period: 'per 3 months',
      description: 'Best value for long-term preparation',
      features: [
        'Everything in Pro',
        'Save $8 per month',
        'Personalized study plan',
        'One-on-one coaching session',
        'Exam day strategies guide',
        'Lifetime access to resources',
        'VIP support',
      ],
      cta: 'Get Ultimate',
      popular: false,
      gradient: 'from-purple-600 to-pink-600',
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
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Simple, Transparent
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Pricing
            </span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Choose the plan that fits your preparation timeline. All plans include our authentic exam interface.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className={`relative bg-white rounded-3xl border-2 p-8 ${
                plan.popular
                  ? 'border-indigo-600 shadow-2xl shadow-indigo-500/20'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-xl'
              } transition-all duration-300`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold shadow-lg">
                    <Zap className="w-3 h-3 fill-white" />
                    MOST POPULAR
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-slate-600 mb-6">{plan.description}</p>

                <div className="flex items-end justify-center gap-1 mb-2">
                  <span className="text-5xl font-bold text-slate-900">${plan.price}</span>
                  {plan.price !== '0' && (
                    <span className="text-slate-600 pb-2">/{plan.period.split(' ')[1]}</span>
                  )}
                </div>
                <p className="text-sm text-slate-500">{plan.period}</p>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 rounded-full font-semibold text-sm shadow-lg transition-all duration-200 ${
                  plan.popular
                    ? `bg-gradient-to-r ${plan.gradient} text-white shadow-indigo-500/30 hover:shadow-indigo-500/40`
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
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
          className="text-center mt-16"
        >
          <p className="text-slate-600 mb-4">
            All plans include access to our exact IDP IELTS interface replica
          </p>
          <p className="text-sm text-slate-500">
            Cancel anytime. No questions asked. Money-back guarantee within 7 days.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
