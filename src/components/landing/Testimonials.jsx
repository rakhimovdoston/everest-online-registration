import { motion } from 'framer-motion';
import { Star, TrendingUp, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'University Student',
      location: 'Hong Kong',
      initialBand: '6.5',
      finalBand: '7.5',
      quote: 'The AI scoring was incredibly accurate. I practiced for 3 weeks and improved my band score by a whole point. The interface being exactly like the real test removed all anxiety on exam day.',
      gradient: 'from-pink-400 to-rose-400',
    },
    {
      name: 'Ahmed Hassan',
      role: 'Software Engineer',
      location: 'Dubai',
      initialBand: '6.0',
      finalBand: '8.0',
      quote: 'Everest Mock transformed my preparation. The speaking module with AI feedback was a game-changer. I went from struggling with fluency to scoring Band 8. Worth every penny.',
      gradient: 'from-blue-400 to-cyan-400',
    },
    {
      name: 'Maria Rodriguez',
      role: 'Medical Professional',
      location: 'Spain',
      initialBand: '7.0',
      finalBand: '8.5',
      quote: 'As someone who needed Band 8 for immigration, I can\'t recommend this enough. The detailed feedback on writing tasks helped me understand exactly what examiners look for.',
      gradient: 'from-violet-400 to-purple-400',
    },
    {
      name: 'Raj Patel',
      role: 'MBA Candidate',
      location: 'India',
      initialBand: '6.5',
      finalBand: '7.0',
      quote: 'The reading module helped me improve my time management dramatically. Practicing with the exact same interface meant zero surprises during the actual test.',
      gradient: 'from-emerald-400 to-teal-400',
    },
    {
      name: 'Yuki Tanaka',
      role: 'Graduate Student',
      location: 'Japan',
      initialBand: '6.0',
      finalBand: '7.5',
      quote: 'I was skeptical about AI scoring, but it was spot on compared to my official results. The instant feedback loop accelerated my learning tremendously.',
      gradient: 'from-orange-400 to-amber-400',
    },
    {
      name: 'Elena Popov',
      role: 'English Teacher',
      location: 'Russia',
      initialBand: '7.5',
      finalBand: '8.5',
      quote: 'Even as a teacher, I found the analytics incredibly insightful. Being able to track my weak areas and see measurable improvement was motivating and effective.',
      gradient: 'from-indigo-400 to-blue-400',
    },
  ];

  return (
    <section className="relative py-24 lg:py-32 bg-slate-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-medium mb-4 shadow-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            10,000+ Success Stories
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Real Students,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Real Results
            </span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            See how Everest Mock has helped students achieve their target band scores
            and gain admission to top universities worldwide.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group relative bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10">
                <Quote className="w-12 h-12 text-slate-900" />
              </div>

              {/* Student Info */}
              <div className="flex items-start gap-4 mb-6">
                {/* Avatar */}
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-slate-600">{testimonial.role}</p>
                  <p className="text-xs text-slate-500">{testimonial.location}</p>
                </div>
              </div>

              {/* Band Score Progress */}
              <div className="flex items-center gap-3 mb-6 p-4 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl border border-slate-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">{testimonial.initialBand}</div>
                  <div className="text-xs text-slate-600">Before</div>
                </div>
                <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{testimonial.finalBand}</div>
                  <div className="text-xs text-slate-600">After</div>
                </div>
              </div>

              {/* Quote */}
              <p className="text-slate-700 leading-relaxed text-sm">
                "{testimonial.quote}"
              </p>

              {/* Star Rating */}
              <div className="flex gap-1 mt-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid md:grid-cols-3 gap-6 mt-16"
        >
          <div className="text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-4xl font-bold text-indigo-600 mb-2">10,000+</div>
            <div className="text-slate-600">Students Trained</div>
          </div>
          <div className="text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-4xl font-bold text-indigo-600 mb-2">1.2</div>
            <div className="text-slate-600">Average Band Increase</div>
          </div>
          <div className="text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-4xl font-bold text-indigo-600 mb-2">98.5%</div>
            <div className="text-slate-600">Scoring Accuracy</div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
