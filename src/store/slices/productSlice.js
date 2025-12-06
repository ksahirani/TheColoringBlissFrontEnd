import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const initialState = {
  products: [],
  featuredProducts: [],
  newArrivals: [],
  currentProduct: null,
  relatedProducts: [],
  filters: {
    productTypes: [],
    sizes: [],
    paperTypes: [],
    coverTypes: [],
    bindings: [],
    priceRange: { minPrice: 0, maxPrice: 100 },
  },
  categories: [],
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  },
  loading: false,
  error: null,
};

// Get products with filters
export const getProducts = createAsyncThunk(
  'products/getProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/products?${queryString}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

// Get featured products
export const getFeaturedProducts = createAsyncThunk(
  'products/getFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/products/featured');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured products');
    }
  }
);

// Get new arrivals
export const getNewArrivals = createAsyncThunk(
  'products/getNewArrivals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/products/new-arrivals');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch new arrivals');
    }
  }
);

// Get single product
export const getProduct = createAsyncThunk(
  'products/getProduct',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${slug}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Product not found');
    }
  }
);

// Get filter options
export const getFilters = createAsyncThunk(
  'products/getFilters',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/products/filters');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch filters');
    }
  }
);

// Get categories
export const getCategories = createAsyncThunk(
  'products/getCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
      state.relatedProducts = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get products
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data.products;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get featured products
      .addCase(getFeaturedProducts.fulfilled, (state, action) => {
        state.featuredProducts = action.payload.data.products;
      })
      // Get new arrivals
      .addCase(getNewArrivals.fulfilled, (state, action) => {
        state.newArrivals = action.payload.data.products;
      })
      // Get single product
      .addCase(getProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload.data.product;
        state.relatedProducts = action.payload.data.relatedProducts;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get filters
      .addCase(getFilters.fulfilled, (state, action) => {
        state.filters = action.payload.data;
      })
      // Get categories
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categories = action.payload.data.categories;
      });
  },
});

export const { clearCurrentProduct, clearError } = productSlice.actions;
export default productSlice.reducer;