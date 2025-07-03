import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserBookings } from '../redux/bookingSlice';
import { FaCalendarAlt, FaClock, FaUserTie, FaMoneyBillAlt } from 'react-icons/fa';
import { FaClockRotateLeft } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const MyBookingsPage = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { userBookings, loading, error } = useSelector((state) => state.bookings);

  useEffect(() => {
    if (userInfo?._id) {
      dispatch(fetchUserBookings(userInfo._id));
    }
  }, [dispatch, userInfo]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">📅 My Bookings</h2>

      {loading ? (
        <div className="text-blue-600 animate-pulse">Loading your bookings...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : userBookings.length === 0 ? (
        <div className="text-gray-500">You haven’t booked any sessions yet.</div>
      ) : (
        <div className="grid gap-6">
          {userBookings.map((booking) => {
            const date = new Date(booking.date);
            const duration = booking.duration || 1;
            const price = booking.skillId?.pricePerHour
              ? booking.skillId.pricePerHour * duration
              : 'N/A';

            return (
              <div
                key={booking._id}
                className="bg-white border rounded-lg shadow p-5 hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="w-full">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {booking.skillName || booking.skillId?.title || 'Untitled Skill'}
                    </h3>

                    <div className="mt-2 text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-blue-500" />
                        <span>
                          {date.toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaClock className="text-purple-600" />
                        <span>
                          {date.toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaClockRotateLeft className="text-teal-500" />
                        <span>{duration} hour{duration > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaUserTie className="text-indigo-600" />
                        <span>{booking.instructorId?.name || 'Instructor'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMoneyBillAlt className="text-green-600" />
                        <span>₹{price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2 mt-4 sm:mt-0">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize
                      ${
                        booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {booking.status}
                    </span>

                    <Link
                      to={`/chat/${booking._id}`}
                      className="inline-block text-sm bg-indigo-600 text-white px-4 py-1.5 rounded hover:bg-indigo-700 transition"
                    >
                      💬 Join Chat
                    </Link>

                    <button
                      onClick={() => alert('Cancel booking logic here')}
                      disabled={booking.status !== 'pending'}
                      className="text-sm border border-red-500 text-red-500 px-4 py-1.5 rounded hover:bg-red-50 disabled:opacity-50"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
