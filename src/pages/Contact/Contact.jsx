import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Instagram, Facebook } from 'lucide-react';
import toast from 'react-hot-toast';
import './Contact.css';

// TikTok icon component
const TikTokIcon = ({ size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    
    // Simulate sending
    setTimeout(() => {
      toast.success('Message sent! We\'ll get back to you soon 💌');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSending(false);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      content: 'mycoloringbliss@gmail.com',
      subtitle: 'We reply within 24 hours!',
      color: '#ec4899'
    },
    {
      icon: Phone,
      title: 'For Now, No Phone',
      content: 'We have no phone support yet.',
      subtitle: 'Reach us via email or social media.',
      color: '#8b5cf6'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      content: 'T & C Southville Arizona Street',
      subtitle: 'Biñan City, Laguna, Philippines',
      color: '#10b981'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      content: 'Mon - Fri: 9AM - 6PM',
      subtitle: 'We are closed on weekends',
      color: '#f59e0b'
    }
  ];

  const faqs = [
    {
      question: 'How long does shipping take?',
      answer: 'Metro Manila: 2-3 days, Provincial: 5-7 days'
    },
    {
      question: 'Do you accept returns?',
      answer: 'Yes! Within 7 days if unused and in original packaging.'
    },
    {
      question: 'Can I track my order?',
      answer: 'Absolutely! You\'ll receive a tracking number via email.'
    }
  ];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <div className="contact-hero__content">
            <span className="contact-hero__emoji">💬</span>
            <h1>Let's Chat!</h1>
            <p>
              Got questions? Ideas? Just want to say hi? 
              We'd love to hear from you! Our friendly team is always ready to help. ✨
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="contact-info">
        <div className="container">
          <div className="contact-info__grid">
            {contactInfo.map((info, index) => (
              <div key={index} className="contact-card">
                <div className="contact-card__icon" style={{ backgroundColor: `${info.color}20`, color: info.color }}>
                  <info.icon size={24} />
                </div>
                <h3>{info.title}</h3>
                <p className="contact-card__content">{info.content}</p>
                <p className="contact-card__subtitle">{info.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="contact-main">
        <div className="container">
          <div className="contact-main__grid">
            {/* Form */}
            <div className="contact-form-wrapper">
              <div className="contact-form-header">
                <h2>Send Us a Message <span>📝</span></h2>
                <p>Fill out the form below and we'll get back to you ASAP!</p>
              </div>
              
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="What should we call you?"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Subject *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">What's this about?</option>
                    <option value="order">📦 Order Inquiry</option>
                    <option value="product">🛍️ Product Question</option>
                    <option value="feedback">💝 Feedback & Suggestions</option>
                    <option value="wholesale">🏢 Wholesale/Bulk Orders</option>
                    <option value="other">✨ Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Your Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us what's on your mind..."
                    rows={5}
                    required
                  />
                </div>

                <button type="submit" className="contact-submit" disabled={sending}>
                  {sending ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Sidebar */}
            <div className="contact-sidebar">
              {/* Quick FAQs */}
              <div className="contact-faq">
                <h3>Quick Answers <span>💡</span></h3>
                {faqs.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <h4>{faq.question}</h4>
                    <p>{faq.answer}</p>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="contact-social">
                <h3>Follow Us! <span>🎉</span></h3>
                <p>Stay updated with new products, promos, and more!</p>
                <div className="social-links">
                  <a href="https://www.instagram.com/mycoloringbliss?igsh=ejRiZHdmajBsbGhy" target="_blank" rel="noopener noreferrer" className="social-link social-link--instagram">
                    <Instagram size={20} />
                  </a>
                  <a href="https://www.facebook.com/profile.php?id=61575997331099" target="_blank" rel="noopener noreferrer" className="social-link social-link--facebook">
                    <Facebook size={20} />
                  </a>
                  <a href="https://www.tiktok.com/@thecoloringbliss" target="_blank" rel="noopener noreferrer" className="social-link social-link--tiktok">
                    <TikTokIcon size={20} />
                  </a>
                </div>
              </div>

              {/* Fun Note */}
              <div className="contact-note">
                <span className="note-emoji">💌</span>
                <p>
                  <strong>Fun fact:</strong> We read every single message! 
                  Our team gets excited whenever we hear from you. 
                  Don't be shy we're super friendly! 
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;