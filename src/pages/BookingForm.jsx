import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBooking } from '../redux/bookingSlice';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const BookingForm = ({ skillId, instructorId, pricePerHour }) => {
  const [formData, setFormData] = useState({
    date: '',
    duration: 1,
  });
  const [totalPrice, setTotalPrice] = useState(pricePerHour);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.bookings);
  const { userInfo } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'duration') {
      setTotalPrice(pricePerHour * value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userInfo) {
      navigate('/login', { state: { from: `/skills/${skillId}` } });
      return;
    }

    const bookingData = {
      skillId,
      instructorId,
      date: formData.date,
      duration: formData.duration,
    };

    dispatch(createBooking(bookingData))
      .unwrap()
      .then(() => {
        toast.success('Booking confirmed!');
        navigate('/dashboard/bookings');
      })
      .catch((err) => {
        console.error('Booking failed:', err);
        toast.error('Failed to book. Please try again.');
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-gradient-to-br from-white via-sky-50 to-white p-8 rounded-2xl shadow-2xl max-w-lg mx-auto border border-gray-200 mt-10"
    >
      <h3 className="text-3xl font-bold mb-6 text-gray-800">📅 Book This Skill</h3>

      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date and Time */}
        <div>
          <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
            Select Date & Time
          </label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            min={new Date().toISOString().slice(0, 16)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Duration Dropdown */}
        <div>
          <label htmlFor="duration" className="block text-gray-700 font-medium mb-2">
            Duration (in hours)
          </label>
          <select
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {[...Array(8)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} hour{(i + 1) > 1 && 's'}
              </option>
            ))}
          </select>
        </div>

        {/* Total Price */}
        <div className="text-lg font-semibold text-gray-800">
          Total Price: <span className="text-blue-600">₹{totalPrice.toFixed(2)}</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !formData.date}
          className={`w-full py-3 text-white font-semibold rounded-lg transition duration-300 ${
            loading || !formData.date
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Processing...' : '✅ Confirm Booking'}
        </button>
      </form>
    </motion.div>
  );
};

export default BookingForm;
