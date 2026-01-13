import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { TESTIMONIALS } from '../../utils/constants';

const StudentFeedback = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef(null);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) =>
      prev === 0 ? TESTIMONIALS.length - 1 : prev - 1
    );
  };

  // Auto-slide functionality
  useEffect(() => {
    if (!isPaused) {
      timeoutRef.current = setTimeout(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
      }, 5000); // Change slide every 5 seconds
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, isPaused]);

  const variants = {
    enter: (direction) => ({
      opacity: 0,
    }),
    center: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section id="testimonials" className="section-padding bg-background-paper">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <h2 className="text-display text-primary mb-3">
            Student Comments
          </h2>
        </motion.div>

        <div className="relative max-w-2xl mx-auto">
          {/* Testimonial */}
          <div
            className="min-h-[240px]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="py-8">
                  {/* Text */}
                  <p className="text-lg text-primary/80 leading-relaxed mb-8">
                    {TESTIMONIALS[currentIndex].text}
                  </p>

                  {/* Student info */}
                  <div className="flex items-center justify-between border-t border-border pt-6">
                    <div>
                      <div className="font-medium text-primary mb-0.5">
                        {TESTIMONIALS[currentIndex].name}
                      </div>
                      <div className="text-sm text-primary/50">
                        {TESTIMONIALS[currentIndex].role}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-primary/50">
                        {TESTIMONIALS[currentIndex].targetScore}
                      </span>
                      <span className="text-primary/30">→</span>
                      <span className="font-medium text-primary">
                        {TESTIMONIALS[currentIndex].score}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={handlePrev}
              className="w-10 h-10 flex items-center justify-center text-primary/60 hover:text-primary transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeftIcon className="w-5 h-5" strokeWidth={1.5} />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-6 h-1.5 bg-primary'
                      : 'w-1.5 h-1.5 bg-primary/20 hover:bg-primary/40'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-10 h-10 flex items-center justify-center text-primary/60 hover:text-primary transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRightIcon className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentFeedback;
