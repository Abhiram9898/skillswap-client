import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute = () => {
  const { userInfo, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  // Show loading spinner while auth state is initializing
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen" role="status">
        <span className="text-blue-600 text-lg animate-pulse">Loading...</span>
      </div>
    );
  }

  // If authenticated, allow route access; otherwise redirect to login
  return userInfo ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

export default PrivateRoute;
