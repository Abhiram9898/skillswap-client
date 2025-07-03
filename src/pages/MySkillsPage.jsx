import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstructorSkills } from '../redux/skillSlice';
import SkillCard from '../components/SkillCard';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MySkillsPage = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { instructorSkills, loading, error } = useSelector((state) => state.skills);

  useEffect(() => {
    if (userInfo?.role === 'instructor') {
      dispatch(fetchInstructorSkills());
    }
  }, [dispatch, userInfo]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📘 My Skills</h1>
        <Link
          to="/instructor/create-skill"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          + Add Skill
        </Link>
      </div>

      {loading && <p>Loading skills...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && instructorSkills.length === 0 && (
        <p className="text-gray-600">You haven't added any skills yet.</p>
      )}

      {!loading && instructorSkills.length > 0 && (
        <p className="text-gray-600 mb-2">
          You have {instructorSkills.length} {instructorSkills.length === 1 ? 'skill' : 'skills'}.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {instructorSkills.map((skill, idx) => (
          <motion.div
            key={skill._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <SkillCard skill={skill} showActions />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MySkillsPage;
