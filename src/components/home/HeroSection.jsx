import { motion, useScroll, useTransform } from 'framer-motion';
import {
  SpeakerWaveIcon,
  BookOpenIcon,
  PencilSquareIcon,
  MicrophoneIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';

const FloatingCard = ({ children, delay, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative"
    >
      <motion.div
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 3 + index * 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="bg-background-paper/80 backdrop-blur-sm border border-border/50 px-4 py-3 rounded-lg flex items-center gap-3 shadow-card"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

const HeroSection = ({ onRegisterClick }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5">
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-primary/5"
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div
        style={{ y, opacity }}
        className="container-custom relative w-full py-24 z-10"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-hero font-bold text-primary mb-6 leading-tight"
            >
              Experience the Real IELTS Exam — Before the Real One
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={itemVariants}
              className="text-body-lg text-primary/70 mb-10 max-w-xl"
            >
              Computer-based IELTS mock exams with authentic timing, interface, and evaluation.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={onRegisterClick}
              >
                Register for Mock Test
              </Button>
              <a
                href="#features"
                className="text-primary/60 hover:text-primary transition-colors text-sm font-medium underline underline-offset-4"
              >
                View Test Format
              </a>
            </motion.div>
          </motion.div>

          {/* Right side - Floating skill cards */}
          <div className="hidden lg:block relative h-[400px]">
            <div className="absolute inset-0 flex flex-col justify-center gap-4">
              {/* First row */}
              <div className="flex gap-4 justify-end">
                <FloatingCard delay={0.4} index={0}>
                  <SpeakerWaveIcon className="w-5 h-5 text-accent" strokeWidth={1.5} />
                  <span className="text-sm font-medium text-primary">Listening</span>
                </FloatingCard>
                <FloatingCard delay={0.5} index={1}>
                  <BookOpenIcon className="w-5 h-5 text-accent" strokeWidth={1.5} />
                  <span className="text-sm font-medium text-primary">Reading</span>
                </FloatingCard>
              </div>

              {/* Second row */}
              <div className="flex gap-4 justify-center">
                <FloatingCard delay={0.6} index={2}>
                  <PencilSquareIcon className="w-5 h-5 text-accent" strokeWidth={1.5} />
                  <span className="text-sm font-medium text-primary">Writing</span>
                </FloatingCard>
                <FloatingCard delay={0.7} index={3}>
                  <MicrophoneIcon className="w-5 h-5 text-accent" strokeWidth={1.5} />
                  <span className="text-sm font-medium text-primary">Speaking</span>
                </FloatingCard>
              </div>

              {/* Decorative elements */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/10 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
