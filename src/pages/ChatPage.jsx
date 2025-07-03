// src/pages/ChatPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom'; // NEW: Import useParams
import ChatComponent from '../pages/ChatComponent'; // NEW: Import ChatComponent
import { useSelector } from 'react-redux'; // Needed for the header profile logic

// Import these to fetch booking details for the header profile
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUserBookings } from '../redux/bookingSlice'; // To find the current booking object
import { getUserDetails } from '../redux/userSlice'; // To get other user's profile


const ChatPage = () => {
  const { bookingId } = useParams(); // Extract bookingId from the URL

  // --- Logic for displaying other user's profile in ChatPage header ---
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { userBookings } = useSelector((state) => state.bookings);
  const { user: otherUserDetail, loading: userLoading, error: userError } = useSelector((state) => state.user);

  const [currentBooking, setCurrentBooking] = useState(null);
  const [otherParticipantId, setOtherParticipantId] = useState(null);

  // Effect to find the current booking and identify the other participant
  useEffect(() => {
    if (userBookings.length > 0 && bookingId && userInfo) {
      const foundBooking = userBookings.find(b => b._id === bookingId);
      if (foundBooking) {
        setCurrentBooking(foundBooking);
        if (foundBooking.userId?._id === userInfo._id) {
          setOtherParticipantId(foundBooking.instructorId?._id);
        } else if (foundBooking.instructorId?._id === userInfo._id) {
          setOtherParticipantId(foundBooking.userId?._id);
        }
      } else {
        // If booking not found in userBookings, potentially fetch it directly
        // (This would require a new thunk like fetchBookingById in bookingSlice)
        console.warn('Booking not found in userBookings for chat. Ensure bookings are loaded.');
      }
    }
  }, [userBookings, bookingId, userInfo]);

  // Effect to fetch other participant's details once their ID is known
  useEffect(() => {
    if (otherParticipantId) {
      dispatch(getUserDetails(otherParticipantId));
    }
  }, [dispatch, otherParticipantId]);
  // --- End of header profile logic ---

  const isLoadingHeader = userLoading;
  const hasErrorHeader = userError;


  return (
    // Outer container for the chat page, applying general layout and background
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Main chat container - fixed width/height for chat interface */}
      <div className="w-full max-w-4xl h-full md:h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200">
        
        {/* Chat Header with Other User's Profile (Moved from ChatComponent) */}
        <div className="bg-blue-600 text-white p-4 flex items-center shadow-md">
          {isLoadingHeader && !otherUserDetail ? (
            <p className="text-sm animate-pulse">Loading participant info...</p>
          ) : hasErrorHeader ? (
            <p className="text-sm text-red-200">Error loading participant.</p>
          ) : otherUserDetail ? (
            <>
              <img
                src={otherUserDetail.avatar || 'https://placehold.co/40x40/E0E0E0/333333?text=User'}
                alt={otherUserDetail.name}
                className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-white"
              />
              <div>
                <h3 className="text-lg font-semibold">{otherUserDetail.name}</h3>
                <p className="text-xs opacity-80 capitalize">{otherUserDetail.role}</p>
              </div>
            </>
          ) : (
            <p className="text-sm opacity-80">Select a chat to view participant.</p>
          )}
        </div>

        {/* Conditionally render ChatComponent if bookingId is available */}
        {bookingId ? (
          // This div ensures ChatComponent fills available space within the main container
          <div className="flex-1 flex flex-col">
            <ChatComponent bookingId={bookingId} /> {/* Pass the extracted bookingId to ChatComponent */}
          </div>
        ) : (
          // Fallback message if no bookingId is provided in the URL
          <div className="flex-1 flex items-center justify-center bg-gray-50 text-center text-lg text-gray-500 p-4">
            <p className="max-w-md">Please select a booking from your <a href="/my-bookings" className="text-blue-600 hover:underline">My Bookings</a> or <a href="/instructor/bookings" className="text-blue-600 hover:underline">Instructor Bookings</a> page to view its chat.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
