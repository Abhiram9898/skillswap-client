import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUserDetails,
  updateUserProfile,
  resetUserState,
} from '../redux/userSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProfileScreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    avatar: '',
  });
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();
  const { id } = useParams();
  const { user, loading, error, success } = useSelector((state) => state.user);
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // 🔁 Load user details
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      if (!user || user._id !== id) {
        dispatch(getUserDetails(id));
      } else {
        setFormData({
          name: user.name || '',
          email: user.email || '',
          bio: user.bio || '',
          avatar: user.avatar || '',
        });
      }
    }
  }, [dispatch, navigate, userInfo, user, id]);

  // ✅ Handle success message
  useEffect(() => {
    if (success) {
      setMessage('✅ Profile updated successfully!');
      dispatch(resetUserState());
      const timeout = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [success, dispatch]);

  // 📤 Handle form input change
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 📷 Handle image file input and convert to Base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 🚀 Submit profile update
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserProfile({ ...formData, _id: id }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8"
      >
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          🧑‍💻 My Profile
        </h2>

        {message && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-700 text-center">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block mb-1 text-gray-700 font-medium">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-1 text-gray-700 font-medium">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                disabled
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                value={formData.email}
              />
            </div>
          </div>

          <div>
            <label htmlFor="bio" className="block mb-1 text-gray-700 font-medium">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us a bit about yourself..."
            ></textarea>
          </div>

          <div>
            <label htmlFor="avatar" className="block mb-1 text-gray-700 font-medium">
              Upload Avatar
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white"
            />

            {formData.avatar && (
              <div className="mt-3 flex items-center gap-4">
                <img
                  src={formData.avatar}
                  alt="Avatar Preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-blue-300 shadow"
                />
                <p className="text-gray-600 text-sm">Preview</p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-semibold rounded-lg shadow-lg transition duration-300 ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Updating...' : '✅ Update Profile'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ProfileScreen;
