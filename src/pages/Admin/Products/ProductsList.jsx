import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../utils/api';
import { formatPrice, getImageUrl } from '../../../utils/helpers';
import './Products.css';

const ProductsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [deleteModal, setDeleteModal] = useState({ open: false, product: null });

  const currentPage = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('limit', 10);
      
      const search = searchParams.get('search');
      if (search) params.append('search', search);

      const response = await api.get(`/products?${params.toString()}`);
      setProducts(response.data.data.products);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  const handleDelete = async () => {
    if (!deleteModal.product) return;
    
    try {
      await api.delete(`/products/${deleteModal.product._id}`);
      toast.success('Product deleted successfully');
      setDeleteModal({ open: false, product: null });
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="products-page">
      <div className="admin-page-header">
        <div>
          <h1>Products</h1>
          <p>Manage your product inventory</p>
        </div>
        <Link to="/admin/products/new" className="admin-btn admin-btn--primary">
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {/* Toolbar */}
      <div className="admin-toolbar">
        <form className="admin-search" onSubmit={handleSearch}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        <div className="admin-filters">
          <span className="products-count">{pagination.total} products</span>
        </div>
      </div>

      {/* Products Table */}
      <div className="admin-card">
        {loading ? (
          <div className="admin-loading">
            <div className="loading-spinner" />
          </div>
        ) : products.length > 0 ? (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id}>
                    <td>
                      <div className="product-cell">
                        <div className="product-cell__image">
                          {product.images?.[0]?.url ? (
                            <img src={getImageUrl(product.images[0].url)} alt={product.name} />
                          ) : (
                            <Package size={24} />
                          )}
                        </div>
                        <div className="product-cell__info">
                          <span className="product-cell__name">{product.name}</span>
                          <span className="product-cell__type">{product.productType}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <code className="product-sku">{product.sku}</code>
                    </td>
                    <td>{product.category?.name || '-'}</td>
                    <td>
                      <div className="product-price">
                        <span>{formatPrice(product.price)}</span>
                        {product.compareAtPrice && (
                          <span className="product-price--compare">{formatPrice(product.compareAtPrice)}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`stock-indicator ${product.stock <= 5 ? 'stock-indicator--low' : ''}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-badge--${product.isActive ? 'active' : 'inactive'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/product/${product.slug}`} target="_blank" className="admin-btn admin-btn--icon" title="View">
                          <Eye size={18} />
                        </Link>
                        <Link to={`/admin/products/${product._id}/edit`} className="admin-btn admin-btn--icon" title="Edit">
                          <Edit size={18} />
                        </Link>
                        <button 
                          className="admin-btn admin-btn--icon" 
                          title="Delete"
                          onClick={() => setDeleteModal({ open: true, product })}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="admin-pagination">
                <button
                  className="admin-pagination__btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={18} />
                </button>
                
                {[...Array(pagination.pages)].map((_, i) => (
                  <button
                    key={i + 1}
                    className={`admin-pagination__btn ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  className="admin-pagination__btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="admin-empty">
            <Package size={48} />
            <h3>No products found</h3>
            <p>Get started by adding your first product</p>
            <Link to="/admin/products/new" className="admin-btn admin-btn--primary">
              <Plus size={18} />
              Add Product
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="modal-overlay" onClick={() => setDeleteModal({ open: false, product: null })}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Delete Product</h3>
            <p>Are you sure you want to delete "{deleteModal.product?.name}"? This action cannot be undone.</p>
            <div className="modal__actions">
              <button 
                className="admin-btn admin-btn--secondary"
                onClick={() => setDeleteModal({ open: false, product: null })}
              >
                Cancel
              </button>
              <button className="admin-btn admin-btn--danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsList;