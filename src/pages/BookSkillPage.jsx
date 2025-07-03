import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createBooking } from '../redux/bookingSlice';
import { toast } from 'react-toastify';

const BookSkillPage = () => {
  const { id: skillId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.bookings);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(1); // default 1 hour

  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split('T')[0];

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!userInfo || !userInfo.token) {
      toast.error('Please login to book a session');
      return;
    }

    if (!date || !time) {
      toast.error('Please select both date and time');
      return;
    }

    const dateTime = new Date(`${date}T${time}`);

    const bookingData = {
      skillId,
      date: dateTime.toISOString(),
      duration,
    };

    try {
      await dispatch(createBooking(bookingData)).unwrap();
      toast.success('Booking confirmed!');
      navigate('/bookings');
    } catch (error) {
      console.error('Booking failed:', error);
      toast.error(error?.message || 'Booking failed');

      if (error?.errors && Array.isArray(error.errors)) {
        error.errors.forEach((err) => toast.error(err.msg || err.message));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <form
        onSubmit={handleBooking}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">📅 Book Session</h2>

        {loading && <p className="text-blue-600 mb-4">Creating booking...</p>}
        {error && <p className="text-red-500 mb-4">❌ {error}</p>}

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={today}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-700">Duration (in hours)</label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
            required
          >
            <option value={1}>1 Hour</option>
            <option value={2}>2 Hours</option>
            <option value={3}>3 Hours</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading}
        >
          ✅ Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookSkillPage;
