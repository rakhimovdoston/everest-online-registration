import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { EXAM_FEATURES } from '../../utils/constants';

const AuthenticExam = () => {
  const progressRef = useRef(null);
  const isInView = useInView(progressRef, { once: true });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setProgress(68); // Simulate 68% completion
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  return (
    <section className="section-padding bg-background-paper">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center"
        >
          <h2 className="text-display text-primary mb-3">
            Authentic Computer-Delivered Exam Environment
          </h2>
          <p className="text-primary/60 max-w-2xl mx-auto">
            Practice in an interface that mirrors the real IELTS exam, eliminating technical surprises on test day.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="space-y-4">
              {EXAM_FEATURES.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: 0.2 + index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex items-start gap-3"
                >
                  <CheckCircleIcon className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" strokeWidth={2} />
                  <span className="text-lg text-primary/80 leading-relaxed">{feature}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 p-6 bg-background border border-border rounded-lg"
            >
              <p className="text-sm text-primary/60 mb-2">
                This is not a toy platform. Everything matches the real exam.
              </p>
              <p className="text-primary/80 font-medium">
                Familiarity removes anxiety. Practice removes doubt.
              </p>
            </motion.div>
          </motion.div>

          {/* Interface preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="border border-border bg-background shadow-card rounded-lg overflow-hidden">
              {/* Mock exam interface header */}
              <div className="flex items-center justify-between p-4 bg-background-paper border-b border-border">
                <div className="text-sm font-semibold text-primary">Reading Section</div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <motion.span
                    className="text-sm font-mono font-medium text-primary/70"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    58:42
                  </motion.span>
                </div>
              </div>

              {/* Progress bar */}
              <div ref={progressRef} className="h-1 bg-border">
                <motion.div
                  className="h-full bg-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>

              {/* Mock content */}
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  {[100, 92, 100, 75, 85, 100, 88].map((width, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, width: 0 }}
                      whileInView={{ opacity: 1, width: `${width}%` }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.6,
                        delay: 0.6 + index * 0.05,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={`h-2.5 rounded ${
                        index === 3 ? 'bg-accent/30' : 'bg-border'
                      }`}
                    />
                  ))}
                </div>

                {/* Question navigation dots */}
                <div className="flex items-center gap-2 mb-6">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.3,
                        delay: 1.2 + i * 0.03,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={`w-7 h-7 rounded flex items-center justify-center text-xs font-medium border ${
                        i < 8
                          ? 'bg-accent/10 border-accent/30 text-accent'
                          : 'bg-background-paper border-border text-primary/40'
                      }`}
                    >
                      {i + 1}
                    </motion.div>
                  ))}
                </div>

                {/* Mock navigation */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 1.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-5 py-2.5 text-sm font-medium text-primary/70 border border-border rounded hover:bg-background transition-colors"
                  >
                    Review
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 1.6 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-5 py-2.5 text-sm font-medium text-background-paper bg-primary rounded hover:bg-primary-light transition-colors"
                  >
                    Next
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AuthenticExam;
