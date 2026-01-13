import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hover = true,
  animate = true,
  delay = 0,
  ...props
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: delay,
        ease: 'easeOut',
      },
    },
  };

  const hoverVariants = hover ? {
    rest: { scale: 1, y: 0 },
    hover: {
      scale: 1.05,
      y: -10,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  } : {};

  return (
    <motion.div
      variants={animate ? cardVariants : {}}
      initial={animate ? 'hidden' : false}
      whileInView={animate ? 'visible' : false}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={hover ? 'hover' : false}
      className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
