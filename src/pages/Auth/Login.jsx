import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { login, clearError } from '../../store/slices/authSlice';
import Logo from '../../assets/Coloring_Bliss.png';
import './Auth.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { isAuthenticated, loading, error } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  // Get redirect URL from query params
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, redirect]);

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
    dispatch(login(formData)).then((result) => {
      if (!result.error) {
        toast.success('Welcome back! 👋');
        navigate(redirect);
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
            <h1>Welcome Back! 👋</h1>
            <p>Sign in to continue to your account</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
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
              <div className="form-group__header">
                <label htmlFor="password">Password</label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>
              <div className="input-wrapper">
                <Lock size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
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
            </div>

            <button 
              type="submit" 
              className="auth-submit"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'} 
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="auth-footer">
            <p>Don't have an account?</p>
            <Link to="/register" className="btn btn--outline">
              Create Account ✨
            </Link>
          </div>
        </div>

        {/* Decorative Side - Now with visible colors! */}
        <div className="auth-visual">
          <span className="auth-visual__decoration">📓</span>
          <span className="auth-visual__decoration">✏️</span>
          <span className="auth-visual__decoration">🌸</span>
          <span className="auth-visual__decoration">⭐</span>
          
          <div className="auth-visual__content">
            <h2>"The act of putting pen to paper encourages pause for thought."</h2>
            <p className="auth-visual__author">— Norbert Platt</p>
            <div className="auth-visual__features">
              <div className="feature">Premium Quality</div>
              <div className="feature">Free Shipping</div>
              <div className="feature">Exclusive Offers</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;