import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page container flex-col items-center justify-center">
      <Compass size={64} color="var(--color-accent)" className="mb-4" />
      <h1 className="error-code">404</h1>
      <h2 className="error-title">EXCLUSIVE DESTINATION NOT FOUND</h2>
      <p className="error-desc text-muted mb-8 text-center">
        The acquisition path you are attempting to access does not exist or has been relocated.
      </p>
      <div className="flex gap-4">
        <Link to="/" className="btn-primary">RETURN TO SHOWROOM</Link>
        <Link to="/products" className="btn-secondary">EXPLORE COLLECTION</Link>
      </div>
    </div>
  );
};

export default NotFound;
