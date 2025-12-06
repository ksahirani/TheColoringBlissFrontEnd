import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Package, Truck, MapPin, CreditCard, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../utils/api';
import { formatPrice, formatDate, getImageUrl } from '../../../utils/helpers';
import './Orders.css';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({
    status: '',
    note: '',
    trackingNumber: '',
    shippingCarrier: ''
  });

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data.data.order);
      setStatusUpdate(prev => ({
        ...prev,
        status: response.data.data.order.status,
        trackingNumber: response.data.data.order.trackingNumber || '',
        shippingCarrier: response.data.data.order.shippingCarrier || ''
      }));
    } catch (error) {
      console.error('Failed to fetch order:', error);
      toast.error('Failed to load order');
      navigate('/admin/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await api.put(`/orders/${id}/status`, statusUpdate);
      toast.success('Order updated successfully');
      fetchOrder();
    } catch (error) {
      console.error('Failed to update order:', error);
      toast.error('Failed to update order');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="order-detail-page">
      <div className="admin-page-header">
        <div>
          <button className="back-btn" onClick={() => navigate('/admin/orders')}>
            <ArrowLeft size={20} />
            Back to Orders
          </button>
          <h1>Order {order.orderNumber}</h1>
          <p>Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className="order-header-badges">
          <span className={`status-badge status-badge--${order.status}`}>
            {order.status}
          </span>
          <span className={`payment-badge ${order.isPaid ? 'paid' : 'unpaid'}`}>
            {order.isPaid ? 'Paid' : 'Unpaid'}
          </span>
        </div>
      </div>

      <div className="order-detail-layout">
        {/* Main Content */}
        <div className="order-detail-main">
          {/* Order Items */}
          <div className="admin-card">
            <div className="admin-card__header">
              <h2>
                <Package size={20} />
                Order Items
              </h2>
            </div>
            <div className="admin-card__body" style={{ padding: 0 }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="order-item-cell">
                          <div className="order-item-image">
                            {item.image ? (
                              <img src={getImageUrl(item.image)} alt={item.name} />
                            ) : (
                              <Package size={24} />
                            )}
                          </div>
                          <div className="order-item-info">
                            <span className="order-item-name">{item.name}</span>
                            {item.selectedColor && (
                              <span className="order-item-color">
                                Color: {item.selectedColor.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td><code>{item.sku}</code></td>
                      <td>{formatPrice(item.price)}</td>
                      <td>{item.quantity}</td>
                      <td>{formatPrice(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Order Totals */}
              <div className="order-totals">
                <div className="order-totals__row">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="order-totals__row">
                  <span>Shipping</span>
                  <span>{order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)}</span>
                </div>
                <div className="order-totals__row">
                  <span>Tax</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="order-totals__row order-totals__row--discount">
                    <span>Discount {order.couponCode && `(${order.couponCode})`}</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="order-totals__row order-totals__row--total">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status History */}
          <div className="admin-card">
            <div className="admin-card__header">
              <h2>Status History</h2>
            </div>
            <div className="admin-card__body">
              <div className="status-timeline">
                {order.statusHistory?.map((history, index) => (
                  <div key={index} className="status-timeline__item">
                    <div className="status-timeline__marker" />
                    <div className="status-timeline__content">
                      <span className={`status-badge status-badge--${history.status}`}>
                        {history.status}
                      </span>
                      <span className="status-timeline__date">
                        {formatDate(history.timestamp)}
                      </span>
                      {history.note && (
                        <p className="status-timeline__note">{history.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="order-detail-sidebar">
          {/* Update Status */}
          <div className="admin-card">
            <div className="admin-card__header">
              <h2>Update Status</h2>
            </div>
            <div className="admin-card__body">
              <form onSubmit={handleStatusUpdate} className="admin-form">
                <div className="admin-form__group">
                  <label className="admin-form__label">Status</label>
                  <select
                    value={statusUpdate.status}
                    onChange={(e) => setStatusUpdate(prev => ({ ...prev, status: e.target.value }))}
                    className="admin-form__select"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="admin-form__group">
                  <label className="admin-form__label">Tracking Number</label>
                  <input
                    type="text"
                    value={statusUpdate.trackingNumber}
                    onChange={(e) => setStatusUpdate(prev => ({ ...prev, trackingNumber: e.target.value }))}
                    className="admin-form__input"
                    placeholder="Enter tracking number"
                  />
                </div>

                <div className="admin-form__group">
                  <label className="admin-form__label">Shipping Carrier</label>
                  <select
                    value={statusUpdate.shippingCarrier}
                    onChange={(e) => setStatusUpdate(prev => ({ ...prev, shippingCarrier: e.target.value }))}
                    className="admin-form__select"
                  >
                    <option value="">Select carrier</option>
                    <option value="USPS">J&T Express</option>
                    <option value="UPS">Flash Express</option>
                    <option value="FedEx">LBC</option>
                    <option value="DHL">JRS Express</option>
                  </select>
                </div>

                <div className="admin-form__group">
                  <label className="admin-form__label">Note</label>
                  <textarea
                    value={statusUpdate.note}
                    onChange={(e) => setStatusUpdate(prev => ({ ...prev, note: e.target.value }))}
                    className="admin-form__textarea"
                    placeholder="Add a note about this status change"
                    rows={3}
                  />
                </div>

                <button 
                  type="submit" 
                  className="admin-btn admin-btn--primary"
                  style={{ width: '100%' }}
                  disabled={updating}
                >
                  <Save size={18} />
                  {updating ? 'Updating...' : 'Update Order'}
                </button>
              </form>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="admin-card">
            <div className="admin-card__header">
              <h2>
                <MapPin size={18} />
                Shipping Address
              </h2>
            </div>
            <div className="admin-card__body">
              <div className="address-block">
                <p className="address-name">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && (
                  <p className="address-phone">{order.shippingAddress.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="admin-card">
            <div className="admin-card__header">
              <h2>
                <CreditCard size={18} />
                Payment
              </h2>
            </div>
            <div className="admin-card__body">
              <div className="payment-info">
                <div className="payment-info__row">
                  <span>Method</span>
                  <span className="capitalize">{order.paymentMethod}</span>
                </div>
                <div className="payment-info__row">
                  <span>Status</span>
                  <span className={`payment-badge ${order.isPaid ? 'paid' : 'unpaid'}`}>
                    {order.isPaid ? 'Paid' : 'Unpaid'}
                  </span>
                </div>
                {order.isPaid && order.paidAt && (
                  <div className="payment-info__row">
                    <span>Paid on</span>
                    <span>{formatDate(order.paidAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="admin-card">
            <div className="admin-card__header">
              <h2>Customer</h2>
            </div>
            <div className="admin-card__body">
              <div className="customer-detail">
                <p className="customer-detail__name">
                  {order.user?.firstName} {order.user?.lastName}
                </p>
                <p className="customer-detail__email">{order.user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;