import { motion } from 'framer-motion';

const fadeVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  }
};

const FadeCard = ({ children }) => (
  <motion.div
    className="bg-white shadow-lg rounded-xl p-6"
    initial="hidden"
    animate="visible"
    variants={fadeVariants}
    role="region" // optional for accessibility
  >
    {children}
  </motion.div>
);

export default FadeCard;
