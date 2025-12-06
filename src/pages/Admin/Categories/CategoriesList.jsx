import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, FolderTree, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../utils/api';
import './Categories.css';

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, category: null });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.category) return;
    
    try {
      await api.delete(`/categories/${deleteModal.category._id}`);
      toast.success('Category deleted successfully');
      setDeleteModal({ open: false, category: null });
      fetchCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error(error.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div className="categories-page">
      <div className="admin-page-header">
        <div>
          <h1>Categories</h1>
          <p>Manage product categories</p>
        </div>
        <Link to="/admin/categories/new" className="admin-btn admin-btn--primary">
          <Plus size={18} />
          Add Category
        </Link>
      </div>

      {/* Categories Table */}
      <div className="admin-card">
        {loading ? (
          <div className="admin-loading">
            <div className="loading-spinner" />
          </div>
        ) : categories.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 50 }}></th>
                <th>Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category._id}>
                  <td>
                    <GripVertical size={18} className="drag-handle" />
                  </td>
                  <td>
                    <div className="category-name">
                      <div className="category-icon">
                        <FolderTree size={18} />
                      </div>
                      <span>{category.name}</span>
                    </div>
                  </td>
                  <td>
                    <code className="category-slug">{category.slug}</code>
                  </td>
                  <td>
                    <span className="category-description">
                      {category.description || '-'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-badge--${category.isActive ? 'active' : 'inactive'}`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/admin/categories/${category._id}/edit`} className="admin-btn admin-btn--icon" title="Edit">
                        <Edit size={18} />
                      </Link>
                      <button 
                        className="admin-btn admin-btn--icon" 
                        title="Delete"
                        onClick={() => setDeleteModal({ open: true, category })}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="admin-empty">
            <FolderTree size={48} />
            <h3>No categories found</h3>
            <p>Get started by adding your first category</p>
            <Link to="/admin/categories/new" className="admin-btn admin-btn--primary">
              <Plus size={18} />
              Add Category
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="modal-overlay" onClick={() => setDeleteModal({ open: false, category: null })}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Delete Category</h3>
            <p>Are you sure you want to delete "{deleteModal.category?.name}"? This action cannot be undone.</p>
            <div className="modal__actions">
              <button 
                className="admin-btn admin-btn--secondary"
                onClick={() => setDeleteModal({ open: false, category: null })}
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

export default CategoriesList;