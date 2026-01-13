import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const { t } = useTranslation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white overflow-hidden pt-20">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(15 23 42) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text Content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-6"
            >
              <CheckCircle2 className="w-4 h-4" />
              {t('hero.badge')}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 leading-tight mb-6"
            >
              {t('hero.title').split(' ').slice(0, -3).join(' ')}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                {t('hero.title').split(' ').slice(-3).join(' ')}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link to="/test-registration">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-indigo-600 text-white font-semibold shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:bg-indigo-700 transition-all duration-200"
                >
                  {t('hero.startButton')}
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </Link>

              <motion.a
                href="#features"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center px-8 py-4 rounded-full border-2 border-slate-300 text-slate-700 font-semibold hover:border-slate-400 hover:bg-slate-50 transition-all duration-200"
              >
                {t('hero.featuresButton')}
              </motion.a>
            </motion.div>
          </div>

          {/* Right: Floating Mock UI */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                rotateX: mousePosition.y * 0.5,
                rotateY: mousePosition.x * 0.5,
              }}
              className="relative perspective-1000"
            >
              {/* Main Exam Interface Card */}
              <div className="relative w-full max-w-md">
                {/* Browser-style window */}
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform-gpu">
                  {/* Window header */}
                  <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 text-center text-xs text-slate-500 font-medium">
                      IELTS Computer-Delivered Test
                    </div>
                  </div>

                  {/* Exam Content */}
                  <div className="p-6 space-y-6">
                    {/* Timer */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-indigo-600" />
                        <div>
                          <div className="text-xs text-slate-500 font-medium">Time Remaining</div>
                          <div className="text-lg font-bold text-slate-900">39:42</div>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-slate-600">
                        Question 12/40
                      </div>
                    </div>

                    {/* Question Preview */}
                    <div className="space-y-4">
                      <div className="h-3 bg-slate-200 rounded-full w-full" />
                      <div className="h-3 bg-slate-200 rounded-full w-5/6" />
                      <div className="h-3 bg-slate-200 rounded-full w-4/6" />

                      <div className="grid grid-cols-2 gap-3 pt-4">
                        <div className="h-12 bg-indigo-50 border-2 border-indigo-600 rounded-lg" />
                        <div className="h-12 bg-slate-50 border-2 border-slate-200 rounded-lg" />
                        <div className="h-12 bg-slate-50 border-2 border-slate-200 rounded-lg" />
                        <div className="h-12 bg-slate-50 border-2 border-slate-200 rounded-lg" />
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between pt-4">
                      <button className="px-6 py-2 rounded-lg border border-slate-300 text-slate-600 text-sm font-medium">
                        Previous
                      </button>
                      <button className="px-6 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium shadow-lg shadow-indigo-500/30">
                        Next
                      </button>
                    </div>
                  </div>
                </div>

                {/* Floating Badge */}
                <motion.div
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  className="absolute -right-4 -top-4 bg-white rounded-2xl shadow-xl border border-slate-200 px-6 py-4 backdrop-blur-sm"
                >
                  <div className="text-xs text-slate-500 font-medium mb-1">AI Accuracy</div>
                  <div className="text-2xl font-bold text-indigo-600">98.5%</div>
                </motion.div>

                {/* Floating Badge 2 */}
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute -left-4 bottom-12 bg-white rounded-2xl shadow-xl border border-slate-200 px-6 py-4 backdrop-blur-sm"
                >
                  <div className="text-xs text-slate-500 font-medium mb-1">Instant Score</div>
                  <div className="text-2xl font-bold text-green-600">Band 7.5</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
};

export default HeroSection;
