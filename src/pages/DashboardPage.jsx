import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const cards = [
    {
      title: 'My Bookings',
      desc: 'Manage your sessions',
      link: '/my-bookings',
      color: 'blue',
    },
    {
      title: 'My Skills',
      desc: 'View or create skills',
      link: '/skills',
      color: 'green',
    },
    {
      title: 'Profile',
      desc: 'Edit your info',
      link: `/profile/${userInfo?._id}`,
      color: 'yellow',
    },
    {
      title: 'Chat',
      desc: 'View conversations',
      link: '/chat',
      color: 'purple',
    },
  ];

  const colorClasses = {
    blue: {
      border: 'border-blue-500',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
    },
    green: {
      border: 'border-green-500',
      bg: 'bg-green-50',
      text: 'text-green-700',
    },
    yellow: {
      border: 'border-yellow-500',
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
    },
    purple: {
      border: 'border-purple-500',
      bg: 'bg-purple-50',
      text: 'text-purple-700',
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 py-10 px-4"
    >
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-10">
          Welcome, {userInfo?.name || 'User'}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {cards.map((card, idx) => {
            const color = colorClasses[card.color];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`rounded-lg p-6 ${color.border} ${color.bg} border-l-4`}
              >
                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                <p className="text-gray-600 mb-3">{card.desc}</p>
                <Link
                  to={card.link}
                  className={`font-medium hover:underline ${color.text}`}
                >
                  Go →
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
