import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Search, ShoppingCart, User, Heart, Menu, X, ChevronDown, LogOut, Package, MapPin, Settings } from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import Logo from '../../assets/Coloring_Bliss.png';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { cart } = useSelector(state => state.cart);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  const cartItemsCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      {/* Promo Banner */}
      <div className="header__promo">
        <span>🎉 Free shipping on orders over ₱1,500! Use code <strong>BlissFul</strong> for 10% off!</span>
      </div>

      <div className="header__main">
        <div className="container">
          <div className="header__content">
            {/* Mobile Menu Toggle */}
            <button 
              className="header__mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link to="/" className="header__logo">
              <img src={Logo} alt="The Coloring Bliss" className="logo-image" />
              <span className="logo-text">TheColoringBliss</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="header__nav">
              {navLinks.map(link => (
                <NavLink 
                  key={link.to}
                  to={link.to} 
                  className={({ isActive }) => `header__nav-link ${isActive ? 'active' : ''}`}
                  end={link.to === '/'}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Actions */}
            <div className="header__actions">
              {/* Search */}
              <div className="header__search" ref={searchRef}>
                <button 
                  className="header__action-btn"
                  onClick={() => setSearchOpen(!searchOpen)}
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>
                
                {searchOpen && (
                  <div className="search-dropdown">
                    <form onSubmit={handleSearch}>
                      <input
                        type="text"
                        placeholder="Search notebooks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                      />
                      <button type="submit">
                        <Search size={18} />
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link to="/account/wishlist" className="header__action-btn" aria-label="Wishlist">
                <Heart size={20} />
              </Link>

              {/* Cart */}
              <Link to="/cart" className="header__action-btn header__cart-btn" aria-label="Cart">
                <ShoppingCart size={20} />
                {cartItemsCount > 0 && (
                  <span className="header__cart-count">{cartItemsCount}</span>
                )}
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="header__user" ref={userMenuRef}>
                  <button 
                    className="header__user-btn"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <div className="header__user-avatar">
                      {user?.firstName?.charAt(0)}
                    </div>
                    <ChevronDown size={16} className={userMenuOpen ? 'rotated' : ''} />
                  </button>

                  {userMenuOpen && (
                    <div className="user-dropdown">
                      <div className="user-dropdown__header">
                        <p className="user-dropdown__name">
                          Hey, {user?.firstName}! 👋
                        </p>
                        <p className="user-dropdown__email">{user?.email}</p>
                      </div>
                      
                      <div className="user-dropdown__links">
                        <Link to="/account" onClick={() => setUserMenuOpen(false)}>
                          <User size={18} />
                          My Profile
                        </Link>
                        <Link to="/account/orders" onClick={() => setUserMenuOpen(false)}>
                          <Package size={18} />
                          My Orders
                        </Link>
                        <Link to="/account/addresses" onClick={() => setUserMenuOpen(false)}>
                          <MapPin size={18} />
                          Addresses
                        </Link>
                        <Link to="/account/wishlist" onClick={() => setUserMenuOpen(false)}>
                          <Heart size={18} />
                          Wishlist
                        </Link>
                        {user?.role === 'admin' && (
                          <Link to="/admin" onClick={() => setUserMenuOpen(false)}>
                            <Settings size={18} />
                            Admin Panel
                          </Link>
                        )}
                      </div>

                      <div className="user-dropdown__footer">
                        <button onClick={handleLogout}>
                          <LogOut size={18} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="header__login-btn">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`header__mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          {navLinks.map(link => (
            <NavLink 
              key={link.to}
              to={link.to}
              className={({ isActive }) => `mobile-nav__link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
              end={link.to === '/'}
            >
              {link.label}
            </NavLink>
          ))}
          
          <div className="mobile-nav__divider" />
          
          {isAuthenticated ? (
            <>
              <Link to="/account" className="mobile-nav__link" onClick={() => setMobileMenuOpen(false)}>
                My Account
              </Link>
              <Link to="/account/orders" className="mobile-nav__link" onClick={() => setMobileMenuOpen(false)}>
                My Orders
              </Link>
              <button className="mobile-nav__link mobile-nav__logout" onClick={handleLogout}>
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/login" className="mobile-nav__link mobile-nav__login" onClick={() => setMobileMenuOpen(false)}>
              Sign In / Register
            </Link>
          )}
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="header__overlay" onClick={() => setMobileMenuOpen(false)} />
      )}
    </header>
  );
};

export default Header;