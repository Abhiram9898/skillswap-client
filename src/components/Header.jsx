import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const { userInfo: user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  return (
    <motion.header
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white shadow-md sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link to="/" className="text-3xl font-bold text-indigo-600">
          Skill<span className="text-gray-800">Swap</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
          <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
          {user && <Link to="/dashboard" className="hover:text-indigo-600">Dashboard</Link>}
          {user?.role === 'admin' && (
            <Link to="/admin/dashboard" className="hover:text-indigo-600">Admin</Link> 
          )}
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition shadow cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:text-indigo-600 cursor-pointer">Login</Link>
              <Link
                to="/register"
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md shadow"
              >
                Register
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-6 pb-4 space-y-3 text-gray-700 font-medium animate-fadeIn">
          <Link to="/" className="block hover:text-indigo-600" onClick={toggleMobileMenu}>Home</Link>
          {user && (
            <Link to="/dashboard" className="block hover:text-indigo-600" onClick={toggleMobileMenu}>Dashboard</Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin/dashboard" className="block hover:text-indigo-600" onClick={toggleMobileMenu}>Admin</Link> 
          )}
          {user ? (
            <button
              onClick={() => {
                toggleMobileMenu();
                handleLogout();
              }}
              className="w-full text-left bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md shadow cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="block hover:text-indigo-600 cursor-pointer" onClick={toggleMobileMenu}>
                Login
              </Link>
              <Link
                to="/register"
                className="block bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md shadow cursor-pointer"
                onClick={toggleMobileMenu}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </motion.header>
  );
};

export default Header;
