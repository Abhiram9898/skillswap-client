import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSkillById, updateSkill } from '../redux/skillSlice';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const EditSkillPage = () => {
  const { id } = useParams(); // Get skill ID from URL
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { skillDetail, loading, error } = useSelector((state) => state.skills);
  const { userInfo } = useSelector((state) => state.auth); // Get logged-in user info

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    pricePerHour: '',
  });

  // Fetch skill details on component mount or ID change
  useEffect(() => {
    dispatch(fetchSkillById(id));
  }, [dispatch, id]);

  // Populate form data once skill details are loaded
  useEffect(() => {
    if (skillDetail && skillDetail._id === id) {
      // Check if the logged-in user is the owner of the skill
      if (userInfo && skillDetail.createdBy?._id !== userInfo._id) {
        toast.error('You are not authorized to edit this skill.');
        navigate('/my-skills'); // Redirect if not the owner
      } else {
        setFormData({
          title: skillDetail.title || '',
          description: skillDetail.description || '',
          category: skillDetail.category || '',
          pricePerHour: skillDetail.pricePerHour || '',
        });
      }
    }
  }, [skillDetail, id, userInfo, navigate]); // Add userInfo and navigate to dependencies

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!formData.title || !formData.description || !formData.category || !formData.pricePerHour) {
      toast.error('Please fill in all fields.');
      return;
    }
    if (isNaN(formData.pricePerHour) || Number(formData.pricePerHour) <= 0) {
      toast.error('Price per hour must be a positive number.');
      return;
    }

    try {
      // Dispatch updateSkill thunk with skill ID and updated data
      await dispatch(updateSkill({ id, skillData: formData })).unwrap();
      toast.success('Skill updated successfully!');
      navigate('/instructor/my-skills'); // Redirect to instructor's skills page
    } catch (err) {
      console.error('Failed to update skill:', err);
      // Use the error message from the backend if available, otherwise a generic one
      toast.error(err.message || 'Failed to update skill. Please try again.');
    }
  };

  // Handle loading, error, and skill not found states
  if (loading) {
    return (
      <div className="text-center py-10 text-lg text-blue-600 animate-pulse">
        Loading skill details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-lg text-red-500">
        Error: {error}
      </div>
    );
  }

  // If skillDetail is null or its ID doesn't match the param after loading
  if (!skillDetail || skillDetail._id !== id) {
    return (
      <div className="text-center py-10 text-lg text-gray-600">
        Skill not found or you are not authorized to view it.
      </div>
    );
  }

  // Ensure the current user is the owner before rendering the form
  if (userInfo && skillDetail.createdBy?._id !== userInfo._id) {
    // This case is already handled by the useEffect redirect, but as a fallback
    return (
      <div className="text-center py-10 text-lg text-red-500">
        Access Denied: You are not the owner of this skill.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-10 px-4"
    >
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          ✏️ Edit Skill: {skillDetail.title}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              Skill Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-y"
              required
            ></textarea>
          </div>

          <div>
            <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              required
            >
              <option value="">Select a Category</option>
              {['Programming', 'Design', 'Music', 'Language', 'Cooking', 'Other'].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="pricePerHour" className="block text-gray-700 font-medium mb-2">
              Price per Hour (₹)
            </label>
            <input
              type="number"
              id="pricePerHour"
              name="pricePerHour"
              value={formData.pricePerHour}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-semibold rounded-lg shadow-md transition duration-300 ${
              loading
                ? 'bg-indigo-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default EditSkillPage;
