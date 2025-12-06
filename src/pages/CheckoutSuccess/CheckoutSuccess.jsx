import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CheckCircle, Package, ArrowRight, Loader } from 'lucide-react';
import api from '../../utils/api';
import { clearCart } from '../../store/slices/cartSlice';
import './CheckoutSuccess.css';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }

    verifyPayment();
  }, [orderId]);

  const verifyPayment = async () => {
    try {
      const response = await api.post('/payments/verify', { orderId });
      
      if (response.data.success) {
        setOrder(response.data.data.order);
        
        // Clear cart after successful payment
        dispatch(clearCart());
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('Failed to verify payment. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-success">
        <div className="checkout-success__container">
          <div className="checkout-success__loading">
            <Loader size={48} className="spinning" />
            <h2>Verifying your payment...</h2>
            <p>Please wait while we confirm your order.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="checkout-success">
        <div className="checkout-success__container">
          <div className="checkout-success__error">
            <h2>Something went wrong</h2>
            <p>{error}</p>
            <Link to="/account/orders" className="btn btn--primary">
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-success">
      <div className="checkout-success__container">
        <div className="checkout-success__icon">
          <CheckCircle size={80} />
        </div>
        
        <h1>Thank You! 🎉</h1>
        <p className="checkout-success__message">
          Your order has been placed successfully!
        </p>

        {order && (
          <div className="checkout-success__details">
            <div className="checkout-success__order-number">
              <span>Order Number</span>
              <strong>{order.orderNumber}</strong>
            </div>

            <div className="checkout-success__info">
              <div className="info-item">
                <Package size={20} />
                <div>
                  <span>Estimated Delivery</span>
                  <strong>3-5 Business Days</strong>
                </div>
              </div>
            </div>

            <p className="checkout-success__email">
              We've sent a confirmation email to <strong>{order.shippingAddress?.email || 'your email'}</strong>
            </p>
          </div>
        )}

        <div className="checkout-success__actions">
          <Link to={`/account/orders/${orderId}`} className="btn btn--primary">
            View Order Details
            <ArrowRight size={18} />
          </Link>
          <Link to="/shop" className="btn btn--secondary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;