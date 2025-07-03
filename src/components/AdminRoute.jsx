import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const { userInfo, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen" role="status" aria-live="polite">
        <span className="text-blue-600 text-lg animate-pulse">Loading admin area...</span>
      </div>
    );
  }

  if (userInfo?.role === 'admin') {
    return <Outlet />;
  }

  // Optional: Use toast/notification here to show an access-denied message
  return <Navigate to={userInfo ? '/' : '/login'} replace />;
};

export default AdminRoute;
