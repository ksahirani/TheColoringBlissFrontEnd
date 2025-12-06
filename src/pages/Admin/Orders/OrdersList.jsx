import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Eye, ChevronLeft, ChevronRight, ShoppingCart, Filter } from 'lucide-react';
import api from '../../../utils/api';
import { formatPrice, formatDate } from '../../../utils/helpers';
import './Orders.css';

const OrdersList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');

  const currentPage = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    fetchOrders();
  }, [searchParams]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('limit', 15);
      
      const search = searchParams.get('search');
      if (search) params.append('search', search);
      
      const status = searchParams.get('status');
      if (status) params.append('status', status);

      const response = await api.get(`/orders/admin?${params.toString()}`);
      setOrders(response.data.data.orders);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleStatusFilter = (status) => {
    const params = new URLSearchParams(searchParams);
    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    params.set('page', '1');
    setStatusFilter(status);
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  const statuses = [
    { value: '', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="orders-page">
      <div className="admin-page-header">
        <div>
          <h1>Orders</h1>
          <p>Manage customer orders</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="admin-toolbar">
        <form className="admin-search" onSubmit={handleSearch}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by order number or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        <div className="admin-filters">
          <select 
            className="status-filter"
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
          >
            {statuses.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-card">
        {loading ? (
          <div className="admin-loading">
            <div className="loading-spinner" />
          </div>
        ) : orders.length > 0 ? (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>
                      <span className="order-number">{order.orderNumber}</span>
                    </td>
                    <td>
                      <span className="order-date">{formatDate(order.createdAt)}</span>
                    </td>
                    <td>
                      <div className="customer-info">
                        <span className="customer-name">
                          {order.user?.firstName} {order.user?.lastName}
                        </span>
                        <span className="customer-email">{order.user?.email}</span>
                      </div>
                    </td>
                    <td>{order.items?.length || 0} items</td>
                    <td>
                      <span className="order-total">{formatPrice(order.total)}</span>
                    </td>
                    <td>
                      <span className={`payment-badge ${order.isPaid ? 'paid' : 'unpaid'}`}>
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-badge--${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/admin/orders/${order._id}`} className="admin-btn admin-btn--icon" title="View">
                        <Eye size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="admin-pagination">
                <button
                  className="admin-pagination__btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={18} />
                </button>
                
                {[...Array(Math.min(pagination.pages, 5))].map((_, i) => {
                  let pageNum;
                  if (pagination.pages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= pagination.pages - 2) {
                    pageNum = pagination.pages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      className={`admin-pagination__btn ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  className="admin-pagination__btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="admin-empty">
            <ShoppingCart size={48} />
            <h3>No orders found</h3>
            <p>Orders will appear here once customers start purchasing.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersList;