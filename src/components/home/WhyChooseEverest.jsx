import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import { FEATURES } from '../../utils/constants';

const iconComponents = {
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  CheckBadgeIcon,
};

const FeatureItem = ({ feature, index }) => {
  const Icon = iconComponents[feature.icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        scale: 1.02,
        y: -4,
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
      }}
      className="group bg-background-paper border border-border rounded-lg p-8 transition-shadow duration-300 hover:shadow-card cursor-default"
    >
      {Icon && (
        <motion.div
          className="flex-shrink-0 w-12 h-12 text-accent mb-4"
          whileHover={{
            rotate: [0, -5, 5, -5, 0],
            transition: { duration: 0.5 },
          }}
        >
          <Icon className="w-full h-full" strokeWidth={1.5} />
        </motion.div>
      )}
      <div>
        <h3 className="text-xl font-semibold text-primary mb-3 group-hover:text-accent transition-colors">
          {feature.title}
        </h3>
        <p className="text-primary/60 leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
};

const WhyChooseEverest = () => {
  return (
    <section id="features" className="section-padding bg-background">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center"
        >
          <h2 className="text-display text-primary mb-3">
            Why Choose Everest for Mock IELTS
          </h2>
          <p className="text-primary/60 max-w-2xl mx-auto">
            Experience the most authentic IELTS preparation platform with features designed to mirror the real exam.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {FEATURES.map((feature, index) => (
            <FeatureItem key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseEverest;
