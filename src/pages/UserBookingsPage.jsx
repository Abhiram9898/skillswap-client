// src/pages/UserBookingsPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserBookings } from '../redux/bookingSlice';
import { format } from 'date-fns';
import { FaClockRotateLeft } from 'react-icons/fa6';

const UserBookingsPage = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { userBookings, loading, error } = useSelector((state) => state.bookings);

  useEffect(() => {
    if (userInfo?._id) {
      dispatch(fetchUserBookings(userInfo._id));
    }
  }, [dispatch, userInfo]);

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <FaClockRotateLeft className="text-2xl text-gray-700" />
        <h2 className="text-3xl font-bold text-gray-800">Your Bookings</h2>
      </div>

      {loading && <p className="text-blue-600">Loading bookings...</p>}
      {error && <p className="text-red-500">❌ {error}</p>}

      {!loading && userBookings.length === 0 ? (
        <p className="text-gray-600">You haven't made any bookings yet.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {userBookings.map((booking) => {
            const statusStyles = {
              pending: 'bg-yellow-100 text-yellow-800',
              confirmed: 'bg-green-100 text-green-700',
              cancelled: 'bg-red-100 text-red-700',
            };

            return (
              <div key={booking._id} className="bg-white shadow-lg rounded-xl p-5 border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {booking.skillId?.title || 'Untitled Skill'}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusStyles[booking.status] || 'bg-gray-100 text-gray-600'}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <p className="text-gray-700 text-sm mb-1">
                  <strong>Category:</strong> {booking.skillId?.category || '—'}
                </p>

                <p className="text-gray-700 text-sm mb-1">
                  <strong>Session Date:</strong>{' '}
                  {booking.date ? format(new Date(booking.date), 'PPP • p') : 'Not scheduled'}
                </p>

                <div className="flex items-center mt-3">
                  {booking.instructorId?.avatar ? (
                    <img
                      src={booking.instructorId.avatar}
                      alt="Instructor"
                      className="w-10 h-10 rounded-full object-cover border mr-3"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-gray-500 font-bold">
                      ?
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      {booking.instructorId?.name || 'Unknown Instructor'}
                    </p>
                    <p className="text-xs text-gray-500">Instructor</p>
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

export default UserBookingsPage;