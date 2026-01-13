import { motion } from 'framer-motion';
import Accordion from '../ui/Accordion';
import { FAQ_ITEMS } from '../../utils/constants';

const FAQ = () => {
  return (
    <section id="faq" className="section-padding bg-background">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <h2 className="text-display text-primary mb-3">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <Accordion items={FAQ_ITEMS} />
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
