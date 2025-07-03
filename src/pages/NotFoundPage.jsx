import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex items-center justify-center bg-gray-100 text-center px-4"
    >
      <div>
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-6xl font-bold text-indigo-700 mb-4"
        >
          404
        </motion.h1>
        <p className="text-xl text-gray-600 mb-6">
          Oops! Page not found.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </motion.div>
  );
};

export default NotFoundPage;
