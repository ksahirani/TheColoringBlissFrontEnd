import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown, Grid3X3, LayoutList, Search } from 'lucide-react';
import { getProducts, getFilters, getCategories } from '../../store/slices/productSlice';
import ProductCard from '../../components/ProductCard/ProductCard';
import { debounce, getSizeDisplayName, getPaperTypeDisplayName, getCoverTypeDisplayName, getBindingDisplayName } from '../../utils/helpers';
import './Shop.css';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  
  const { products, filters, categories, pagination, loading } = useSelector(state => state.products);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [activeFilters, setActiveFilters] = useState({
    category: searchParams.get('category') || '',
    productType: searchParams.getAll('productType') || [],
    size: searchParams.getAll('size') || [],
    paperType: searchParams.getAll('paperType') || [],
    coverType: searchParams.getAll('coverType') || [],
    binding: searchParams.getAll('binding') || [],
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || '-createdAt',
    featured: searchParams.get('featured') || '',
    newArrivals: searchParams.get('newArrivals') || '',
  });

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    productType: true,
    size: true,
    paperType: false,
    coverType: false,
    binding: false,
    price: true
  });

  // Fetch filters and categories on mount
  useEffect(() => {
    dispatch(getFilters());
    dispatch(getCategories());
  }, [dispatch]);

  // Debounced fetch products
  const debouncedFetchProducts = useCallback(
    debounce((params) => {
      dispatch(getProducts(params));
    }, 300),
    [dispatch]
  );

  // Fetch products when filters change
  useEffect(() => {
    const params = {};
    
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value && (Array.isArray(value) ? value.length > 0 : true)) {
        if (Array.isArray(value)) {
          params[key] = value.join(',');
        } else {
          params[key] = value;
        }
      }
    });

    params.page = pagination.page;
    params.limit = 12;

    debouncedFetchProducts(params);
  }, [activeFilters, pagination.page, debouncedFetchProducts]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value && (Array.isArray(value) ? value.length > 0 : true)) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.set(key, value);
        }
      }
    });

    setSearchParams(params);
  }, [activeFilters, setSearchParams]);

  const handleFilterChange = (filterType, value, isMulti = true) => {
    setActiveFilters(prev => {
      if (isMulti) {
        const currentValues = prev[filterType] || [];
        const newValues = currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value];
        return { ...prev, [filterType]: newValues };
      }
      return { ...prev, [filterType]: value };
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({
      category: '',
      productType: [],
      size: [],
      paperType: [],
      coverType: [],
      binding: [],
      minPrice: '',
      maxPrice: '',
      search: '',
      sort: '-createdAt',
      featured: '',
      newArrivals: '',
    });
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const activeFilterCount = Object.values(activeFilters).reduce((count, value) => {
    if (Array.isArray(value)) return count + value.length;
    if (value && value !== '-createdAt') return count + 1;
    return count;
  }, 0);

  const sortOptions = [
    { value: '-createdAt', label: 'Newest' },
    { value: 'createdAt', label: 'Oldest' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: '-averageRating', label: 'Top Rated' },
    { value: 'name', label: 'Name: A-Z' },
  ];

  const FilterSection = ({ title, sectionKey, children }) => (
    <div className="filter-section">
      <button 
        className="filter-section__header"
        onClick={() => toggleSection(sectionKey)}
      >
        <span>{title}</span>
        <ChevronDown 
          size={16} 
          className={`filter-section__icon ${expandedSections[sectionKey] ? 'expanded' : ''}`}
        />
      </button>
      <AnimatePresence>
        {expandedSections[sectionKey] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="filter-section__content"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <main className="shop-page">
      {/* Page Header */}
      <section className="shop-header">
        <div className="container">
          <h1>Shop All Products</h1>
          <p>Discover our collection of premium notebooks and stationery</p>
        </div>
      </section>

      <div className="container">
        <div className="shop-layout">
          {/* Filters Sidebar */}
          <aside className={`shop-filters ${isFilterOpen ? 'shop-filters--open' : ''}`}>
            <div className="shop-filters__header">
              <h3>Filters</h3>
              {activeFilterCount > 0 && (
                <button className="shop-filters__clear" onClick={clearAllFilters}>
                  Clear All ({activeFilterCount})
                </button>
              )}
              <button 
                className="shop-filters__close"
                onClick={() => setIsFilterOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            <div className="shop-filters__body">
              {/* Search */}
              <div className="filter-search">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={activeFilters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value, false)}
                />
              </div>

              {/* Categories */}
              <FilterSection title="Category" sectionKey="category">
                <div className="filter-options">
                  <label className="filter-radio">
                    <input
                      type="radio"
                      name="category"
                      checked={!activeFilters.category}
                      onChange={() => handleFilterChange('category', '', false)}
                    />
                    <span>All Categories</span>
                  </label>
                  {categories.map(cat => (
                    <label key={cat._id} className="filter-radio">
                      <input
                        type="radio"
                        name="category"
                        checked={activeFilters.category === cat._id}
                        onChange={() => handleFilterChange('category', cat._id, false)}
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Product Type */}
              <FilterSection title="Product Type" sectionKey="productType">
                <div className="filter-options">
                  {filters.productTypes?.map(type => (
                    <label key={type} className="filter-checkbox">
                      <input
                        type="checkbox"
                        checked={activeFilters.productType.includes(type)}
                        onChange={() => handleFilterChange('productType', type)}
                      />
                      <span className="checkmark" />
                      <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Size */}
              <FilterSection title="Size" sectionKey="size">
                <div className="filter-options">
                  {filters.sizes?.map(size => (
                    <label key={size} className="filter-checkbox">
                      <input
                        type="checkbox"
                        checked={activeFilters.size.includes(size)}
                        onChange={() => handleFilterChange('size', size)}
                      />
                      <span className="checkmark" />
                      <span>{getSizeDisplayName(size)}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Paper Type */}
              <FilterSection title="Paper Type" sectionKey="paperType">
                <div className="filter-options">
                  {filters.paperTypes?.map(type => (
                    <label key={type} className="filter-checkbox">
                      <input
                        type="checkbox"
                        checked={activeFilters.paperType.includes(type)}
                        onChange={() => handleFilterChange('paperType', type)}
                      />
                      <span className="checkmark" />
                      <span>{getPaperTypeDisplayName(type)}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Cover Type */}
              <FilterSection title="Cover Type" sectionKey="coverType">
                <div className="filter-options">
                  {filters.coverTypes?.map(type => (
                    <label key={type} className="filter-checkbox">
                      <input
                        type="checkbox"
                        checked={activeFilters.coverType.includes(type)}
                        onChange={() => handleFilterChange('coverType', type)}
                      />
                      <span className="checkmark" />
                      <span>{getCoverTypeDisplayName(type)}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Binding */}
              <FilterSection title="Binding" sectionKey="binding">
                <div className="filter-options">
                  {filters.bindings?.map(binding => (
                    <label key={binding} className="filter-checkbox">
                      <input
                        type="checkbox"
                        checked={activeFilters.binding.includes(binding)}
                        onChange={() => handleFilterChange('binding', binding)}
                      />
                      <span className="checkmark" />
                      <span>{getBindingDisplayName(binding)}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Price Range */}
              <FilterSection title="Price Range" sectionKey="price">
                <div className="filter-price">
                  <div className="filter-price__inputs">
                    <input
                      type="number"
                      placeholder="Min"
                      value={activeFilters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value, false)}
                    />
                    <span>to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={activeFilters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value, false)}
                    />
                  </div>
                </div>
              </FilterSection>
            </div>
          </aside>

          {/* Products Area */}
          <div className="shop-products">
            {/* Toolbar */}
            <div className="shop-toolbar">
              <button 
                className="shop-toolbar__filter-btn"
                onClick={() => setIsFilterOpen(true)}
              >
                <SlidersHorizontal size={18} />
                Filters
                {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}
              </button>

              <div className="shop-toolbar__info">
                Showing {products.length} of {pagination.total} products
              </div>

              <div className="shop-toolbar__actions">
                <select
                  className="shop-toolbar__sort"
                  value={activeFilters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value, false)}
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <div className="shop-toolbar__view">
                  <button
                    className={viewMode === 'grid' ? 'active' : ''}
                    onClick={() => setViewMode('grid')}
                    aria-label="Grid view"
                  >
                    <Grid3X3 size={18} />
                  </button>
                  <button
                    className={viewMode === 'list' ? 'active' : ''}
                    onClick={() => setViewMode('list')}
                    aria-label="List view"
                  >
                    <LayoutList size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Tags */}
            {activeFilterCount > 0 && (
              <div className="active-filters">
                {activeFilters.category && (
                  <span className="active-filter-tag">
                    {categories.find(c => c._id === activeFilters.category)?.name}
                    <button onClick={() => handleFilterChange('category', '', false)}>
                      <X size={14} />
                    </button>
                  </span>
                )}
                {activeFilters.productType.map(type => (
                  <span key={type} className="active-filter-tag">
                    {type}
                    <button onClick={() => handleFilterChange('productType', type)}>
                      <X size={14} />
                    </button>
                  </span>
                ))}
                {activeFilters.size.map(size => (
                  <span key={size} className="active-filter-tag">
                    {getSizeDisplayName(size)}
                    <button onClick={() => handleFilterChange('size', size)}>
                      <X size={14} />
                    </button>
                  </span>
                ))}
                {activeFilters.search && (
                  <span className="active-filter-tag">
                    Search: {activeFilters.search}
                    <button onClick={() => handleFilterChange('search', '', false)}>
                      <X size={14} />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <div className="shop-loading">
                <div className="loading-spinner" />
                <p>Loading products...</p>
              </div>
            ) : products.length > 0 ? (
              <div className={`products-grid ${viewMode === 'grid' ? 'grid grid-3' : 'products-list'}`}>
                {products.map((product, index) => (
                  <ProductCard key={product._id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="shop-empty">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button className="btn btn-primary" onClick={clearAllFilters}>
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="shop-pagination">
                {[...Array(pagination.pages)].map((_, index) => (
                  <button
                    key={index}
                    className={`pagination-btn ${pagination.page === index + 1 ? 'active' : ''}`}
                    onClick={() => dispatch(getProducts({ ...activeFilters, page: index + 1 }))}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Shop;