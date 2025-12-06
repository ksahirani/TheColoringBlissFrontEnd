import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Target, Users, Leaf, Award } from 'lucide-react';
import './About.css';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Made with Love',
      description: 'Every notebook is crafted with passion and attention to detail, because your thoughts deserve a beautiful home.'
    },
    {
      icon: Sparkles,
      title: 'Spark Creativity',
      description: 'We believe in the magic of putting pen to paper. Our products are designed to inspire your best ideas.'
    },
    {
      icon: Leaf,
      title: 'Eco-Friendly',
      description: 'We care about our planet! Our papers are sustainably sourced and our packaging is recyclable.'
    },
    {
      icon: Award,
      title: 'Quality First',
      description: 'Premium materials, smooth papers, and durable covers. We never compromise on quality.'
    }
  ];

  const team = [
    {
      name: 'Sherryl May Gareza',
      role: 'Founder & CEO, Social Media Manager, Customer Service',
      emoji: '✨',
      quote: 'I started this because I believe everyone deserves a notebook that makes them excited to write!'
    },
    {
      name: 'Kenon Sahirani',
      role: 'Full Stack Web Developer, Operations and Product Manager',
      emoji: '🎨',
      quote: 'Code with precision. Create with passion.'
    },
    {
      name: 'Emmanuel Diwata',
      role: 'Full Stack Web Developer, Marketing Specialist',
      emoji: '🎨',
      quote: 'Designing vibrant creations, developing powerful solutions.'
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero__decoration">
          <span className="floating-emoji">📓</span>
          <span className="floating-emoji">✏️</span>
          <span className="floating-emoji">🌸</span>
          <span className="floating-emoji">⭐</span>
        </div>
        <div className="container">
          <div className="about-hero__content">
            <span className="about-hero__badge">🎉 Welcome to The Coloring-Bliss! 🎉</span>
            <h1>We're <span className="highlight">TheColoringBliss</span></h1>
            <p className="about-hero__subtitle">
              Welcome to The Coloring Bliss your happy place for all things bright,
              bold, and beautifully creative! We're an online stationery brand
              dedicated to bringing a splash of colour and a burst of fun into
              everyday writing.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-story">
        <div className="container">
          <div className="about-story__grid">
            <div className="about-story__image">
              <div className="story-image-placeholder">
                <span>📚</span>
                <p>Our Story</p>
              </div>
            </div>
            <div className="about-story__content">
              <h2>Our Story: How Everything Started <span className="emoji-inline">💫</span></h2>
              <p>
                It all began with a simple interest that slowly grew into a passion.

                Our CEO first discovered the joy of adult coloring books—an activity that offered calm,
                creativity, and vibrant self-expression. Along with this new hobby came a love for acrylic and alcohol markers, 
                tools that brought every page to life with bold and beautiful colors.
              </p>
              <p>
                As the CEO Spent more time exploring these creative materials, <strong>Why not use these colorful pens to makes
                something useful and personal?</strong> This led to the very first handmade, personalized notepads, each one
                designed with playful patterns, bright hues, and a touch of creativity.
              </p>
              <p>
                What started as as small experiment quickly became something more. The CEO realized that many people
                also love colorful, fun, and engaging activities. Personalized stationery wasn't just cute, it was meaningful,
                functional, and made everyday tasks a little more joyful.
              </p>
              <p>
                From that moment, the vision became clear:
                <strong>Create a brand that celebrates creativity, color, and the happiness found in simple, handcrafted designs.</strong>
                
                And that is how our business was born -- rooted in passion, powered by imagination, and inspired by
                everyone who enjoys bringing a splash of color into their everyday lives. 💝
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values">
        <div className="container">
          <div className="section-header">
            <h2>What We Believe In <span className="emoji-inline">🌟</span></h2>
            <p>These aren't just words – they're promises we keep every day!</p>
          </div>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-card__icon">
                  <value.icon size={28} />
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team">
        <div className="container">
          <div className="section-header">
            <h2>Meet the Dream Team <span className="emoji-inline"></span></h2>
            <p>The lovely humans behind your favorite notebooks!</p>
          </div>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-card__avatar">
                  <span>{member.emoji}</span>
                </div>
                <h3>{member.name}</h3>
                <span className="team-card__role">{member.role}</span>
                <p className="team-card__quote">"{member.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="about-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Happy Customers</span>
              <span className="stat-emoji">😊</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100+</span>
              <span className="stat-label">Unique Designs</span>
              <span className="stat-emoji">🎨</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">4.9</span>
              <span className="stat-label">Average Rating</span>
              <span className="stat-emoji">⭐</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">∞</span>
              <span className="stat-label">Ideas Inspired</span>
              <span className="stat-emoji">💡</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <div className="about-cta__content">
            <h2>Ready to Start Your Journey? ✨</h2>
            <p>Find the perfect notebook that matches your vibe!</p>
            <div className="about-cta__buttons">
              <Link to="/shop" className="btn btn--primary">
                Shop Now 🛒
              </Link>
              <Link to="/contact" className="btn btn--secondary">
                Say Hello 👋
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;