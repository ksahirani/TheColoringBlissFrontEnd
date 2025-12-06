import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  MapPin,
  CreditCard,
  Copy,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { formatPrice, formatDate, getImageUrl } from '../../utils/helpers';

const OrderDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const isNewOrder = location.state?.newOrder;

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data.data.order);
    } catch (error) {
      console.error('Failed to fetch order:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    toast.success('Order number copied! 📋');
  };

  const getStatusStep = (status) => {
    const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    return steps.indexOf(status);
  };

  if (loading) {
    return (
      <div className="order-detail-loading">
        <div className="loading-spinner" />
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-not-found">
        <h2>Order not found</h2>
        <Link to="/account/orders" className="btn btn--primary">
          View All Orders
        </Link>
      </div>
    );
  }

  const currentStep = getStatusStep(order.status);
  const steps = [
    { key: 'pending', label: 'Order Placed', icon: Clock },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { key: 'processing', label: 'Processing', icon: Package },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle }
  ];

  return (
    <div className="order-detail-page">
      <Link to="/account/orders" className="order-detail-back">
        <ChevronLeft size={20} />
        Back to Orders
      </Link>

      {isNewOrder && (
        <div className="order-success-banner">
          <span>🎉</span>
          <div>
            <h3>Order Placed Successfully!</h3>
            <p>Thank you for your purchase! We'll send you updates via email.</p>
          </div>
        </div>
      )}

      {/* Order Header */}
      <div className="order-detail-header">
        <div className="order-detail-header__info">
          <h2>Order {order.orderNumber}</h2>
          <p>Placed on {formatDate(order.createdAt)}</p>
        </div>
        <button className="copy-order-btn" onClick={copyOrderNumber}>
          <Copy size={16} />
          Copy Order #
        </button>
      </div>

      {/* Order Progress */}
      {order.status !== 'cancelled' && (
        <div className="order-progress">
          <div className="order-progress__steps">
            {steps.map((step, index) => (
              <React.Fragment key={step.key}>
                <div className={`progress-step ${index <= currentStep ? 'completed' : ''} ${index === currentStep ? 'current' : ''}`}>
                  <div className="progress-step__icon">
                    <step.icon size={18} />
                  </div>
                  <span className="progress-step__label">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`progress-line ${index < currentStep ? 'completed' : ''}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {order.status === 'cancelled' && (
        <div className="order-cancelled-banner">
          <span>❌</span>
          <p>This order has been cancelled.</p>
        </div>
      )}

      <div className="order-detail-grid">
        {/* Order Items */}
        <div className="order-detail-section">
          <h3>Order Items ({order.items.length})</h3>
          <div className="order-detail-items">
            {order.items.map((item, index) => (
              <div key={index} className="order-detail-item">
                <div className="order-detail-item__image">
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
                  <div className="order-detail-item__placeholder" style={{ display: item.image ? 'none' : 'flex' }}>
                    <Package size={24} />
                  </div>
                </div>
                <div className="order-detail-item__info">
                  <h4>{item.name}</h4>
                  {item.sku && <p className="item-sku">SKU: {item.sku}</p>}
                  {item.selectedColor && (
                    <p className="item-variant">Color: {item.selectedColor.name || item.selectedColor}</p>
                  )}
                  <p className="item-qty">Quantity: {item.quantity}</p>
                </div>
                <div className="order-detail-item__price">
                  <p className="item-unit-price">{formatPrice(item.price)} each</p>
                  <p className="item-total">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="order-detail-sidebar">
          {/* Order Summary */}
          <div className="order-summary-card">
            <h3>Order Summary</h3>
            <div className="order-summary-rows">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              {order.discount > 0 && (
                <div className="summary-row text-success">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="summary-row summary-row--total">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="order-info-card">
            <div className="order-info-card__header">
              <MapPin size={18} />
              <h4>Shipping Address</h4>
            </div>
            <div className="order-info-card__content">
              <p><strong>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</strong></p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="order-info-card">
            <div className="order-info-card__header">
              <CreditCard size={18} />
              <h4>Payment</h4>
            </div>
            <div className="order-info-card__content">
              <p><strong>{order.paymentMethod?.toUpperCase()}</strong></p>
              <p className={`payment-status ${order.paymentStatus}`}>
                {order.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}
              </p>
            </div>
          </div>

          {/* Tracking Info */}
          {order.trackingNumber && (
            <div className="order-info-card">
              <div className="order-info-card__header">
                <Truck size={18} />
                <h4>Tracking</h4>
              </div>
              <div className="order-info-card__content">
                <p><strong>{order.shippingCarrier}</strong></p>
                <p className="tracking-number">
                  {order.trackingNumber}
                  <button onClick={() => {
                    navigator.clipboard.writeText(order.trackingNumber);
                    toast.success('Tracking number copied!');
                  }}>
                    <Copy size={14} />
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Help Section */}
      <div className="order-help">
        <h3>Need Help? 🤔</h3>
        <p>If you have any questions about your order, we're here to help!</p>
        <div className="order-help__actions">
          <Link to="/contact" className="btn btn--secondary">
            Contact Support
          </Link>
          <Link to="/faq" className="btn btn--outline">
            View FAQs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;