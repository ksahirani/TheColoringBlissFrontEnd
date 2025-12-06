import React from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LayoutDashboard, Package, ShoppingCart, FolderTree, Users, Settings, LogOut, ChevronRight } from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);

  // Redirect if not authenticated or not admin
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/admin/categories', icon: FolderTree, label: 'Categories' },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <div className="admin-logo">
            <span className="admin-logo__text">TheColoringBliss</span>
          </div>
        </div>

        <nav className="admin-nav">
          <ul>
            {navItems.map(item => (
              <li key={item.path}>
                <NavLink 
                  to={item.path} 
                  end={item.exact}
                  className={({ isActive }) => `admin-nav__link ${isActive ? 'active' : ''}`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                  <ChevronRight size={16} className="admin-nav__arrow" />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-user">
            <div className="admin-user__avatar">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div className="admin-user__info">
              <span className="admin-user__name">{user?.firstName} {user?.lastName}</span>
              <span className="admin-user__role">Administrator</span>
            </div>
          </div>
          <NavLink to="/" className="admin-nav__link admin-nav__link--back">
            <LogOut size={20} />
            <span>Back to Store</span>
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;