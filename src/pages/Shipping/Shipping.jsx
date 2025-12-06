import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Clock, MapPin, Package, CheckCircle, AlertCircle } from 'lucide-react';
import './Shipping.css';

const Shipping = () => {
  const shippingRates = [
    {
      region: 'Metro Manila',
      rate: '₱99',
      freeAbove: '₱1,500',
      delivery: '2-3 business days',
      emoji: '🏙️'
    },
    {
      region: 'Luzon (Provincial)',
      rate: '₱149',
      freeAbove: '₱2,000',
      delivery: '3-5 business days',
      emoji: '🏔️'
    },
    {
      region: 'Visayas',
      rate: '₱199',
      freeAbove: '₱2,500',
      delivery: '5-7 business days',
      emoji: '🏝️'
    },
    {
      region: 'Mindanao',
      rate: '₱249',
      freeAbove: '₱3,000',
      delivery: '7-10 business days',
      emoji: '🌴'
    }
  ];

  const couriers = [
    { name: 'J&T Express', logo: '🚚' },
    { name: 'LBC', logo: '📦' },
    { name: 'JRS Express', logo: '🚚' },
    { name: 'Flash Express', logo: '⚡' }
  ];

  return (
    <div className="shipping-page">
      {/* Hero */}
      <section className="shipping-hero">
        <div className="container">
          <span className="shipping-hero__emoji">🚚</span>
          <h1>Shipping Information</h1>
          <p>Fast, reliable delivery straight to your doorstep! Here's everything you need to know about shipping.</p>
        </div>
      </section>

      {/* Shipping Rates */}
      <section className="shipping-rates">
        <div className="container">
          <div className="section-header">
            <h2>Shipping Rates & Delivery Times <span>📦</span></h2>
            <p>We ship nationwide! Delivery times may vary depending on your location.</p>
          </div>

          <div className="rates-grid">
            {shippingRates.map((rate, index) => (
              <div key={index} className="rate-card">
                <span className="rate-card__emoji">{rate.emoji}</span>
                <h3>{rate.region}</h3>
                <div className="rate-card__price">{rate.rate}</div>
                <div className="rate-card__free">
                  FREE shipping over {rate.freeAbove}! 🎉
                </div>
                <div className="rate-card__delivery">
                  <Clock size={16} />
                  {rate.delivery}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="shipping-process">
        <div className="container">
          <div className="section-header">
            <h2>How Shipping Works <span>✨</span></h2>
            <p>From our hands to yours in just a few simple steps!</p>
          </div>

          <div className="process-steps">
            <div className="process-step">
              <div className="process-step__number">1</div>
              <div className="process-step__icon">🛒</div>
              <h3>Place Your Order</h3>
              <p>Shop your faves and checkout. You'll receive an order confirmation email right away!</p>
            </div>
            <div className="process-connector">→</div>
            <div className="process-step">
              <div className="process-step__number">2</div>
              <div className="process-step__icon">📋</div>
              <h3>We Pack It</h3>
              <p>Our team carefully packs your order with love (and lots of bubble wrap!).</p>
            </div>
            <div className="process-connector">→</div>
            <div className="process-step">
              <div className="process-step__number">3</div>
              <div className="process-step__icon">🚚</div>
              <h3>Out for Delivery</h3>
              <p>Your package is handed to our courier partner. Track it in real-time!</p>
            </div>
            <div className="process-connector">→</div>
            <div className="process-step">
              <div className="process-step__number">4</div>
              <div className="process-step__icon">🎉</div>
              <h3>Enjoy!</h3>
              <p>Unbox happiness! Don't forget to share your haul with us on socials! 📸</p>
            </div>
          </div>
        </div>
      </section>

      {/* Courier Partners */}
      <section className="shipping-couriers">
        <div className="container">
          <div className="section-header">
            <h2>Our Delivery Partners <span>🤝</span></h2>
            <p>We work with trusted couriers to ensure safe and timely delivery.</p>
          </div>

          <div className="couriers-grid">
            {couriers.map((courier, index) => (
              <div key={index} className="courier-card">
                <span className="courier-logo">{courier.logo}</span>
                <span className="courier-name">{courier.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="shipping-notes">
        <div className="container">
          <div className="notes-grid">
            <div className="note-card note-card--info">
              <div className="note-card__icon">
                <CheckCircle size={24} />
              </div>
              <h3>Good to Know</h3>
              <ul>
                <li>Orders placed before 2PM are processed the same day!</li>
                <li>We ship Monday-Friday (except holidays)</li>
                <li>Tracking number sent via email within 24 hours</li>
                <li>Free tracking updates via SMS</li>
              </ul>
            </div>

            <div className="note-card note-card--warning">
              <div className="note-card__icon">
                <AlertCircle size={24} />
              </div>
              <h3>Please Note</h3>
              <ul>
                <li>Delivery times are estimates and may vary</li>
                <li>Remote areas may take longer</li>
                <li>Double-check your shipping address!</li>
                <li>Someone should be available to receive the package</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="shipping-cta">
        <div className="container">
          <div className="shipping-cta__content">
            <h2>Ready to Shop? 🛍️</h2>
            <p>Discover our beautiful notebooks and stationery!</p>
            <div className="shipping-cta__buttons">
              <Link to="/shop" className="btn btn--primary">
                Shop Now
              </Link>
              <Link to="/contact" className="btn btn--secondary">
                Questions? Ask Us!
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shipping;