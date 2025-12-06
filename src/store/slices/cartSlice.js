import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const initialState = {
  items: [],
  subtotal: 0,
  total: 0,
  itemCount: 0,
  discount: 0,
  couponCode: null,
  loading: false,
  error: null,
};

// Get cart
export const getCart = createAsyncThunk(
  'cart/getCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get cart');
    }
  }
);

// Add to cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity, selectedColor }, { rejectWithValue }) => {
    try {
      const response = await api.post('/cart', { productId, quantity, selectedColor });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

// Update cart item
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/cart/${itemId}`, { quantity });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart');
    }
  }
);

// Remove from cart
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/cart/${itemId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove item');
    }
  }
);

// Clear cart
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete('/cart');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);

// Apply coupon
export const applyCoupon = createAsyncThunk(
  'cart/applyCoupon',
  async (couponCode, { rejectWithValue }) => {
    try {
      const response = await api.post('/cart/coupon', { couponCode });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Invalid coupon code');
    }
  }
);

const updateCartState = (state, cart) => {
  state.items = cart.items || [];
  state.subtotal = cart.subtotal || 0;
  state.total = cart.total || 0;
  state.discount = cart.discount || 0;
  state.couponCode = cart.couponCode || null;
  state.itemCount = cart.items?.reduce((count, item) => count + item.quantity, 0) || 0;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      // Get cart
      .addCase(getCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        updateCartState(state, action.payload.data.cart);
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        updateCartState(state, action.payload.data.cart);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update cart item
      .addCase(updateCartItem.fulfilled, (state, action) => {
        updateCartState(state, action.payload.data.cart);
      })
      // Remove from cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        updateCartState(state, action.payload.data.cart);
      })
      // Clear cart
      .addCase(clearCart.fulfilled, (state) => {
        Object.assign(state, initialState);
      })
      // Apply coupon
      .addCase(applyCoupon.fulfilled, (state, action) => {
        updateCartState(state, action.payload.data.cart);
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;