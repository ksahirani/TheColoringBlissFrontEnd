import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Mail, Phone, Lock, Save, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { setUser } from '../../store/slices/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const response = await api.put('/auth/me', formData);
      dispatch(setUser(response.data.data.user));
      toast.success('Profile updated! ✨');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await api.put('/auth/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password changed successfully! 🔐');
      setShowPasswordForm(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      {/* Profile Card */}
      <div className="account-card">
        <div className="account-card__header">
          <div className="account-card__title">
            <User size={20} />
            <h2>Personal Information</h2>
          </div>
          {!isEditing && (
            <button className="btn btn--small btn--outline" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>

        <div className="account-card__body">
          {isEditing ? (
            <div className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Your first name"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Your last name"
                  />
                </div>
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

              <div className="profile-form__actions">
                <button 
                  className="btn btn--secondary" 
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      firstName: user?.firstName || '',
                      lastName: user?.lastName || '',
                      phone: user?.phone || ''
                    });
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn--primary"
                  onClick={handleSaveProfile}
                  disabled={loading}
                >
                  <Save size={18} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-info">
              <div className="profile-info__item">
                <User size={18} />
                <div>
                  <label>Full Name</label>
                  <p>{user?.firstName} {user?.lastName}</p>
                </div>
              </div>
              <div className="profile-info__item">
                <Mail size={18} />
                <div>
                  <label>Email Address</label>
                  <p>{user?.email}</p>
                </div>
              </div>
              <div className="profile-info__item">
                <Phone size={18} />
                <div>
                  <label>Phone Number</label>
                  <p>{user?.phone || 'Not set'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Password Card */}
      <div className="account-card">
        <div className="account-card__header">
          <div className="account-card__title">
            <Lock size={20} />
            <h2>Password & Security</h2>
          </div>
          {!showPasswordForm && (
            <button className="btn btn--small btn--outline" onClick={() => setShowPasswordForm(true)}>
              Change Password
            </button>
          )}
        </div>

        <div className="account-card__body">
          {showPasswordForm ? (
            <div className="password-form">
              <div className="form-group">
                <label>Current Password</label>
                <div className="password-input">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                  />
                  <button 
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  >
                    {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>New Password</label>
                <div className="password-input">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                  />
                  <button 
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  >
                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <div className="password-input">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                  />
                  <button 
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  >
                    {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="profile-form__actions">
                <button 
                  className="btn btn--secondary" 
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn--primary"
                  onClick={handleChangePassword}
                  disabled={loading}
                >
                  <Lock size={18} />
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          ) : (
            <p className="security-info">
              🔒 Your password was last changed on {new Date(user?.updatedAt || Date.now()).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Account Stats */}
      <div className="account-stats">
        <div className="account-stat">
          <span className="account-stat__emoji">🛒</span>
          <span className="account-stat__label">Member Since</span>
          <span className="account-stat__value">
            {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </span>
        </div>
        <div className="account-stat">
          <span className="account-stat__emoji">📍</span>
          <span className="account-stat__label">Saved Addresses</span>
          <span className="account-stat__value">{user?.addresses?.length || 0}</span>
        </div>
        <div className="account-stat">
          <span className="account-stat__emoji">💜</span>
          <span className="account-stat__label">Wishlist Items</span>
          <span className="account-stat__value">{user?.wishlist?.length || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;