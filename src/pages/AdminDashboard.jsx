import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, getUserStats } from '../redux/userSlice';
import { fetchSkills } from '../redux/skillSlice';
import { fetchAllBookings } from '../redux/bookingSlice';
import { motion } from 'framer-motion';
import StatCard from '../components/StatCard';
import TableCard from '../components/TableCard';
import FadeCard from '../components/FadeCard';

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const { users = [], stats: userStats, loading: userLoading } = useSelector((state) => state.user);
  const { skills = [], loading: skillLoading } = useSelector((state) => state.skills);
  const { adminBookings: bookings = [], loading: bookingLoading } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(getUserStats());
    dispatch(fetchSkills());
    dispatch(fetchAllBookings());
  }, [dispatch]);

  const loading = userLoading || skillLoading || bookingLoading;

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-indigo-600 text-xl font-semibold animate-pulse">
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-10"
    >
      <h1 className="text-4xl font-bold mb-10 text-gray-800">🚀 Admin Dashboard</h1>

      {/* Stat Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.15 },
          },
        }}
      >
        <FadeCard>
          <StatCard
            title="Total Users"
            value={userStats?.totalUsers || users.length || 0}
            subtitle={`${userStats?.newUsersThisMonth || 0} new this month`}
            color="indigo"
          />
        </FadeCard>
        <FadeCard>
          <StatCard
            title="Total Skills"
            value={skills.length}
            subtitle="Across all categories"
            color="green"
          />
        </FadeCard>
        <FadeCard>
          <StatCard
            title="Total Bookings"
            value={bookings.length}
            subtitle="Session records"
            color="purple"
          />
        </FadeCard>
      </motion.div>

      {/* Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FadeCard>
          <TableCard
            title="🧑‍💻 Recent Users"
            data={users.slice(0, 5)}
            columns={['Name', 'Email', 'Role']}
            renderRow={(user) => (
              <tr key={user._id} className="border-t text-sm text-gray-700">
                <td className="py-2">{user.name}</td>
                <td className="py-2">{user.email}</td>
                <td className="py-2 capitalize">{user.role}</td>
              </tr>
            )}
          />
        </FadeCard>

        <FadeCard>
          <TableCard
            title="📅 Recent Bookings"
            data={bookings.slice(0, 5)}
            columns={['Skill', 'Student', 'Status']}
            renderRow={(b) => (
              <tr key={b._id} className="border-t text-sm text-gray-700">
                <td className="py-2">{b.skillId?.title || 'N/A'}</td>
                <td className="py-2">{b.userId?.name || 'N/A'}</td>
                <td className="py-2 capitalize">{b.status}</td>
              </tr>
            )}
          />
        </FadeCard>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
