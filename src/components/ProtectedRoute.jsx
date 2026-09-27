import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-accent text-xs tracking-widest uppercase">
        Verifying Credentials...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <div className="container py-24 flex items-center justify-center text-center">
        <div className="p-8 border border-border bg-surface max-w-md w-full">
          <ShieldAlert size={48} className="mx-auto text-error mb-4" />
          <h2 className="text-xl font-heading mb-2">ACCESS RESTRICTED</h2>
          <p className="text-xs text-muted mb-6">
            Your current account role (<strong>{user?.role?.toUpperCase() || 'CUSTOMER'}</strong>) does not have privileges to view this portal.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/" className="btn-secondary text-xs py-2 px-4 flex items-center gap-1">
              <ArrowLeft size={14} /> Back to Store
            </Link>
            <Link to="/login" className="btn-primary text-xs py-2 px-4 font-bold">
              Switch Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
