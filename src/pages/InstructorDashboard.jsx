import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const InstructorDashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const dashboardLinks = [
    {
      title: '📘 My Skills',
      desc: 'Edit or delete skills you offer.',
      link: '/instructor/my-skills',
    },
    {
      title: '📅 My Bookings',
      desc: 'View and manage your scheduled sessions.',
      link: '/instructor/bookings',
    },
    {
      title: '💬 Chat',
      desc: 'Message students directly.',
      link: '/instructor/chat', // ✅ Fixed: Correct chat route
    },
    {
      title: '✏️ Create Skill',
      desc: 'Add a new skill to your profile.',
      link: '/instructor/create-skill',
    },
    {
      title: '⚙️ Settings',
      desc: 'Edit your profile and preferences.',
      link: `/profile/${userInfo?._id}`,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen px-6 py-10 bg-gray-50"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Instructor Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Welcome! Here you can manage your skills, bookings, and more.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardLinks.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={card.link}
              className="block p-6 bg-white rounded-xl shadow hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
              <p className="text-gray-600 text-sm">{card.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default InstructorDashboard;
