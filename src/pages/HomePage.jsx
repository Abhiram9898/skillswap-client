import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSkills } from '../redux/skillSlice';
import FeaturedSkills from '../components/skills/FeaturedSkills';
import { motion } from 'framer-motion';
import HeroImage from '../assets/Hero.png';

const HomePage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch all skills for homepage preview
    dispatch(fetchSkills({ category: '', search: '' }));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-white to-gray-100">
      {/* Hero Section */}
      <section className="relative text-center py-28 px-6 overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-4 leading-tight"
        >
          Share. Learn. <span className="text-indigo-600">Grow.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
        >
          Empower your journey with <span className="font-semibold text-indigo-500">SkillSwap</span> —
          a platform to connect passionate learners and educators.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex justify-center gap-4 flex-wrap"
        >
          {userInfo ? (
            <Link
              to="/skills"
              className="px-6 py-3 bg-indigo-600 text-white text-lg rounded-full shadow-md hover:bg-indigo-700 transition-all duration-300"
            >
              🚀 Explore Skills
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-6 py-3 bg-indigo-600 text-white text-lg rounded-full shadow-md hover:bg-indigo-700 transition-all duration-300"
              >
                🔑 Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-600 text-lg rounded-full shadow hover:bg-indigo-50 transition-all duration-300"
              >
                ✨ Register
              </Link>
            </>
          )}
        </motion.div>

        {/* Decorative image */}
        <img
          src={HeroImage}
          alt="Peer learning and growth"
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 opacity-10 w-full max-h-96 object-cover pointer-events-none"
        />
      </section>

      {/* Featured Skills Section */}
      <section className="relative bg-white py-20 px-6 shadow-inner rounded-t-3xl">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800">🔥 Featured Skills</h2>
          <p className="text-gray-500 text-lg">Browse trending and highly rated skills curated for you</p>
        </div>

        <FeaturedSkills />

        {/* Decorative blobs */}
        <div className="absolute -top-20 right-0 w-64 h-64 bg-indigo-100 rounded-full filter blur-3xl opacity-30 z-0"></div>
        <div className="absolute -bottom-20 left-0 w-64 h-64 bg-pink-100 rounded-full filter blur-3xl opacity-30 z-0"></div>
      </section>
    </div>
  );
};

export default HomePage;
