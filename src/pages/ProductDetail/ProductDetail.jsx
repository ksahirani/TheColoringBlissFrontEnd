import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingBag, Truck, Shield, RotateCcw, Minus, Plus, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProduct, clearCurrentProduct } from '../../store/slices/productSlice';
import { addToCart } from '../../store/slices/cartSlice';
import ProductCard from '../../components/ProductCard/ProductCard';
import { formatPrice, getSizeDisplayName, getPaperTypeDisplayName, getCoverTypeDisplayName, getBindingDisplayName, getImageUrl } from '../../utils/helpers';
import './ProductDetail.css';

const ProductDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  
  const { currentProduct: product, relatedProducts, loading, error } = useSelector(state => state.products);
  const { isAuthenticated } = useSelector(state => state.auth);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    dispatch(getProduct(slug));
    
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, slug]);

  useEffect(() => {
    if (product?.colors?.length > 0) {
      setSelectedColor(product.colors[0]);
    }
  }, [product]);

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    dispatch(addToCart({
      productId: product._id,
      quantity,
      selectedColor
    })).then((result) => {
      if (!result.error) {
        toast.success(`${product.name} added to cart!`);
      } else {
        toast.error(result.payload || 'Failed to add to cart');
      }
    });
  };

  if (loading) {
    return (
      <main className="product-detail-page">
        <div className="container">
          <div className="product-loading">
            <div className="loading-spinner" />
            <p>Loading product...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="product-detail-page">
        <div className="container">
          <div className="product-error">
            <h2>Product not found</h2>
            <p>The product you're looking for doesn't exist or has been removed.</p>
            <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
          </div>
        </div>
      </main>
    );
  }

  const discountPercentage = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <main className="product-detail-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <Link to="/shop">Shop</Link>
          <ChevronRight size={14} />
          <span>{product.name}</span>
        </div>
      </div>

      <div className="container">
        <div className="product-detail">
          {/* Product Gallery */}
          <motion.div 
            className="product-gallery"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="product-gallery__main">
              {product.isNewArrival && <span className="badge badge-new">New</span>}
              {discountPercentage > 0 && <span className="badge badge-sale">-{discountPercentage}%</span>}
              <img 
                src={getImageUrl(product.images?.[selectedImage]?.url)} 
                alt={product.images?.[selectedImage]?.alt || product.name}
              />
            </div>
            {product.images?.length > 1 && (
              <div className="product-gallery__thumbs">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`product-gallery__thumb ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={getImageUrl(image.url)} alt={image.alt || product.name} />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div 
            className="product-info"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Category */}
            <Link to={`/shop?category=${product.category?._id}`} className="product-info__category">
              {product.category?.name}
            </Link>

            {/* Title */}
            <h1 className="product-info__title">{product.name}</h1>

            {/* Rating */}
            {product.reviewCount > 0 && (
              <div className="product-info__rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      size={18}
                      fill={i < Math.floor(product.averageRating) ? 'currentColor' : 'none'}
                      className={i < Math.floor(product.averageRating) ? 'star-filled' : 'star-empty'}
                    />
                  ))}
                </div>
                <span className="rating-text">
                  {product.averageRating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="product-info__price">
              <span className="current-price">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <span className="original-price">{formatPrice(product.compareAtPrice)}</span>
              )}
            </div>

            {/* Short Description */}
            <p className="product-info__description">{product.shortDescription || product.description}</p>

            {/* Specifications Quick View */}
            <div className="product-specs-quick">
              <div className="spec-item">
                <span className="spec-label">Size</span>
                <span className="spec-value">{getSizeDisplayName(product.size?.name)} ({product.size?.displayName})</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Paper</span>
                <span className="spec-value">{getPaperTypeDisplayName(product.paper?.type)} • {product.paper?.pageCount} pages</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Cover</span>
                <span className="spec-value">{getCoverTypeDisplayName(product.cover?.type)}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Binding</span>
                <span className="spec-value">{getBindingDisplayName(product.binding)}</span>
              </div>
            </div>

            {/* Color Selection */}
            {product.colors?.length > 0 && (
              <div className="product-colors">
                <span className="product-colors__label">
                  Color: <strong>{selectedColor?.name}</strong>
                </span>
                <div className="product-colors__options">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      className={`color-option ${selectedColor?.hex === color.hex ? 'active' : ''}`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => setSelectedColor(color)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="product-actions">
              <div className="quantity-selector">
                <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                  <Minus size={18} />
                </button>
                <span>{quantity}</span>
                <button onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stock}>
                  <Plus size={18} />
                </button>
              </div>

              <button 
                className="btn btn-primary btn-lg add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingBag size={20} />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>

              <button className="wishlist-btn" aria-label="Add to wishlist">
                <Heart size={22} />
              </button>
            </div>

            {/* Stock Status */}
            <div className="product-stock">
              {product.stock > 0 ? (
                product.stock <= product.lowStockThreshold ? (
                  <span className="stock-low">Only {product.stock} left in stock!</span>
                ) : (
                  <span className="stock-available">In Stock</span>
                )
              ) : (
                <span className="stock-out">Out of Stock</span>
              )}
            </div>

            {/* Trust Badges */}
            <div className="trust-badges">
              <div className="trust-badge">
                <Truck size={20} />
                <span>Free shipping over $50</span>
              </div>
              <div className="trust-badge">
                <Shield size={20} />
                <span>Quality guaranteed</span>
              </div>
              <div className="trust-badge">
                <RotateCcw size={20} />
                <span>30-day returns</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Tabs */}
        <div className="product-tabs">
          <div className="product-tabs__nav">
            <button 
              className={activeTab === 'description' ? 'active' : ''}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={activeTab === 'specifications' ? 'active' : ''}
              onClick={() => setActiveTab('specifications')}
            >
              Specifications
            </button>
            <button 
              className={activeTab === 'reviews' ? 'active' : ''}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({product.reviewCount || 0})
            </button>
          </div>

          <div className="product-tabs__content">
            {activeTab === 'description' && (
              <div className="tab-description">
                <p>{product.description}</p>
                {product.features?.length > 0 && (
                  <>
                    <h4>Features</h4>
                    <ul>
                      {product.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="tab-specifications">
                <table>
                  <tbody>
                    <tr>
                      <td>Size</td>
                      <td>{product.size?.dimensions?.width}" × {product.size?.dimensions?.height}"</td>
                    </tr>
                    <tr>
                      <td>Paper Type</td>
                      <td>{getPaperTypeDisplayName(product.paper?.type)}</td>
                    </tr>
                    <tr>
                      <td>Paper Weight</td>
                      <td>{product.paper?.weight} GSM</td>
                    </tr>
                    <tr>
                      <td>Page Count</td>
                      <td>{product.paper?.pageCount} pages</td>
                    </tr>
                    <tr>
                      <td>Cover Type</td>
                      <td>{getCoverTypeDisplayName(product.cover?.type)}</td>
                    </tr>
                    <tr>
                      <td>Cover Material</td>
                      <td>{product.cover?.material}</td>
                    </tr>
                    <tr>
                      <td>Binding</td>
                      <td>{getBindingDisplayName(product.binding)}</td>
                    </tr>
                    <tr>
                      <td>Weight</td>
                      <td>{product.weight} oz</td>
                    </tr>
                    <tr>
                      <td>SKU</td>
                      <td>{product.sku}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-reviews">
                {product.reviews?.length > 0 ? (
                  product.reviews.map((review, index) => (
                    <div key={index} className="review-card">
                      <div className="review-header">
                        <div className="review-stars">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              size={14}
                              fill={i < review.rating ? 'currentColor' : 'none'}
                              className={i < review.rating ? 'star-filled' : 'star-empty'}
                            />
                          ))}
                        </div>
                        <span className="review-author">
                          {review.user?.firstName} {review.user?.lastName?.charAt(0)}.
                        </span>
                      </div>
                      {review.title && <h5 className="review-title">{review.title}</h5>}
                      <p className="review-comment">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts?.length > 0 && (
          <section className="related-products section">
            <h2>You May Also Like</h2>
            <div className="products-grid grid grid-4">
              {relatedProducts.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default ProductDetail;