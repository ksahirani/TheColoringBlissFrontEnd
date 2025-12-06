import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Heart, ShoppingCart, Trash2, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { addToCart } from '../../store/slices/cartSlice';
import { setUser } from '../../store/slices/authSlice';
import { formatPrice, getImageUrl } from '../../utils/helpers';
import './Wishlist.css';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      const response = await api.get('/auth/wishlist');
      setWishlist(response.data.data.wishlist || []);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const response = await api.delete(`/auth/wishlist/${productId}`);
      setWishlist(response.data.data.wishlist || []);
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await dispatch(addToCart({ productId: product._id, quantity: 1 })).unwrap();
      toast.success('Added to cart! 🛒');
    } catch (error) {
      toast.error(error || 'Failed to add to cart');
    }
  };

  const handleMoveAllToCart = async () => {
    for (const product of wishlist) {
      try {
        await dispatch(addToCart({ productId: product._id, quantity: 1 })).unwrap();
      } catch (error) {
        console.error(`Failed to add ${product.name} to cart`);
      }
    }
    toast.success('All items added to cart! 🎉');
  };

  if (!isAuthenticated) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-header">
          <h2>My Wishlist 💜</h2>
        </div>
        <div className="wishlist-empty">
          <span className="wishlist-empty__emoji">🔐</span>
          <h3>Please log in</h3>
          <p>Log in to view and manage your wishlist</p>
          <Link to="/login?redirect=/account/wishlist" className="btn btn--primary">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-loading">
          <div className="loading-spinner" />
          <p>Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <div>
          <h2>My Wishlist 💜</h2>
          <p>{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</p>
        </div>
        {wishlist.length > 0 && (
          <button className="btn btn--primary" onClick={handleMoveAllToCart}>
            <ShoppingCart size={18} />
            Add All to Cart
          </button>
        )}
      </div>

      {wishlist.length > 0 ? (
        <div className="wishlist-grid">
          {wishlist.map(product => (
            <div key={product._id} className="wishlist-card">
              <button 
                className="wishlist-card__remove"
                onClick={() => handleRemove(product._id)}
                title="Remove from wishlist"
              >
                <Trash2 size={18} />
              </button>

              <Link to={`/product/${product.slug}`} className="wishlist-card__image">
                {product.images?.[0]?.url ? (
                  <img src={getImageUrl(product.images[0].url)} alt={product.name} />
                ) : (
                  <div className="wishlist-card__placeholder">
                    <Package size={32} />
                  </div>
                )}
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="wishlist-card__badge">
                    {Math.round((1 - product.price / product.compareAtPrice) * 100)}% OFF
                  </span>
                )}
              </Link>

              <div className="wishlist-card__content">
                <Link to={`/product/${product.slug}`} className="wishlist-card__name">
                  {product.name}
                </Link>
                
                {product.category?.name && (
                  <span className="wishlist-card__category">{product.category.name}</span>
                )}

                <div className="wishlist-card__price">
                  <span className="current-price">{formatPrice(product.price)}</span>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span className="original-price">{formatPrice(product.compareAtPrice)}</span>
                  )}
                </div>

                <div className="wishlist-card__stock">
                  {product.stock > 0 ? (
                    <span className="in-stock">✓ In Stock</span>
                  ) : (
                    <span className="out-of-stock">Out of Stock</span>
                  )}
                </div>

                <button 
                  className="btn btn--primary btn--full btn--small"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart size={16} />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="wishlist-empty">
          <span className="wishlist-empty__emoji">💜</span>
          <h3>Your wishlist is empty</h3>
          <p>Save items you love by clicking the heart icon on any product!</p>
          <Link to="/shop" className="btn btn--primary">
            Discover Products 🛍️
          </Link>
        </div>
      )}

      {/* Tips Section */}
      {wishlist.length > 0 && (
        <div className="wishlist-tips">
          <h3>💡 Quick Tips</h3>
          <ul>
            <li>Items in your wishlist won't be reserved - add to cart to secure them!</li>
            <li>We'll notify you when items go on sale (coming soon!)</li>
            <li>Share your wishlist with friends for gift ideas</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Wishlist;