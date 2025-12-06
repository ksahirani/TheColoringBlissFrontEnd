import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MapPin, Plus, Edit2, Trash2, Check, X, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { setUser } from '../../store/slices/authSlice';

const Addresses = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [formData, setFormData] = useState({
    label: '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Philippines',
    phone: user?.phone || '',
    isDefault: false
  });

  const resetForm = () => {
    setFormData({
      label: '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Philippines',
      phone: user?.phone || '',
      isDefault: false
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEdit = (address) => {
    setFormData({
      label: address.label || '',
      firstName: address.firstName || user?.firstName || '',
      lastName: address.lastName || user?.lastName || '',
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country || 'Philippines',
      phone: address.phone || user?.phone || '',
      isDefault: address.isDefault || false
    });
    setEditingId(address._id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.street || !formData.city || !formData.state || !formData.zipCode) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      let response;
      if (editingId) {
        response = await api.put(`/auth/address/${editingId}`, formData);
      } else {
        response = await api.post('/auth/address', formData);
      }

      // Update user in store
      if (response.data.data.user) {
        dispatch(setUser(response.data.data.user));
        setAddresses(response.data.data.user.addresses);
      }

      toast.success(editingId ? 'Address updated! 📍' : 'Address added! 📍');
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (addressId) => {
    setLoading(true);
    try {
      const response = await api.delete(`/auth/address/${addressId}`);
      
      if (response.data.data.user) {
        dispatch(setUser(response.data.data.user));
        setAddresses(response.data.data.user.addresses);
      }

      toast.success('Address deleted');
      setDeleteConfirm(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete address');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const response = await api.put(`/auth/address/${addressId}`, { isDefault: true });
      
      if (response.data.data.user) {
        dispatch(setUser(response.data.data.user));
        setAddresses(response.data.data.user.addresses);
      }

      toast.success('Default address updated! ⭐');
    } catch (error) {
      toast.error('Failed to update default address');
    }
  };

  const labelOptions = ['Home', 'Work', 'Other'];

  return (
    <div className="addresses-page">
      <div className="addresses-header">
        <div>
          <h2>My Addresses 📍</h2>
          <p>Manage your shipping addresses</p>
        </div>
        {!showForm && (
          <button className="btn btn--primary" onClick={() => setShowForm(true)}>
            <Plus size={18} />
            Add Address
          </button>
        )}
      </div>

      {/* Address Form */}
      {showForm && (
        <div className="address-form-card">
          <div className="address-form-card__header">
            <h3>{editingId ? 'Edit Address' : 'Add New Address'}</h3>
            <button className="close-btn" onClick={resetForm}>
              <X size={20} />
            </button>
          </div>

          <div className="address-form">
            <div className="form-group">
              <label>Label</label>
              <div className="label-options">
                {labelOptions.map(label => (
                  <button
                    key={label}
                    type="button"
                    className={`label-option ${formData.label === label ? 'active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, label }))}
                  >
                    {label === 'Home' && '🏠'}
                    {label === 'Work' && '💼'}
                    {label === 'Other' && '📍'}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Juan"
                />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Dela Cruz"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Street Address *</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="123 Rizal Street, Barangay San Antonio"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Makati City"
                />
              </div>
              <div className="form-group">
                <label>Province/State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
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
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="1200"
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="09171234567"
                />
              </div>
            </div>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
              />
              <span>Set as default address</span>
            </label>

            <div className="address-form__actions">
              <button className="btn btn--secondary" onClick={resetForm}>
                Cancel
              </button>
              <button 
                className="btn btn--primary" 
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Saving...' : (editingId ? 'Update Address' : 'Save Address')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Addresses List */}
      {addresses.length > 0 ? (
        <div className="addresses-grid">
          {addresses.map(address => (
            <div key={address._id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
              {address.isDefault && (
                <span className="address-card__default-badge">
                  <Star size={12} />
                  Default
                </span>
              )}
              
              <div className="address-card__label">
                {address.label === 'Home' && '🏠'}
                {address.label === 'Work' && '💼'}
                {(!address.label || address.label === 'Other') && '📍'}
                {address.label || 'Address'}
              </div>

              <div className="address-card__content">
                <p className="address-name">
                  {address.firstName || user?.firstName} {address.lastName || user?.lastName}
                </p>
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.zipCode}</p>
                {address.phone && <p>{address.phone}</p>}
              </div>

              <div className="address-card__actions">
                {!address.isDefault && (
                  <button 
                    className="action-btn" 
                    onClick={() => handleSetDefault(address._id)}
                    title="Set as default"
                  >
                    <Star size={16} />
                  </button>
                )}
                <button 
                  className="action-btn" 
                  onClick={() => handleEdit(address)}
                  title="Edit"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  className="action-btn action-btn--danger" 
                  onClick={() => setDeleteConfirm(address._id)}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Delete Confirmation */}
              {deleteConfirm === address._id && (
                <div className="delete-confirm">
                  <p>Delete this address?</p>
                  <div className="delete-confirm__actions">
                    <button onClick={() => setDeleteConfirm(null)}>Cancel</button>
                    <button onClick={() => handleDelete(address._id)} className="danger">
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        !showForm && (
          <div className="addresses-empty">
            <span className="addresses-empty__emoji">📭</span>
            <h3>No addresses saved</h3>
            <p>Add your first shipping address to make checkout faster!</p>
            <button className="btn btn--primary" onClick={() => setShowForm(true)}>
              <Plus size={18} />
              Add Your First Address
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default Addresses;