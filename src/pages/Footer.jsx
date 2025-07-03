import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white shadow mt-4 py-6">
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-gradient-to-b from-transparent to-gray-50">
        {/* Brand / Logo */}
        <div>
          <h2 className="text-xl font-bold text-indigo-600">SkillSwap</h2>
          <p className="text-sm text-gray-500 mt-2">
            Empowering peer-to-peer learning for everyone.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-2">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <Link to="/" className="hover:text-indigo-600">Home</Link>
            </li>
            <li>
              <Link to="/skills" className="hover:text-indigo-600">Skills</Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-indigo-600">Register</Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-indigo-600">Login</Link>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-2">Follow Us</h3>
          <div className="flex space-x-4 text-gray-600">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-indigo-600"
            >
              <FaFacebook size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-indigo-600"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:text-indigo-600"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:text-indigo-600"
            >
              <FaGithub size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm text-gray-500 py-2 border-t border-gray-100">
        © {new Date().getFullYear()} SkillSwap. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
