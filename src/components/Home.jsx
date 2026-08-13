import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="luxury-home">
      {/* Hero Section */}
      <section className="hero-section flex items-center justify-center">
        <div className="hero-bg">
           <img 
            src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2069&auto=format&fit=crop" 
            alt="Luxury Aesthetic" 
          />
        </div>
        <div className="hero-content flex-col items-center">
          <h1 className="hero-title">BEYOND PERFORMANCE</h1>
          <p className="hero-subtitle">Discover the exclusive collection</p>
          <Link to="/products" className="btn-primary mt-4">Explore Collection</Link>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="featured-section container">
        <h2 className="section-title text-center">THE MASTERPIECES</h2>
        
        <div className="collection-grid">
          <div className="collection-card large">
            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80" alt="Watch" />
            <div className="card-overlay flex-col justify-end">
              <h3>Timepieces</h3>
              <Link to="/products" className="discover-link">Discover</Link>
            </div>
          </div>
          
          <div className="collection-card">
            <img src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80" alt="Audio" />
            <div className="card-overlay flex-col justify-end">
              <h3>Acoustics</h3>
              <Link to="/products" className="discover-link">Discover</Link>
            </div>
          </div>
          
          <div className="collection-card">
            <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80" alt="Tech" />
            <div className="card-overlay flex-col justify-end">
              <h3>Technology</h3>
              <Link to="/products" className="discover-link">Discover</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="brand-story-section flex items-center">
        <div className="story-content container">
          <h2 className="story-title">UNCOMPROMISING LUXURY</h2>
          <p className="story-text">
            For those who demand nothing but the absolute best. KuKu Kart curates 
            a selection of the world's most exquisite technology and lifestyle products. 
            Form, function, and perfection.
          </p>
          <Link to="/products" className="btn-secondary mt-4">Read The Story</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
