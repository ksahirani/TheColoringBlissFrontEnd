import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { MapPin, CreditCard, Truck, ShieldCheck, ChevronLeft, Check, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { clearCart } from '../../store/slices/cartSlice';
import { formatPrice, getImageUrl } from '../../utils/helpers';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  const { user, isAuthenticated } = useSelector(state => state.auth);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Philippines',
    phone: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [saveAddress, setSaveAddress] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
      return;
    }
    
    if (!cart?.items?.length) {
      navigate('/cart');
      return;
    }

    // Pre-fill with user data
    if (user) {
      setShippingAddress(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || ''
      }));
      
      // Get saved addresses
      if (user.addresses?.length) {
        setSavedAddresses(user.addresses);
        const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr._id);
          setShippingAddress({
            firstName: defaultAddr.firstName || user.firstName,
            lastName: defaultAddr.lastName || user.lastName,
            street: defaultAddr.street,
            city: defaultAddr.city,
            state: defaultAddr.state,
            zipCode: defaultAddr.zipCode,
            country: defaultAddr.country || 'Philippines',
            phone: defaultAddr.phone || user.phone || ''
          });
        }
      }
    }
  }, [isAuthenticated, cart, user, navigate]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
    setSelectedAddressId(null); // Clear selected saved address when editing
  };

  const selectSavedAddress = (address) => {
    setSelectedAddressId(address._id);
    setShippingAddress({
      firstName: address.firstName || user.firstName,
      lastName: address.lastName || user.lastName,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country || 'Philippines',
      phone: address.phone || user.phone || ''
    });
  };

  const validateShipping = () => {
    const required = ['firstName', 'lastName', 'street', 'city', 'state', 'zipCode', 'phone'];
    for (const field of required) {
      if (!shippingAddress[field]?.trim()) {
        toast.error(`Please enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    return true;
  };

  const handleContinueToPayment = () => {
    if (validateShipping()) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    
    try {
      // Save address if requested
      if (saveAddress && !selectedAddressId) {
        try {
          await api.post('/auth/address', {
            ...shippingAddress,
            label: 'Home',
            isDefault: savedAddresses.length === 0
          });
        } catch (err) {
          console.log('Address save failed, continuing with order');
        }
      }

      // Handle different payment methods
      if (paymentMethod === 'cod') {
        // Cash on Delivery - create order directly
        const response = await api.post('/payments/cod', { shippingAddress });
        const order = response.data.data.order;

        // Clear cart in Redux
        dispatch(clearCart());

        toast.success('Order placed successfully! 🎉');
        navigate(`/account/orders/${order._id}`, { state: { newOrder: true } });

      } else {
        // Online payment (GCash, Maya, Card) - redirect to PayMongo
        const response = await api.post('/payments/create-checkout', {
          shippingAddress,
          paymentMethod
        });

        if (response.data.data.checkoutUrl) {
          // Redirect to PayMongo checkout
          window.location.href = response.data.data.checkoutUrl;
        } else {
          throw new Error('Failed to create checkout session');
        }
      }

    } catch (error) {
      console.error('Order failed:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const subtotal = cart?.subtotal || 0;
  const shipping = subtotal >= 1500 ? 0 : 99;
  const tax = subtotal * 0.12;
  const discount = cart?.discount || 0;
  const total = subtotal + shipping + tax - discount;

  if (!cart?.items?.length) {
    return null;
  }

  return (
    <div className="checkout-page">
      {/* Header */}
      <div className="checkout-header">
        <div className="container">
          <Link to="/cart" className="checkout-back">
            <ChevronLeft size={20} />
            Back to Cart
          </Link>
          <h1>Checkout ✨</h1>
          
          {/* Progress Steps */}
          <div className="checkout-steps">
            <div className={`checkout-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <div className="checkout-step__number">
                {step > 1 ? <Check size={16} /> : '1'}
              </div>
              <span>Shipping</span>
            </div>
            <div className="checkout-step__line" />
            <div className={`checkout-step ${step >= 2 ? 'active' : ''}`}>
              <div className="checkout-step__number">2</div>
              <span>Payment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="checkout-content">
        <div className="container">
          <div className="checkout-grid">
            {/* Main Content */}
            <div className="checkout-main">
              {step === 1 && (
                <div className="checkout-section">
                  <div className="checkout-section__header">
                    <MapPin size={24} />
                    <div>
                      <h2>Shipping Address</h2>
                      <p>Where should we send your goodies? 📦</p>
                    </div>
                  </div>

                  {/* Saved Addresses */}
                  {savedAddresses.length > 0 && (
                    <div className="saved-addresses">
                      <h3>Saved Addresses</h3>
                      <div className="saved-addresses__grid">
                        {savedAddresses.map(addr => (
                          <div 
                            key={addr._id}
                            className={`saved-address-card ${selectedAddressId === addr._id ? 'selected' : ''}`}
                            onClick={() => selectSavedAddress(addr)}
                          >
                            <div className="saved-address-card__check">
                              <Check size={16} />
                            </div>
                            <p className="saved-address-card__label">{addr.label || 'Address'}</p>
                            <p>{addr.street}</p>
                            <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                          </div>
                        ))}
                        <div 
                          className={`saved-address-card saved-address-card--new ${!selectedAddressId ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedAddressId(null);
                            setShippingAddress({
                              firstName: user?.firstName || '',
                              lastName: user?.lastName || '',
                              street: '',
                              city: '',
                              state: '',
                              zipCode: '',
                              country: 'Philippines',
                              phone: user?.phone || ''
                            });
                          }}
                        >
                          <span className="plus-icon">+</span>
                          <p>New Address</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Address Form */}
                  <div className="address-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>First Name *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={shippingAddress.firstName}
                          onChange={handleAddressChange}
                          placeholder="Juan"
                        />
                      </div>
                      <div className="form-group">
                        <label>Last Name *</label>
                        <input
                          type="text"
                          name="lastName"
                          value={shippingAddress.lastName}
                          onChange={handleAddressChange}
                          placeholder="Dela Cruz"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Street Address *</label>
                      <input
                        type="text"
                        name="street"
                        value={shippingAddress.street}
                        onChange={handleAddressChange}
                        placeholder="123 Rizal Street, Barangay San Antonio"
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>City *</label>
                        <input
                          type="text"
                          name="city"
                          value={shippingAddress.city}
                          onChange={handleAddressChange}
                          placeholder="Makati City"
                        />
                      </div>
                      <div className="form-group">
                        <label>Province/State *</label>
                        <input
                          type="text"
                          name="state"
                          value={shippingAddress.state}
                          onChange={handleAddressChange}
                          placeholder="Metro Manila"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>ZIP Code *</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={shippingAddress.zipCode}
                          onChange={handleAddressChange}
                          placeholder="1200"
                        />
                      </div>
                      <div className="form-group">
                        <label>Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={shippingAddress.phone}
                          onChange={handleAddressChange}
                          placeholder="09171234567"
                        />
                      </div>
                    </div>

                    {!selectedAddressId && (
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={saveAddress}
                          onChange={(e) => setSaveAddress(e.target.checked)}
                        />
                        <span>Save this address for future orders</span>
                      </label>
                    )}
                  </div>

                  <button 
                    className="btn btn--primary btn--large btn--full"
                    onClick={handleContinueToPayment}
                  >
                    Continue to Payment →
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="checkout-section">
                  <div className="checkout-section__header">
                    <CreditCard size={24} />
                    <div>
                      <h2>Payment Method</h2>
                      <p>Choose how you'd like to pay 💳</p>
                    </div>
                  </div>

                  <div className="payment-methods">
                    <label className={`payment-method ${paymentMethod === 'card' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <div className="payment-method__content">
                        <div className="payment-method__icon">💳</div>
                        <div className="payment-method__info">
                          <h4>Credit / Debit Card</h4>
                          <p>Visa, Mastercard, AMEX</p>
                        </div>
                      </div>
                    </label>

                    <label className={`payment-method ${paymentMethod === 'gcash' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="gcash"
                        checked={paymentMethod === 'gcash'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <div className="payment-method__content">
                        <div className="payment-method__icon">📱</div>
                        <div className="payment-method__info">
                          <h4>GCash</h4>
                          <p>Pay with your GCash wallet</p>
                        </div>
                      </div>
                    </label>

                    <label className={`payment-method ${paymentMethod === 'maya' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="maya"
                        checked={paymentMethod === 'maya'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <div className="payment-method__content">
                        <div className="payment-method__icon">💜</div>
                        <div className="payment-method__info">
                          <h4>Maya</h4>
                          <p>Pay with Maya</p>
                        </div>
                      </div>
                    </label>

                    <label className={`payment-method ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <div className="payment-method__content">
                        <div className="payment-method__icon">💵</div>
                        <div className="payment-method__info">
                          <h4>Cash on Delivery</h4>
                          <p>Pay when you receive (Metro Manila only)</p>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Shipping Address Summary */}
                  <div className="shipping-summary">
                    <h3>Shipping To:</h3>
                    <div className="shipping-summary__address">
                      <p><strong>{shippingAddress.firstName} {shippingAddress.lastName}</strong></p>
                      <p>{shippingAddress.street}</p>
                      <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                      <p>{shippingAddress.phone}</p>
                    </div>
                    <button 
                      className="shipping-summary__edit"
                      onClick={() => setStep(1)}
                    >
                      Edit Address
                    </button>
                  </div>

                  <div className="checkout-actions">
                    <button 
                      className="btn btn--secondary"
                      onClick={() => setStep(1)}
                    >
                      ← Back
                    </button>
                    <button 
                      className="btn btn--primary btn--large"
                      onClick={handlePlaceOrder}
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : `Place Order • ${formatPrice(total)}`}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Order Summary */}
            <div className="checkout-sidebar">
              <div className="order-summary">
                <h3>Order Summary 🛒</h3>
                
                <div className="order-summary__items">
                  {cart.items.map(item => (
                    <div key={item._id} className="order-item">
                      <div className="order-item__image">
                        {item.product?.images?.[0]?.url ? (
                          <img src={getImageUrl(item.product.images[0].url)} alt={item.product.name} />
                        ) : (
                          <Package size={24} />
                        )}
                        <span className="order-item__qty">{item.quantity}</span>
                      </div>
                      <div className="order-item__details">
                        <p className="order-item__name">{item.product?.name}</p>
                        {item.selectedColor && (
                          <p className="order-item__variant">{item.selectedColor.name}</p>
                        )}
                      </div>
                      <div className="order-item__price">
                        {formatPrice(item.product?.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {cart.couponCode && (
                  <div className="order-summary__coupon">
                    <span>🎟️ {cart.couponCode}</span>
                    <span className="text-success">-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="order-summary__totals">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE 🎉' : formatPrice(shipping)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax (12%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="summary-row text-success">
                      <span>Discount</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="summary-row summary-row--total">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="trust-badges">
                  <div className="trust-badge">
                    <ShieldCheck size={18} />
                    <span>Secure Checkout</span>
                  </div>
                  <div className="trust-badge">
                    <Truck size={18} />
                    <span>Fast Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;