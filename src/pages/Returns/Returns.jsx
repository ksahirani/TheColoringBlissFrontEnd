import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, CheckCircle, XCircle, Clock, Package, Mail, ArrowRight } from 'lucide-react';
import './Returns.css';

const Returns = () => {
  const eligibleItems = [
    'Unused items in original packaging',
    'Items with tags still attached',
    'Items purchased within the last 7 days',
    'Defective or damaged items (report within 48 hours)',
    'Wrong items received'
  ];

  const nonEligibleItems = [
    'Used or written-in notebooks',
    'Items without original packaging',
    'Items purchased more than 7 days ago',
    'Sale/clearance items (unless defective)',
    'Gift cards and digital products'
  ];

  const returnSteps = [
    {
      step: 1,
      icon: Mail,
      title: 'Contact Us',
      description: 'Email us at mycoloringbliss@gmail.com with your order number and reason for return.'
    },
    {
      step: 2,
      icon: Package,
      title: 'Pack It Up',
      description: 'We\'ll send you a return form. Pack the item securely in its original packaging.'
    },
    {
      step: 3,
      icon: RotateCcw,
      title: 'Ship It Back',
      description: 'Drop off the package at your nearest courier. Keep the receipt!'
    },
    {
      step: 4,
      icon: CheckCircle,
      title: 'Get Your Refund',
      description: 'Once we receive and inspect the item, we\'ll process your refund within 5-7 business days.'
    }
  ];

  return (
    <div className="returns-page">
      {/* Hero */}
      <section className="returns-hero">
        <div className="container">
          <span className="returns-hero__emoji">🔄</span>
          <h1>Returns & Exchanges</h1>
          <p>Changed your mind? No worries! We want you to be 100% happy with your purchase. Here's our hassle-free return policy.</p>
        </div>
      </section>

      {/* Policy Overview */}
      <section className="returns-overview">
        <div className="container">
          <div className="overview-cards">
            <div className="overview-card">
              <div className="overview-card__icon">
                <Clock size={28} />
              </div>
              <h3>7-Day Returns</h3>
              <p>Return unused items within 7 days of delivery for a full refund.</p>
            </div>
            <div className="overview-card">
              <div className="overview-card__icon">
                <RotateCcw size={28} />
              </div>
              <h3>Easy Exchanges</h3>
              <p>Want a different color or size? We'll exchange it for free!</p>
            </div>
            <div className="overview-card">
              <div className="overview-card__icon">
                <Package size={28} />
              </div>
              <h3>Free Returns for Defects</h3>
              <p>Received a damaged item? We'll cover the return shipping.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="returns-eligibility">
        <div className="container">
          <div className="eligibility-grid">
            <div className="eligibility-card eligibility-card--yes">
              <div className="eligibility-header">
                <CheckCircle size={24} />
                <h3>Eligible for Return ✅</h3>
              </div>
              <ul>
                {eligibleItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="eligibility-card eligibility-card--no">
              <div className="eligibility-header">
                <XCircle size={24} />
                <h3>Not Eligible ❌</h3>
              </div>
              <ul>
                {nonEligibleItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How to Return */}
      <section className="returns-process">
        <div className="container">
          <div className="section-header">
            <h2>How to Return an Item <span>📦</span></h2>
            <p>It's super easy! Just follow these 4 simple steps.</p>
          </div>

          <div className="return-steps">
            {returnSteps.map((step, index) => (
              <div key={index} className="return-step">
                <div className="return-step__number">{step.step}</div>
                <div className="return-step__icon">
                  <step.icon size={24} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Refund Info */}
      <section className="returns-refund">
        <div className="container">
          <div className="refund-content">
            <div className="refund-info">
              <h2>Refund Information <span>💰</span></h2>
              <div className="refund-details">
                <div className="refund-item">
                  <h4>Processing Time</h4>
                  <p>5-7 business days after we receive your return</p>
                </div>
                <div className="refund-item">
                  <h4>Refund Method</h4>
                  <p>Same method as original payment (card, GCash, etc.)</p>
                </div>
                <div className="refund-item">
                  <h4>Shipping Costs</h4>
                  <p>Original shipping fees are non-refundable (unless we made an error)</p>
                </div>
                <div className="refund-item">
                  <h4>Store Credit Option</h4>
                  <p>Prefer store credit? Get 10% bonus on your credit value! 🎁</p>
                </div>
              </div>
            </div>
            
            <div className="refund-note">
              <span className="refund-note__emoji">💡</span>
              <h3>Pro Tip!</h3>
              <p>
                Take photos or videos when unboxing your order. If there's any issue 
                with your items, having documentation helps us process your return faster!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Exchange Info */}
      <section className="returns-exchange">
        <div className="container">
          <div className="exchange-content">
            <h2>Prefer an Exchange? <span>🔄</span></h2>
            <p>
              If you'd like to exchange your item for a different product, color, or size, 
              we're happy to help! Here's how it works:
            </p>
            <div className="exchange-steps">
              <div className="exchange-step">
                <span>1</span>
                <p>Contact us and let us know what you'd like instead</p>
              </div>
              <ArrowRight size={20} className="exchange-arrow" />
              <div className="exchange-step">
                <span>2</span>
                <p>We'll check availability and confirm the exchange</p>
              </div>
              <ArrowRight size={20} className="exchange-arrow" />
              <div className="exchange-step">
                <span>3</span>
                <p>Ship back your item, we'll ship the new one!</p>
              </div>
            </div>
            <p className="exchange-note">
              <strong>Price differences:</strong> If your new item costs more, we'll send a payment link. 
              If it costs less, we'll refund the difference!
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="returns-cta">
        <div className="container">
          <div className="returns-cta__content">
            <h2>Need to Start a Return? 📬</h2>
            <p>Our friendly team is ready to help you!</p>
            <div className="returns-cta__buttons">
              <Link to="/contact" className="btn btn--primary">
                <Mail size={18} />
                Contact Support
              </Link>
              <Link to="/faq" className="btn btn--secondary">
                View FAQs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Returns;