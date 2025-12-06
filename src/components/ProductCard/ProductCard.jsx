import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingCart, Eye, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { addToCart } from '../../store/slices/cartSlice';
import { formatPrice, getImageUrl } from '../../utils/helpers';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAddingToCart) return;
    setIsAddingToCart(true);

    try {
      await dispatch(addToCart({ productId: product._id, quantity: 1 })).unwrap();
      toast.success('Added to cart! 🛒');
    } catch (error) {
      if (!isAuthenticated) {
        toast.error('Please login to add items to cart');
      } else {
        toast.error(error || 'Failed to add to cart');
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }

    try {
      if (isWishlisted) {
        await api.delete(`/auth/wishlist/${product._id}`);
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await api.post('/auth/wishlist', { productId: product._id });
        setIsWishlisted(true);
        toast.success('Added to wishlist! 💜');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const discountPercent = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="product-card">
      {/* Badges */}
      <div className="product-card__badges">
        {discountPercent > 0 && (
          <span className="product-card__badge product-card__badge--sale">
            -{discountPercent}%
          </span>
        )}
        {product.isNewArrival && (
          <span className="product-card__badge product-card__badge--new">
            New
          </span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="product-card__badge product-card__badge--low">
            Only {product.stock} left!
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button 
        className={`product-card__wishlist ${isWishlisted ? 'active' : ''}`}
        onClick={handleToggleWishlist}
        aria-label="Add to wishlist"
      >
        <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
      </button>

      {/* Image */}
      <Link to={`/product/${product.slug}`} className="product-card__image">
        {product.images?.[0]?.url ? (
          <img src={getImageUrl(product.images[0].url)} alt={product.name} />
        ) : (
          <div className="product-card__placeholder">
            <Package size={40} />
          </div>
        )}
        <div className="product-card__overlay">
          <button className="product-card__quick-view">
            <Eye size={18} />
            Quick View
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="product-card__content">
        {product.category?.name && (
          <span className="product-card__category">{product.category.name}</span>
        )}
        
        <Link to={`/product/${product.slug}`} className="product-card__name">
          {product.name}
        </Link>

        <div className="product-card__price">
          <span className="current-price">{formatPrice(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="original-price">{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>

        {/* Add to Cart */}
        <button 
          className="product-card__add-to-cart"
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAddingToCart}
        >
          <ShoppingCart size={18} />
          {product.stock === 0 ? 'Out of Stock' : (isAddingToCart ? 'Adding...' : 'Add to Cart')}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;