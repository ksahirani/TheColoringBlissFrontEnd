import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Package, ChevronRight, Clock, Truck, CheckCircle, XCircle, Eye } from 'lucide-react';
import api from '../../utils/api';
import { formatPrice, formatDate, getImageUrl } from '../../utils/helpers';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const response = await api.get(`/orders${params}`);
      setOrders(response.data.data.orders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'confirmed': return <CheckCircle size={16} />;
      case 'processing': return <Package size={16} />;
      case 'shipped': return <Truck size={16} />;
      case 'delivered': return <CheckCircle size={16} />;
      case 'cancelled': return <XCircle size={16} />;
      default: return <Package size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'processing': return 'primary';
      case 'shipped': return 'info';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const filters = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
  ];

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="loading-spinner" />
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h2>My Orders 📦</h2>
        <p>Track and manage your orders</p>
      </div>

      {/* Filters */}
      <div className="orders-filters">
        {filters.map(f => (
          <button
            key={f.value}
            className={`orders-filter ${filter === f.value ? 'active' : ''}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {orders.length > 0 ? (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-card__header">
                <div className="order-card__info">
                  <span className="order-number">{order.orderNumber}</span>
                  <span className="order-date">{formatDate(order.createdAt)}</span>
                </div>
                <span className={`order-status order-status--${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </span>
              </div>

              <div className="order-card__items">
                {order.items.slice(0, 3).map((item, index) => (
                  <div key={index} className="order-item-preview">
                    <div className="order-item-preview__image">
                      {item.image ? (
                        <img 
                          src={getImageUrl(item.image)} 
                          alt={item.name}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="order-item-preview__placeholder" style={{ display: item.image ? 'none' : 'flex' }}>
                        <Package size={20} />
                      </div>
                    </div>
                    <div className="order-item-preview__info">
                      <p className="order-item-preview__name">{item.name}</p>
                      <p className="order-item-preview__qty">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="order-more-items">
                    +{order.items.length - 3} more items
                  </div>
                )}
              </div>

              <div className="order-card__footer">
                <div className="order-total">
                  <span>Total:</span>
                  <strong>{formatPrice(order.total)}</strong>
                </div>
                <Link to={`/account/orders/${order._id}`} className="btn btn--small btn--outline">
                  <Eye size={16} />
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="orders-empty">
          <span className="orders-empty__emoji">📭</span>
          <h3>No orders yet!</h3>
          <p>Looks like you haven't made any purchases yet. Let's change that!</p>
          <Link to="/shop" className="btn btn--primary">
            Start Shopping 🛒
          </Link>
        </div>
      )}
    </div>
  );
};

export default Orders;