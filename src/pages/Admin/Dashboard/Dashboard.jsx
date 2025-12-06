import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Package, Users, TrendingUp, TrendingDown, ArrowRight, Eye } from 'lucide-react';
import api from '../../../utils/api';
import { formatPrice } from '../../../utils/helpers';
import './Dashboard.css';

// Custom Peso Icon component
const PesoSign = ({ size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M6 19V5h6a4 4 0 0 1 0 8H6" />
    <line x1="4" y1="9" x2="16" y2="9" />
    <line x1="4" y1="12" x2="16" y2="12" />
  </svg>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/orders/admin/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateGrowth = (current, previous) => {
    if (!previous) return 100;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner" />
      </div>
    );
  }

  const revenueGrowth = stats ? calculateGrowth(stats.thisMonthRevenue, stats.lastMonthRevenue) : 0;

  return (
    <div className="dashboard">
      <div className="admin-page-header">
        <div>
          <h1>TheColoringBliss Dashboard 📊</h1>
          <p>Welcome back! Here's what's happening with your store today.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="dashboard__stats">
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--blue">
            <PesoSign size={24} />
          </div>
          <div className="stat-card__content">
            <span className="stat-card__label">This Month Revenue</span>
            <span className="stat-card__value">{formatPrice(stats?.thisMonthRevenue || 0)}</span>
            <div className={`stat-card__change ${parseFloat(revenueGrowth) >= 0 ? 'positive' : 'negative'}`}>
              {parseFloat(revenueGrowth) >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{Math.abs(revenueGrowth)}% from last month</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--green">
            <ShoppingCart size={24} />
          </div>
          <div className="stat-card__content">
            <span className="stat-card__label">Total Orders</span>
            <span className="stat-card__value">{stats?.totalOrders || 0}</span>
            <div className="stat-card__change positive">
              <span>{stats?.todayOrders || 0} orders today</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--orange">
            <Package size={24} />
          </div>
          <div className="stat-card__content">
            <span className="stat-card__label">Pending Orders</span>
            <span className="stat-card__value">{stats?.statusCounts?.pending || 0}</span>
            <div className="stat-card__change">
              <span>{stats?.statusCounts?.processing || 0} processing</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--purple">
            <Users size={24} />
          </div>
          <div className="stat-card__content">
            <span className="stat-card__label">Delivered</span>
            <span className="stat-card__value">{stats?.statusCounts?.delivered || 0}</span>
            <div className="stat-card__change">
              <span>{stats?.statusCounts?.shipped || 0} in transit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Status Overview */}
      <div className="dashboard__row">
        <div className="admin-card dashboard__orders-status">
          <div className="admin-card__header">
            <h2>Order Status Overview</h2>
          </div>
          <div className="admin-card__body">
            <div className="status-overview">
              {[
                { key: 'pending', label: 'Pending', color: '#f59e0b' },
                { key: 'confirmed', label: 'Confirmed', color: '#3b82f6' },
                { key: 'processing', label: 'Processing', color: '#8b5cf6' },
                { key: 'shipped', label: 'Shipped', color: '#10b981' },
                { key: 'delivered', label: 'Delivered', color: '#059669' },
                { key: 'cancelled', label: 'Cancelled', color: '#ef4444' },
              ].map(status => (
                <div key={status.key} className="status-overview__item">
                  <div className="status-overview__bar">
                    <div 
                      className="status-overview__fill" 
                      style={{ 
                        width: `${((stats?.statusCounts?.[status.key] || 0) / (stats?.totalOrders || 1)) * 100}%`,
                        backgroundColor: status.color
                      }}
                    />
                  </div>
                  <div className="status-overview__info">
                    <span className="status-overview__label">{status.label}</span>
                    <span className="status-overview__count">{stats?.statusCounts?.[status.key] || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="admin-card dashboard__recent-orders">
          <div className="admin-card__header">
            <h2>Recent Orders</h2>
            <Link to="/admin/orders" className="admin-btn admin-btn--secondary">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="admin-card__body" style={{ padding: 0 }}>
            {stats?.recentOrders?.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map(order => (
                    <tr key={order._id}>
                      <td>
                        <span className="order-number">{order.orderNumber}</span>
                      </td>
                      <td>{order.user?.firstName} {order.user?.lastName}</td>
                      <td>
                        <span className={`status-badge status-badge--${order.status}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{formatPrice(order.total)}</td>
                      <td>
                        <Link to={`/admin/orders/${order._id}`} className="admin-btn admin-btn--icon">
                          <Eye size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="admin-empty">
                <ShoppingCart size={48} />
                <h3>No orders yet</h3>
                <p>Orders will appear here once customers start purchasing.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-card">
        <div className="admin-card__header">
          <h2>Quick Actions</h2>
        </div>
        <div className="admin-card__body">
          <div className="quick-actions">
            <Link to="/admin/products/new" className="quick-action">
              <div className="quick-action__icon">
                <Package size={24} />
              </div>
              <div className="quick-action__content">
                <h3>Add New Product</h3>
                <p>Create a new product listing</p>
              </div>
              <ArrowRight size={20} />
            </Link>
            <Link to="/admin/categories/new" className="quick-action">
              <div className="quick-action__icon">
                <Package size={24} />
              </div>
              <div className="quick-action__content">
                <h3>Add Category</h3>
                <p>Create a new category</p>
              </div>
              <ArrowRight size={20} />
            </Link>
            <Link to="/admin/orders?status=pending" className="quick-action">
              <div className="quick-action__icon">
                <ShoppingCart size={24} />
              </div>
              <div className="quick-action__content">
                <h3>View Pending Orders</h3>
                <p>{stats?.statusCounts?.pending || 0} orders waiting</p>
              </div>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;