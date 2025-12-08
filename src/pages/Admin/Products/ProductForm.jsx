import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, Image, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../utils/api';
import './Products.css';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    sku: '',
    price: '',
    compareAtPrice: '',
    productType: 'notebook',
    category: '',
    stock: '',
    lowStockThreshold: '5',
    size: {
      name: 'medium',
      displayName: 'A5',
      dimensions: { width: '5.5', height: '8.5' }
    },
    paper: {
      type: 'lined',
      weight: '80',
      color: 'white',
      pageCount: '100'
    },
    cover: {
      type: 'hardcover',
      material: '',
      color: '',
      finish: 'matte'
    },
    binding: 'perfect',
    weight: '',
    isFeatured: false,
    isNewArrival: false,
    isActive: true,
    features: '',
    tags: ''
  });

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/products/id/${id}`);
      const product = response.data.data.product;
      
      // Set existing images
      if (product.images && product.images.length > 0) {
        setImages(product.images.map(img => ({
          url: img.url,
          isExisting: true
        })));
      }
      
      setFormData({
        name: product.name || '',
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        sku: product.sku || '',
        price: product.price?.toString() || '',
        compareAtPrice: product.compareAtPrice?.toString() || '',
        productType: product.productType || 'notebook',
        category: product.category?._id || '',
        stock: product.stock?.toString() || '',
        lowStockThreshold: product.lowStockThreshold?.toString() || '5',
        size: {
          name: product.size?.name || 'medium',
          displayName: product.size?.displayName || 'A5',
          dimensions: {
            width: product.size?.dimensions?.width?.toString() || '5.5',
            height: product.size?.dimensions?.height?.toString() || '8.5'
          }
        },
        paper: {
          type: product.paper?.type || 'lined',
          weight: product.paper?.weight?.toString() || '80',
          color: product.paper?.color || 'white',
          pageCount: product.paper?.pageCount?.toString() || '100'
        },
        cover: {
          type: product.cover?.type || 'hardcover',
          material: product.cover?.material || '',
          color: product.cover?.color || '',
          finish: product.cover?.finish || 'matte'
        },
        binding: product.binding || 'perfect',
        weight: product.weight?.toString() || '',
        isFeatured: product.isFeatured || false,
        isNewArrival: product.isNewArrival || false,
        isActive: product.isActive !== false,
        features: product.features?.join(', ') || '',
        tags: product.tags?.join(', ') || ''
      });
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Failed to load product');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child, subChild] = name.split('.');
      if (subChild) {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent][child],
              [subChild]: value
            }
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Check total images limit
    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await api.post('/upload/product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        const newImages = response.data.data.urls.map(url => ({
          url,
          isExisting: false
        }));
        setImages(prev => [...prev, ...newImages]);
        toast.success('Images uploaded successfully! 📸');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Remove image
  const handleRemoveImage = async (index) => {
    const imageToRemove = images[index];
    
    // If it's a newly uploaded image, try to delete from server
    if (!imageToRemove.isExisting) {
      try {
        const filename = imageToRemove.url.split('/').pop();
        await api.delete(`/upload/product/${filename}`);
      } catch (error) {
        console.error('Failed to delete image from server:', error);
      }
    }
    
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Set primary image (move to first position)
  const handleSetPrimary = (index) => {
    if (index === 0) return;
    setImages(prev => {
      const newImages = [...prev];
      const [removed] = newImages.splice(index, 1);
      newImages.unshift(removed);
      return newImages;
    });
    toast.success('Primary image set! ⭐');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Prepare image data
      const imageData = images.map((img, index) => ({
        url: img.url,
        alt: formData.name,
        isPrimary: index === 0
      }));

      // Prepare data
      const productData = {
        ...formData,
        images: imageData,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
        stock: parseInt(formData.stock),
        lowStockThreshold: parseInt(formData.lowStockThreshold),
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        size: {
          ...formData.size,
          dimensions: {
            width: parseFloat(formData.size.dimensions.width),
            height: parseFloat(formData.size.dimensions.height)
          }
        },
        paper: {
          ...formData.paper,
          weight: parseInt(formData.paper.weight),
          pageCount: parseInt(formData.paper.pageCount)
        },
        features: formData.features ? formData.features.split(',').map(f => f.trim()).filter(Boolean) : [],
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      };

      if (isEditMode) {
        await api.put(`/products/${id}`, productData);
        toast.success('Product updated successfully! ✨');
      } else {
        await api.post('/products', productData);
        toast.success('Product created successfully! 🎉');
      }

      navigate('/admin/products');
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading__spinner" />
        <p>Loading product...</p>
      </div>
    );
  }

  return (
    <div className="product-form-page">
      <div className="admin-page-header">
        <div>
          <button className="back-btn" onClick={() => navigate('/admin/products')}>
            <ArrowLeft size={20} />
            Back to Products
          </button>
          <h1>{isEditMode ? 'Edit Product ✏️' : 'Add New Product 📓'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="product-form__card">
          {/* Images Section */}
          <div className="product-form__section">
            <h3 className="product-form__section-title">
              <Image size={20} />
              Product Images
            </h3>
            
            {/* Image Upload Area */}
            <div 
              className={`image-upload ${uploading ? 'image-upload--uploading' : ''}`}
              onClick={() => !uploading && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <div className="image-upload__icon">
                {uploading ? <Loader size={24} className="spinning" /> : <Upload size={24} />}
              </div>
              <p className="image-upload__text">
                {uploading ? 'Uploading...' : 'Click to upload images'}
              </p>
              <p className="image-upload__hint">
                PNG, JPG, GIF, WebP up to 5MB (max 5 images)
              </p>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="image-previews">
                {images.map((image, index) => (
                  <div key={index} className={`image-preview ${index === 0 ? 'image-preview--primary' : ''}`}>
                    <img 
                      src={image.url.startsWith('/') ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${image.url}` : image.url} 
                      alt={`Product ${index + 1}`} 
                    />
                    {index === 0 && <span className="image-preview__badge">Primary</span>}
                    <div className="image-preview__actions">
                      {index !== 0 && (
                        <button
                          type="button"
                          className="image-preview__btn--primary"
                          onClick={() => handleSetPrimary(index)}
                          title="Set as primary"
                        >
                          ⭐
                        </button>
                      )}
                      <button
                        type="button"
                        className="image-preview__btn--delete"
                        onClick={() => handleRemoveImage(index)}
                        title="Remove image"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="product-form__section">
            <h3 className="product-form__section-title">Basic Information</h3>
            <div className="admin-form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Classic Lined Notebook"
                required
              />
            </div>

            <div className="admin-form-group">
              <label>Short Description</label>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                placeholder="Brief description for product cards"
              />
            </div>

            <div className="admin-form-group">
              <label>Full Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Detailed product description..."
                rows={4}
              />
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="product-form__section">
            <h3 className="product-form__section-title">Pricing & Inventory</h3>
            <div className="product-form__grid">
              <div className="admin-form-group">
                <label>Price (₱) *</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Compare at Price (₱)</label>
                <input
                  type="number"
                  step="0.01"
                  name="compareAtPrice"
                  value={formData.compareAtPrice}
                  onChange={handleChange}
                  placeholder="Original price (for sale items)"
                />
              </div>

              <div className="admin-form-group">
                <label>SKU *</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="e.g., NB-CLN-001"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Stock *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Organization */}
          <div className="product-form__section">
            <h3 className="product-form__section-title">Organization</h3>
            <div className="product-form__grid">
              <div className="admin-form-group">
                <label>Product Type *</label>
                <select
                  name="productType"
                  value={formData.productType}
                  onChange={handleChange}
                  required
                >
                  <option value="notebook">Notebook</option>
                  <option value="notepad">Notepad</option>
                  <option value="journal">Journal</option>
                  <option value="sketchbook">Sketchbook</option>
                  <option value="planner">Planner</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  {categories
                    .filter(cat => !cat.parent) // Only parent categories
                    .map(parentCat => (
                      <optgroup key={parentCat._id} label={parentCat.name}>
                        {/* Show parent as selectable option */}
                        <option value={parentCat._id}>{parentCat.name} (General)</option>
                        {/* Show subcategories */}
                        {categories
                          .filter(sub => sub.parent === parentCat._id || sub.parent?._id === parentCat._id)
                          .map(subCat => (
                            <option key={subCat._id} value={subCat._id}>
                              {subCat.name}
                            </option>
                          ))
                        }
                      </optgroup>
                    ))
                  }
                  {/* Show categories without parent (legacy/uncategorized) */}
                  {categories
                    .filter(cat => !cat.parent && !categories.some(sub => sub.parent === cat._id || sub.parent?._id === cat._id))
                    .map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))
                  }
                </select>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="product-form__section">
            <h3 className="product-form__section-title">Product Details</h3>
            
            {/* Size */}
            <h4 className="product-form__subtitle">Size</h4>
            <div className="product-form__grid product-form__grid--3">
              <div className="admin-form-group">
                <label>Size Name</label>
                <select
                  name="size.name"
                  value={formData.size.name}
                  onChange={handleChange}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label>Display Name</label>
                <input
                  type="text"
                  name="size.displayName"
                  value={formData.size.displayName}
                  onChange={handleChange}
                  placeholder="e.g., A5, A4"
                />
              </div>
              <div className="admin-form-group">
                <label>Dimensions (W x H)</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="number"
                    step="0.1"
                    name="size.dimensions.width"
                    value={formData.size.dimensions.width}
                    onChange={handleChange}
                    placeholder="Width"
                    style={{ flex: 1 }}
                  />
                  <span>×</span>
                  <input
                    type="number"
                    step="0.1"
                    name="size.dimensions.height"
                    value={formData.size.dimensions.height}
                    onChange={handleChange}
                    placeholder="Height"
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
            </div>

            {/* Paper */}
            <h4 className="product-form__subtitle">Paper</h4>
            <div className="product-form__grid">
              <div className="admin-form-group">
                <label>Paper Type</label>
                <select
                  name="paper.type"
                  value={formData.paper.type}
                  onChange={handleChange}
                >
                  <option value="lined">Lined</option>
                  <option value="dotted">Dotted</option>
                  <option value="grid">Grid</option>
                  <option value="blank">Blank</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label>Page Count</label>
                <input
                  type="number"
                  name="paper.pageCount"
                  value={formData.paper.pageCount}
                  onChange={handleChange}
                  placeholder="100"
                />
              </div>
            </div>

            {/* Cover */}
            <h4 className="product-form__subtitle">Cover</h4>
            <div className="product-form__grid">
              <div className="admin-form-group">
                <label>Cover Type</label>
                <select
                  name="cover.type"
                  value={formData.cover.type}
                  onChange={handleChange}
                >
                  <option value="hardcover">Hardcover</option>
                  <option value="softcover">Softcover</option>
                  <option value="leather">Leather</option>
                  <option value="fabric">Fabric</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label>Finish</label>
                <select
                  name="cover.finish"
                  value={formData.cover.finish}
                  onChange={handleChange}
                >
                  <option value="matte">Matte</option>
                  <option value="glossy">Glossy</option>
                  <option value="textured">Textured</option>
                </select>
              </div>
            </div>

            {/* Binding */}
            <div className="admin-form-group">
              <label>Binding</label>
              <select
                name="binding"
                value={formData.binding}
                onChange={handleChange}
              >
                <option value="perfect">Perfect Bound</option>
                <option value="spiral">Spiral</option>
                <option value="stitched">Stitched</option>
                <option value="ring">Ring Bound</option>
              </select>
            </div>
          </div>

          {/* Status Flags */}
          <div className="product-form__section">
            <h3 className="product-form__section-title">Status</h3>
            <div className="checkbox-group">
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <span>Active (visible in store)</span>
              </label>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                />
                <span>Featured product ⭐</span>
              </label>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  name="isNewArrival"
                  checked={formData.isNewArrival}
                  onChange={handleChange}
                />
                <span>New arrival 🆕</span>
              </label>
            </div>
          </div>

          {/* Features & Tags */}
          <div className="product-form__section">
            <h3 className="product-form__section-title">Features & Tags</h3>
            <div className="admin-form-group">
              <label>Features (comma separated)</label>
              <textarea
                name="features"
                value={formData.features}
                onChange={handleChange}
                placeholder="e.g., Lay-flat binding, Ribbon bookmark, Acid-free paper"
                rows={3}
              />
            </div>
            <div className="admin-form-group">
              <label>Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g., premium, bestseller, gift"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="product-form__actions">
            <button
              type="button"
              className="admin-btn admin-btn--secondary"
              onClick={() => navigate('/admin/products')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn--primary"
              disabled={saving}
            >
              <Save size={18} />
              {saving ? 'Saving...' : (isEditMode ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;