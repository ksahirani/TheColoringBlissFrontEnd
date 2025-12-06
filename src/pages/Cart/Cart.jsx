import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { getCart, updateCartItem, removeFromCart, applyCoupon } from '../../store/slices/cartSlice';
import { formatPrice, getImageUrl } from '../../utils/helpers';
import './Cart.css';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { items, subtotal, total, discount, couponCode, loading } = useSelector(state => state.cart);
  const { isAuthenticated } = useSelector(state => state.auth);
  
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateCartItem({ itemId, quantity: newQuantity }));
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId)).then((result) => {
      if (!result.error) {
        toast.success('Item removed from cart');
      }
    });
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    
    setCouponLoading(true);
    dispatch(applyCoupon(couponInput)).then((result) => {
      setCouponLoading(false);
      if (!result.error) {
        toast.success('Coupon applied successfully!');
        setCouponInput('');
      } else {
        toast.error(result.payload || 'Invalid coupon code');
      }
    });
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (!isAuthenticated) {
    return (
      <main className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <ShoppingBag size={64} strokeWidth={1} />
            <h2>Please sign in</h2>
            <p>Sign in to view your cart and checkout</p>
            <Link to="/login" className="btn btn-primary">
              Sign In
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <ShoppingBag size={64} strokeWidth={1} />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet</p>
            <Link to="/shop" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const shippingCost = subtotal >= 50 ? 0 : 5.99;
  const estimatedTax = Math.round(subtotal * 0.08 * 100) / 100;
  const orderTotal = subtotal + shippingCost + estimatedTax - discount;

  return (
    <main className="cart-page">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="cart-title">Shopping Cart</h1>
          <p className="cart-subtitle">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>

          <div className="cart-layout">
            {/* Cart Items */}
            <div className="cart-items">
              <div className="cart-items__header">
                <span>Product</span>
                <span>Quantity</span>
                <span>Total</span>
              </div>

              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item._id}
                    className="cart-item"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="cart-item__product">
                      <Link to={`/product/${item.product?.slug}`} className="cart-item__image">
                        <img 
                          src={getImageUrl(item.product?.images?.[0]?.url)} 
                          alt={item.product?.name}
                        />
                      </Link>
                      <div className="cart-item__details">
                        <Link to={`/product/${item.product?.slug}`} className="cart-item__name">
                          {item.product?.name}
                        </Link>
                        <div className="cart-item__meta">
                          <span>{item.product?.size?.displayName}</span>
                          {item.selectedColor && (
                            <>
                              <span>•</span>
                              <span 
                                className="cart-item__color"
                                style={{ backgroundColor: item.selectedColor.hex }}
                              />
                              <span>{item.selectedColor.name}</span>
                            </>
                          )}
                        </div>
                        <span className="cart-item__price">{formatPrice(item.price)}</span>
                      </div>
                    </div>

                    <div className="cart-item__quantity">
                      <div className="quantity-selector">
                        <button 
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          disabled={item.quantity >= item.product?.stock}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button 
                        className="cart-item__remove"
                        onClick={() => handleRemoveItem(item._id)}
                      >
                        <Trash2 size={18} />
                        Remove
                      </button>
                    </div>

                    <div className="cart-item__total">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="cart-summary">
              <div className="cart-summary__card">
                <h3>Order Summary</h3>

                {/* Coupon */}
                <form className="coupon-form" onSubmit={handleApplyCoupon}>
                  <div className="coupon-input-wrapper">
                    <Tag size={18} />
                    <input
                      type="text"
                      placeholder="Coupon code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-secondary btn-sm"
                    disabled={couponLoading || !couponInput.trim()}
                  >
                    {couponLoading ? 'Applying...' : 'Apply'}
                  </button>
                </form>

                {couponCode && (
                  <div className="applied-coupon">
                    <Tag size={16} />
                    <span>{couponCode}</span>
                    <span className="discount-amount">-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="cart-summary__divider" />

                <div className="cart-summary__line">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="cart-summary__line cart-summary__line--discount">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="cart-summary__line">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
                </div>

                {subtotal < 50 && (
                  <div className="free-shipping-notice">
                    Add {formatPrice(50 - subtotal)} more for free shipping!
                  </div>
                )}

                <div className="cart-summary__line">
                  <span>Estimated Tax</span>
                  <span>{formatPrice(estimatedTax)}</span>
                </div>

                <div className="cart-summary__divider" />

                <div className="cart-summary__total">
                  <span>Total</span>
                  <span>{formatPrice(orderTotal)}</span>
                </div>

                <button 
                  className="btn btn-primary btn-lg checkout-btn"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  Proceed to Checkout <ArrowRight size={20} />
                </button>

                <Link to="/shop" className="continue-shopping">
                  Continue Shopping
                </Link>

                {/* Trust Badges */}
                <div className="cart-summary__badges">
                  <div className="trust-badge-mini">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    <span>Secure Checkout</span>
                  </div>
                  <div className="trust-badge-mini">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span>Fast Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default Cart;