import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, MapPin, Phone, Send, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from '../../assets/Coloring_Bliss.png';
import './Footer.css';

// TikTok icon component (not available in lucide-react)
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

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      toast.success('Welcome to the BlissFam! 🎉');
      setEmail('');
    }
  };

  const quickLinks = [
    { to: '/shop', label: 'Shop All' },
    { to: '/shop?featured=true', label: 'Best Sellers' },
    { to: '/shop?newArrivals=true', label: 'New Arrivals' },
    { to: '/about', label: 'Our Story' },
  ];

  const helpLinks = [
    { to: '/faq', label: 'FAQ' },
    { to: '/shipping', label: 'Shipping Info' },
    { to: '/returns', label: 'Returns & Exchanges' },
    { to: '/contact', label: 'Contact Us' },
  ];

  const socialLinks = [
    { href: 'https://www.instagram.com/mycoloringbliss?igsh=ejRiZHdmajBsbGhy', icon: Instagram, label: 'Instagram' },
    { href: 'https://www.facebook.com/profile.php?id=61575997331099', icon: Facebook, label: 'Facebook' },
    { href: 'https://www.tiktok.com/@thecoloringbliss', icon: TikTokIcon, label: 'TikTok' },
  ];

  return (
    <footer className="footer">
      {/* Newsletter */}
      <div className="footer__newsletter">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h3>Join the BlissFam! 💌</h3>
              <p>Get exclusive deals, new arrivals, and stationery inspo straight to your inbox!</p>
            </div>
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">
                <Send size={18} />
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="footer__main">
        <div className="container">
          <div className="footer__grid">
            {/* Brand */}
            <div className="footer__brand">
              <Link to="/" className="footer__logo">
                <img src={Logo} alt="The Coloring Bliss" className="logo-image" />
                <span className="logo-text">TheColoringBliss</span>
              </Link>
              <p className="footer__tagline">
                Whether you're a student balancing study sessions or a young pro chasing big dreams.✨ 
              </p>
              <div className="footer__social">
                {socialLinks.map(social => (
                  <a 
                    key={social.label}
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="footer__social-link"
                    aria-label={social.label}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer__links">
              <h4>Shop</h4>
              <ul>
                {quickLinks.map(link => (
                  <li key={link.to}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help Links */}
            <div className="footer__links">
              <h4>Help</h4>
              <ul>
                {helpLinks.map(link => (
                  <li key={link.to}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="footer__contact">
              <h4>Get in Touch</h4>
              <ul>
                <li>
                  <Mail size={16} />
                  <a href="mailto:mycoloringbliss@gmail.com">mycoloringbliss@gmail.com</a>
                </li>
                <li>
                  <Phone size={16} />
                  <a href="tel:+6328123456">No phone support yet</a>
                </li>
                <li>
                  <MapPin size={16} />
                  <span>Biñan City, Laguna</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer__bottom">
        <div className="container">
          <div className="footer__bottom-content">
            <p>© {new Date().getFullYear()} TheColoringBliss. Made with <Heart size={14} className="heart-icon" /> in the Philippines</p>
            <div className="footer__bottom-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;