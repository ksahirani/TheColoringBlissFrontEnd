import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../utils/api';
import './Categories.css';

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    isActive: true,
    displayOrder: 0
  });

  useEffect(() => {
    if (isEditMode) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/categories/id/${id}`);
      const category = response.data.data.category;
      
      setFormData({
        name: category.name || '',
        description: category.description || '',
        image: category.image || '',
        isActive: category.isActive !== false,
        displayOrder: category.displayOrder || 0
      });
    } catch (error) {
      console.error('Failed to fetch category:', error);
      toast.error('Failed to load category');
      navigate('/admin/categories');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isEditMode) {
        await api.put(`/categories/${id}`, formData);
        toast.success('Category updated successfully');
      } else {
        await api.post('/categories', formData);
        toast.success('Category created successfully');
      }

      navigate('/admin/categories');
    } catch (error) {
      console.error('Failed to save category:', error);
      toast.error(error.response?.data?.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="category-form-page">
      <div className="admin-page-header">
        <div>
          <button className="back-btn" onClick={() => navigate('/admin/categories')}>
            <ArrowLeft size={20} />
            Back to Categories
          </button>
          <h1>{isEditMode ? 'Edit Category' : 'Add New Category'}</h1>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: 600 }}>
        <div className="admin-card__body">
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form__group">
              <label className="admin-form__label">Category Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="admin-form__input"
                placeholder="e.g., Notebooks"
                required
              />
            </div>

            <div className="admin-form__group">
              <label className="admin-form__label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="admin-form__textarea"
                placeholder="Brief description of the category"
                rows={4}
              />
            </div>

            <div className="admin-form__group">
              <label className="admin-form__label">Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="admin-form__input"
                placeholder="https://your_image/image.jpg"
              />
            </div>

            <div className="admin-form__group">
              <label className="admin-form__label">Display Order</label>
              <input
                type="number"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleChange}
                className="admin-form__input"
                min="0"
              />
              <span className="form-hint">Lower numbers appear first</span>
            </div>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              <span>Active (visible in store)</span>
            </label>

            <div className="admin-form__actions">
              <button 
                type="button" 
                className="admin-btn admin-btn--secondary"
                onClick={() => navigate('/admin/categories')}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="admin-btn admin-btn--primary"
                disabled={saving}
              >
                <Save size={18} />
                {saving ? 'Saving...' : (isEditMode ? 'Update Category' : 'Create Category')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;