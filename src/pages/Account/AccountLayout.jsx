import React from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { User, Package, MapPin, Heart, Settings, LogOut } from 'lucide-react';
import './Account.css';

const AccountLayout = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=/account" replace />;
  }

  const navItems = [
    { path: '/account', icon: User, label: 'My Profile', exact: true },
    { path: '/account/orders', icon: Package, label: 'My Orders' },
    { path: '/account/addresses', icon: MapPin, label: 'Addresses' },
    { path: '/account/wishlist', icon: Heart, label: 'Wishlist' },
  ];

  return (
    <div className="account-page">
      {/* Header */}
      <div className="account-header">
        <div className="container">
          <div className="account-header__content">
            <div className="account-avatar">
              <span>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</span>
            </div>
            <div className="account-header__info">
              <h1>Hey, {user?.firstName}! 👋</h1>
              <p>Welcome back to your account</p>
            </div>
          </div>
        </div>
      </div>

      <div className="account-content">
        <div className="container">
          <div className="account-grid">
            {/* Sidebar */}
            <aside className="account-sidebar">
              <nav className="account-nav">
                {navItems.map(item => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.exact}
                    className={({ isActive }) => `account-nav__link ${isActive ? 'active' : ''}`}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="account-sidebar__footer">
                <NavLink to="/" className="account-nav__link account-nav__link--secondary">
                  <LogOut size={20} />
                  <span>Back to Shop</span>
                </NavLink>
              </div>
            </aside>

            {/* Main Content */}
            <main className="account-main">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;