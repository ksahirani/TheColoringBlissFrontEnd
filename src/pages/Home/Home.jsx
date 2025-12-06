import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowRight, Sparkles, Heart, Truck, ShieldCheck, Star } from 'lucide-react';
import { getFeaturedProducts, getNewArrivals } from '../../store/slices/productSlice';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const { featuredProducts, newArrivals, loading } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(getFeaturedProducts());
    dispatch(getNewArrivals());
  }, [dispatch]);

  const features = [
    {
      icon: Sparkles,
      title: 'Premium Quality',
      description: 'Crafted with the finest materials for the best writing experience',
      color: '#8b5cf6'
    },
    {
      icon: Heart,
      title: 'Made with Love',
      description: 'Every notebook is designed with passion and attention to detail',
      color: '#ec4899'
    },
    {
      icon: Truck,
      title: 'Fast Shipping',
      description: 'Free delivery on orders over ₱1,500. Quick & reliable!',
      color: '#10b981'
    },
    {
      icon: ShieldCheck,
      title: 'Secure Shopping',
      description: '100% secure checkout. Your data is always protected',
      color: '#3b82f6'
    }
  ];

  const categories = [
    { name: 'Notebooks', emoji: '📓', slug: 'notebooks', color: '#fce7f3' },
    { name: 'Journals', emoji: '📔', slug: 'journals', color: '#ede9fe' },
    { name: 'Planners', emoji: '📅', slug: 'planners', color: '#dbeafe' },
    { name: 'Sketchbooks', emoji: '🎨', slug: 'sketchbooks', color: '#d1fae5' },
  ];

  const testimonials = [
    {
      name: 'Chris Mortel',
      role: 'Design Student',
      text: 'The paper quality is amazing! My drawings look so good on these pages. 10/10 would recommend! 💖',
      avatar: '👨‍💼'
    },
    {
      name: 'Randolf Saldonido',
      role: 'Entrepreneur',
      text: 'Finally found a planner that\'s both cute AND functional. Perfect for keeping my business organized!',
      avatar: '👨‍💼'
    },
    {
      name: 'Jared Tolentino',
      role: 'Content Creator',
      text: 'These notebooks are so aesthetic! They look amazing in my flat lays. My followers love them too! ✨',
      avatar: '👨‍💼'
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__decoration">
          <span className="hero__emoji hero__emoji--1">📓</span>
          <span className="hero__emoji hero__emoji--2">✏️</span>
          <span className="hero__emoji hero__emoji--3">🌸</span>
          <span className="hero__emoji hero__emoji--4">⭐</span>
          <span className="hero__emoji hero__emoji--5">💜</span>
        </div>
        
        <div className="container">
          <div className="hero__content">
            <span className="hero__badge">✨ New Collection Just Dropped!</span>
            <h1>
              Write Your Story in <span className="highlight">Style</span>
            </h1>
            <p>
              Discover beautifully crafted notebooks, journals, and planners 
              designed to spark creativity and organize your life. 
              Because your ideas deserve a beautiful home! 💫
            </p>
            <div className="hero__cta">
              <Link to="/shop" className="btn btn--primary btn--large">
                Shop Now <ArrowRight size={20} />
              </Link>
              <Link to="/about" className="btn btn--secondary btn--large">
                Our Story
              </Link>
            </div>
            <div className="hero__stats">
              <div className="hero__stat">
                <span className="hero__stat-number">50K+</span>
                <span className="hero__stat-label">Happy Customers</span>
              </div>
              <div className="hero__stat">
                <span className="hero__stat-number">4.9</span>
                <span className="hero__stat-label">Star Rating ⭐</span>
              </div>
              <div className="hero__stat">
                <span className="hero__stat-number">100+</span>
                <span className="hero__stat-label">Unique Designs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <div className="section-header">
            <h2>Shop by Category 🛍️</h2>
            <p>Find the perfect notebook for every purpose!</p>
          </div>
          <div className="categories__grid">
            {categories.map(category => (
              <Link 
                key={category.slug}
                to={`/shop?category=${category.slug}`}
                className="category-card"
                style={{ backgroundColor: category.color }}
              >
                <span className="category-card__emoji">{category.emoji}</span>
                <h3>{category.name}</h3>
                <span className="category-card__arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured">
        <div className="container">
          <div className="section-header">
            <h2>Fan Favorites 💕</h2>
            <p>Our most-loved products, picked by you!</p>
          </div>
          {loading ? (
            <div className="products-loading">
              <div className="loading-spinner" />
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts?.slice(0, 4).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          <div className="section-cta">
            <Link to="/shop?featured=true" className="btn btn--outline">
              View All Best Sellers <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="features-banner">
        <div className="container">
          <div className="features-banner__grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-item">
                <div 
                  className="feature-item__icon"
                  style={{ backgroundColor: `${feature.color}20`, color: feature.color }}
                >
                  <feature.icon size={24} />
                </div>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="new-arrivals">
        <div className="container">
          <div className="section-header">
            <h2>Fresh Drops 🆕</h2>
            <p>Hot off the press! Check out our newest additions.</p>
          </div>
          {loading ? (
            <div className="products-loading">
              <div className="loading-spinner" />
            </div>
          ) : (
            <div className="products-grid">
              {newArrivals?.slice(0, 4).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          <div className="section-cta">
            <Link to="/shop?newArrivals=true" className="btn btn--outline">
              See All New Arrivals <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>What Our Customers Say 💬</h2>
            <p>Don't just take our word for it!</p>
          </div>
          <div className="testimonials__grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-card__stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />
                  ))}
                </div>
                <p className="testimonial-card__text">"{testimonial.text}"</p>
                <div className="testimonial-card__author">
                  <span className="testimonial-card__avatar">{testimonial.avatar}</span>
                  <div>
                    <p className="testimonial-card__name">{testimonial.name}</p>
                    <p className="testimonial-card__role">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="home-cta">
        <div className="container">
          <div className="home-cta__content">
            <h2>Ready to Start Your Journey? ✨</h2>
            <p>Join thousands of happy customers who've found their perfect notebook!</p>
            <Link to="/shop" className="btn btn--primary btn--large">
              Start Shopping 🛒
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;