import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstructorBookings, updateBookingStatus, cancelBooking } from '../redux/bookingSlice';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom'; // Import Link for navigation

const InstructorBookingsPage = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { instructorBookings = [], loading, error } = useSelector((state) => state.bookings);

  useEffect(() => {
    if (userInfo?._id) {
      dispatch(fetchInstructorBookings(userInfo._id));
    }
  }, [dispatch, userInfo]);

  const getStatusStyle = (status) => {
    const base = "inline-block px-2 py-1 text-xs font-semibold rounded";
    switch (status) {
      case 'pending':
        return `${base} bg-yellow-100 text-yellow-800`;
      case 'confirmed':
        return `${base} bg-green-100 text-green-800`;
      case 'cancelled':
        return `${base} bg-red-100 text-red-800`;
      case 'completed':
        return `${base} bg-blue-100 text-blue-800`;
      default:
        return `${base} bg-gray-100 text-gray-800`;
    }
  };

  const handleConfirmBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to confirm this booking?')) {
      try {
        await dispatch(updateBookingStatus({ bookingId, status: 'confirmed' })).unwrap();
        toast.success('Booking confirmed successfully!');
        dispatch(fetchInstructorBookings(userInfo._id)); 
      } catch (err) {
        console.error('Failed to confirm booking:', err);
        toast.error(err.message || 'Failed to confirm booking.');
      }
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await dispatch(cancelBooking(bookingId)).unwrap();
        toast.success('Booking cancelled successfully!');
        dispatch(fetchInstructorBookings(userInfo._id));
      } catch (err) {
        console.error('Failed to cancel booking:', err);
        toast.error(err.message || 'Failed to cancel booking.');
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">📚 Instructor Bookings</h1>

      {loading && (
        <p className="text-blue-600 animate-pulse">Loading bookings...</p>
      )}

      {error && (
        <p className="text-red-500 mb-4">❌ Error: {error}</p>
      )}

      {!loading && instructorBookings.length === 0 ? (
        <p className="text-gray-600">No bookings available yet.</p>
      ) : (
        <ul className="space-y-4">
          {instructorBookings.map((booking) => (
            <li
              key={booking._id}
              className="p-4 bg-white border rounded-xl shadow-sm hover:shadow transition"
            >
              <p><strong>🛠 Skill:</strong> {booking.skillId?.title || 'N/A'}</p>
              <p><strong>👤 Student:</strong> {booking.userId?.name || 'N/A'}</p>
              <p><strong>📅 Date:</strong> {format(new Date(booking.date), 'PPPpp')}</p>
              <p>
                <strong>📌 Status:</strong>{' '}
                <span className={getStatusStyle(booking.status)}>
                  {booking.status}
                </span>
              </p>

              <div className="mt-4 flex gap-2 flex-wrap"> {/* Added flex-wrap for small screens */}
                {/* Action Buttons (Conditional Rendering based on status) */}
                {booking.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleConfirmBooking(booking._id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                      disabled={loading}
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </>
                )}
                {booking.status === 'confirmed' && (
                  <>
                    <button
                      onClick={() => handleConfirmBooking(booking._id, 'completed')} // This would need a separate handler if 'completed' is a distinct action
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                      disabled={loading}
                    >
                      Mark as Completed
                    </button>
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </>
                )}
                {/* Chat Button - always available if not cancelled */}
                {booking.status !== 'cancelled' && (
                  <Link
                    to={`/chat/${booking._id}`} // Navigate to chat with booking ID
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                  >
                    Chat with Student
                  </Link>
                )}
              </div>

              {/* Display meeting link if confirmed and available */}
              {booking.status === 'confirmed' && booking.meetingLink && (
                <div className="mt-3">
                  <p className="text-sm text-gray-700">
                    <strong>Meeting Link:</strong>{' '}
                    <a 
                      href={booking.meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline"
                    >
                      {booking.meetingLink}
                    </a>
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InstructorBookingsPage;
