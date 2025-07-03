import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, addMessage } from '../redux/chatSlice';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion';

// Helper function to manage localStorage with size limits
const useChatCache = (bookingId, messages) => {
  const MAX_CACHE_SIZE = 2 * 1024 * 1024; // 2MB
  const MAX_MESSAGES = 50; // Keep last 50 messages

  useEffect(() => {
    if (!bookingId || messages.length === 0) return;

    try {
      const cacheKey = `chat-${bookingId}`;
      
      // Only cache the most recent messages
      const messagesToCache = messages.slice(-MAX_MESSAGES);
      
      // Check estimated size
      const cacheString = JSON.stringify({
        messages: messagesToCache,
        timestamp: Date.now()
      });

      if (cacheString.length > MAX_CACHE_SIZE) {
        console.warn('Message cache too large, not storing in localStorage');
        return;
      }

      localStorage.setItem(cacheKey, cacheString);
    } catch (error) {
      console.error('Error caching messages:', error);
    }
  }, [bookingId, messages]);
};

const ChatComponent = ({ bookingId }) => {
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.chat);
  const { userInfo } = useSelector((state) => state.auth);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // Use our improved caching hook
  useChatCache(bookingId, messages);

  // Load cached messages with size checks
  useEffect(() => {
    if (bookingId && !loading && messages.length === 0) {
      try {
        const cacheKey = `chat-${bookingId}`;
        const cachedData = localStorage.getItem(cacheKey);
        
        if (cachedData) {
          // Verify the cached data isn't too large before parsing
          if (cachedData.length > 2 * 1024 * 1024) { // 2MB
            console.warn('Cached messages too large, skipping load');
            localStorage.removeItem(cacheKey);
            return;
          }

          const parsedData = JSON.parse(cachedData);
          if (parsedData?.messages && Array.isArray(parsedData.messages)) {
            // Only use cache if it's less than 1 hour old
            const oneHourAgo = Date.now() - 60 * 60 * 1000;
            if (parsedData.timestamp > oneHourAgo) {
              dispatch(addMessage(parsedData.messages));
            } else {
              localStorage.removeItem(cacheKey);
            }
          }
        }
      } catch (e) {
        console.error('Failed to load cached messages', e);
        localStorage.removeItem(`chat-${bookingId}`);
      }
    }
  }, [bookingId, loading, messages.length, dispatch]);

  // Fetch messages when bookingId changes
  useEffect(() => {
    if (bookingId) {
      dispatch(fetchMessages(bookingId));
    }
  }, [dispatch, bookingId]);

  // Socket.IO connection and message handling
  useEffect(() => {
    if (!bookingId || !userInfo?.token) return;

    const setupSocket = () => {
      socketRef.current = io(import.meta.env.VITE_API_URL, {
        auth: { token: userInfo.token },
        transports: ['websocket'],
        path: '/socket.io/',
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current.on('connect', () => {
        socketRef.current.emit('joinRoom', bookingId);
      });

      socketRef.current.on('receiveMessage', (data) => {
        if (data.bookingId === bookingId) {
          dispatch(addMessage(normalizeMessage(data)));
        }
      });

      socketRef.current.on('error', (err) => {
        console.error('Socket error:', err);
      });
    };

    setupSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.off('receiveMessage');
        socketRef.current.disconnect();
      }
    };
  }, [bookingId, dispatch, userInfo]);

  const normalizeMessage = (message) => ({
    ...message,
    sender: {
      _id: message.sender?._id || message.senderId,
      name: message.sender?.name || 
           (message.sender?.role === 'instructor' ? 'Instructor' : 'Student'),
      role: message.sender?.role || 'student',
      avatar: message.sender?.avatar || getDefaultAvatar(message.sender?.role)
    }
  });

  const getDefaultAvatar = (role) => {
    return role === 'instructor' 
      ? 'https://placehold.co/40x40/3b82f6/white?text=I' 
      : 'https://placehold.co/40x40/10b981/white?text=S';
  };

  // Auto-scroll to bottom with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || !socketRef.current || !userInfo) return;

    const newMessage = {
      bookingId,
      message: message.trim(),
      sender: {
        _id: userInfo._id,
        name: userInfo.name || (userInfo.role === 'instructor' ? 'Instructor' : 'Student'),
        role: userInfo.role,
        avatar: userInfo.avatar || getDefaultAvatar(userInfo.role)
      }
    };

    socketRef.current.emit('sendMessage', newMessage);
    setMessage('');
  };

  const getMessageTime = (dateString) => {
    try {
      return new Date(dateString).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading && (
          <div className="text-center py-4 text-gray-500">
            Loading messages...
          </div>
        )}
        
        {error && (
          <div className="text-center py-4 text-red-500">
            {error}
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No messages yet. Start the conversation!
          </div>
        )}

        {messages.map((msg) => {
          const isCurrentUser = userInfo && msg.sender?._id === userInfo._id;
          const senderName = msg.sender?.name || 
                          (msg.sender?.role === 'instructor' ? 'Instructor' : 'Student');
          const senderAvatar = msg.sender?.avatar || 
                            getDefaultAvatar(msg.sender?.role);

          return (
            <motion.div
              key={msg._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} gap-2`}
            >
              {!isCurrentUser && (
                <img
                  src={senderAvatar}
                  alt={senderName}
                  className="w-8 h-8 rounded-full mt-1 flex-shrink-0"
                  onError={(e) => {
                    e.target.src = getDefaultAvatar(msg.sender?.role);
                  }}
                />
              )}

              <div
                className={`max-w-[80%] md:max-w-[60%] rounded-lg p-3 ${
                  isCurrentUser
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-white border rounded-bl-none shadow-sm'
                }`}
              >
                {!isCurrentUser && (
                  <p className="font-medium text-sm mb-1 flex items-center">
                    {senderName}
                    {msg.sender?.role === 'instructor' && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        Instructor
                      </span>
                    )}
                  </p>
                )}
                <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                <p 
                  className={`text-xs opacity-70 mt-1 ${
                    isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {getMessageTime(msg.createdAt)}
                </p>
              </div>

              {isCurrentUser && (
                <img
                  src={userInfo.avatar || getDefaultAvatar(userInfo.role)}
                  alt="You"
                  className="w-8 h-8 rounded-full mt-1 flex-shrink-0"
                  onError={(e) => {
                    e.target.src = getDefaultAvatar(userInfo?.role);
                  }}
                />
              )}
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form 
        onSubmit={handleSubmit} 
        className="border-t bg-white p-4 sticky bottom-0"
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            aria-label="Type your message"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50"
            aria-label="Send message"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;