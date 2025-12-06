import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';

import store from './store';
import { getCategories } from './store/slices/productSlice';
import { getCart } from './store/slices/cartSlice';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

// Public Pages
import Home from './pages/Home/Home';
import Shop from './pages/Shop/Shop';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess/CheckoutSuccess';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Info Pages
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import FAQ from './pages/FAQ/FAQ';
import Shipping from './pages/Shipping/Shipping';
import Returns from './pages/Returns/Returns';

// Account Pages
import AccountLayout from './pages/Account/AccountLayout';
import Profile from './pages/Account/Profile';
import Orders from './pages/Account/Orders';
import OrderDetail from './pages/Account/OrderDetail';
import Addresses from './pages/Account/Addresses';
import Wishlist from './pages/Wishlist/Wishlist';

// Admin Pages
import AdminLayout from './pages/Admin/components/AdminLayout';
import Dashboard from './pages/Admin/Dashboard/Dashboard';
import ProductsList from './pages/Admin/Products/ProductsList';
import ProductForm from './pages/Admin/Products/ProductForm';
import AdminOrdersList from './pages/Admin/Orders/OrdersList';
import AdminOrderDetail from './pages/Admin/Orders/OrderDetail';
import CategoriesList from './pages/Admin/Categories/CategoriesList';
import CategoryForm from './pages/Admin/Categories/CategoryForm';

// Styles
import './styles/globals.css';
import './components/Header/Header.css';
import './components/Footer/Footer.css';
import './components/ProductCard/ProductCard.css';
import './pages/Home/Home.css';
import './pages/About/About.css';
import './pages/Contact/Contact.css';
import './pages/FAQ/FAQ.css';
import './pages/Shipping/Shipping.css';
import './pages/Returns/Returns.css';
import './pages/Checkout/Checkout.css';
import './pages/Account/Account.css';
import './pages/Wishlist/Wishlist.css';
import './pages/Admin/components/AdminLayout.css';
import './pages/Admin/Dashboard/Dashboard.css';
import './pages/Admin/Products/Products.css';
import './pages/Admin/Orders/Orders.css';
import './pages/Admin/Categories/Categories.css';

const AppContent = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated } = useSelector(state => state.auth);
  
  // Check if we're on an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    dispatch(getCategories());
    
    if (isAuthenticated) {
      dispatch(getCart());
    }
  }, [dispatch, isAuthenticated]);

  // Admin routes - no header/footer
  if (isAdminRoute) {
    return (
      <>
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductsList />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id/edit" element={<ProductForm />} />
            <Route path="orders" element={<AdminOrdersList />} />
            <Route path="orders/:id" element={<AdminOrderDetail />} />
            <Route path="categories" element={<CategoriesList />} />
            <Route path="categories/new" element={<CategoryForm />} />
            <Route path="categories/:id/edit" element={<CategoryForm />} />
          </Route>
        </Routes>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1a1a2e',
              color: '#faf9f6',
              borderRadius: '12px',
            },
          }}
        />
      </>
    );
  }

  // Public routes - with header/footer
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Info Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/returns" element={<Returns />} />
          
          {/* Account Pages */}
          <Route path="/account" element={<AccountLayout />}>
            <Route index element={<Profile />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="wishlist" element={<Wishlist />} />
          </Route>
        </Routes>
      </main>
      <Footer />
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1a2e',
            color: '#faf9f6',
            borderRadius: '12px',
          },
          success: {
            iconTheme: {
              primary: '#8b5cf6',
              secondary: '#faf9f6',
            },
          },
        }}
      />
    </div>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
};

export default App;