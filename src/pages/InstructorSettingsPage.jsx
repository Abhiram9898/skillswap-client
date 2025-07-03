import React from 'react';
import { motion } from 'framer-motion';

const InstructorSettingsPage = () => {
  return (
    <motion.div
      className="min-h-screen p-6 bg-gray-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">⚙️ Settings</h1>
        <p className="text-gray-600 mb-6">
          Coming soon: update your profile information, avatar, and preferences.
        </p>

        <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-100 text-gray-500">
          🚧 Profile editing functionality is under construction.
        </div>
      </div>
    </motion.div>
  );
};

export default InstructorSettingsPage;
