import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSkills } from '../redux/skillSlice';
import { Link } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { FaStar, FaRegStar } from 'react-icons/fa';

const categories = ['Programming', 'Design', 'Music', 'Language', 'Cooking', 'Other'];

const SkillList = () => {
  const dispatch = useDispatch();
  const { skills, loading, error } = useSelector((state) => state.skills);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedFetch = useMemo(
    () =>
      debounce((category, search) => {
        dispatch(fetchSkills({ category, search }));
      }, 500),
    [dispatch]
  );

  useEffect(() => {
    debouncedFetch(selectedCategory, searchTerm);
    return () => debouncedFetch.cancel();
  }, [selectedCategory, searchTerm, debouncedFetch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  // Utility: Calculate average rating
  const getAverageRating = (reviews = []) => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return total / reviews.length;
  };

  // Utility: Check if posted within 7 days
  const isNewSkill = (date) => {
    const createdAt = new Date(date);
    const today = new Date();
    const diffInDays = (today - createdAt) / (1000 * 60 * 60 * 24);
    return diffInDays < 7;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Explore Skills</h1>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-400"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search skills..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-400"
            />
            {(searchTerm || selectedCategory) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Loader & Errors */}
        {loading && <div className="text-center text-lg py-10">Loading...</div>}
        {error && <div className="text-red-500 text-center mb-6">{error}</div>}

        {/* Skill Cards */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => {
            const avgRating = getAverageRating(skill.reviews);
            const isNew = isNewSkill(skill.createdAt);

            return (
              <div
                key={skill._id}
                className="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl border border-gray-100 transition"
              >
                <div className="p-6 relative">
                  {/* New Badge */}
                  {isNew && (
                    <span className="absolute top-4 right-4 bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded">
                      🆕 New
                    </span>
                  )}

                  {/* Instructor Info */}
                  <div className="flex items-center mb-4">
                    <img
                      src={skill.createdBy?.avatar || 'https://via.placeholder.com/40'}
                      alt={skill.createdBy?.name || 'Instructor'}
                      className="w-10 h-10 rounded-full mr-3 border object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{skill.createdBy?.name || 'Unknown Instructor'}</h3>
                      <span className="text-sm text-gray-500">{skill.category}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h2 className="text-xl font-bold mb-1 text-gray-800">{skill.title}</h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{skill.description}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3 text-yellow-500 text-sm">
                    {[...Array(5)].map((_, i) =>
                      i < Math.round(avgRating) ? (
                        <FaStar key={i} />
                      ) : (
                        <FaRegStar key={i} className="text-gray-300" />
                      )
                    )}
                    <span className="ml-2 text-xs text-gray-600">
                      ({skill.reviews?.length || 0})
                    </span>
                  </div>

                  {/* Bottom */}
                  <div className="flex justify-between items-center mt-4">
                    <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-semibold">
                      ₹{skill.pricePerHour}/hr
                    </span>
                    <Link
                      to={`/skills/${skill._id}`}
                      className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md shadow hover:from-blue-600 hover:to-purple-600"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Skills */}
        {!loading && skills.length === 0 && (
          <div className="text-center text-gray-500 mt-10">No skills found.</div>
        )}
      </div>
    </div>
  );
};

export default SkillList;
