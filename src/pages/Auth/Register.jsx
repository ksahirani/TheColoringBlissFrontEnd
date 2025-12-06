import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { register, clearError } from '../../store/slices/authSlice';
import Logo from '../../assets/Coloring_Bliss.png';
import './Auth.css';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isAuthenticated, loading, error } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const { confirmPassword, ...userData } = formData;
    
    dispatch(register(userData)).then((result) => {
      if (!result.error) {
        toast.success('Welcome to TheColoringBliss 🎉');
        navigate('/');
      }
    });
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <img src={Logo} alt="The Coloring Bliss" className="logo-image" />
              <span className="logo-text">TheColoringBliss</span>
            </Link>
            <h1>Join the Bliss Family! 🎉</h1>
            <p>Create your account and start shopping</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <div className="input-wrapper">
                  <User size={18} />
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <div className="input-wrapper">
                  <User size={18} />
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <span className="form-hint">Must be at least 6 characters</span>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <Lock size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            <div className="form-checkbox">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree to the <Link to="/terms">Terms of Service</Link> and{' '}
                <Link to="/privacy">Privacy Policy</Link>
              </label>
            </div>

            <button 
              type="submit" 
              className="auth-submit"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="auth-footer">
            <p>Already have an account?</p>
            <Link to="/login" className="btn btn--outline">
              Sign In
            </Link>
          </div>
        </div>

        {/* Decorative Side - Now with visible colors! */}
        <div className="auth-visual">
          <span className="auth-visual__decoration">📔</span>
          <span className="auth-visual__decoration">✨</span>
          <span className="auth-visual__decoration">💜</span>
          <span className="auth-visual__decoration">🎨</span>
          
          <div className="auth-visual__content">
            <h2>"The pen is the tongue of the mind."</h2>
            <p className="auth-visual__author">— Horace</p>
            <div className="auth-visual__features">
              <div className="feature">Exclusive Member Discounts</div>
              <div className="feature">Early Access to New Products</div>
              <div className="feature">Order Tracking</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;