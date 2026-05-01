import React, { useState, useEffect } from 'react';
import { getOrderHistory, getOrdersByCustomerEmail } from '../../services/api';
import type { Order } from '../../types';
import './OrderHistory.css';

const STATUS_META: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Pending',   color: 'var(--accent-gold)' },
  confirmed: { label: 'Confirmed', color: 'var(--accent-cyan)' },
  preparing: { label: 'Preparing', color: '#F59E0B' },
  ready:     { label: 'Ready',     color: '#10B981' },
  delivered: { label: 'Delivered', color: '#8B5CF6' },
  cancelled: { label: 'Cancelled', color: 'rgba(239,68,68,0.8)' },
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterEmail, setFilterEmail] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async (email?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = email?.trim()
        ? await getOrdersByCustomerEmail(email.trim())
        : await getOrderHistory();
      setOrders(data);
    } catch {
      setError('Failed to load shipments.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e: React.FormEvent) => { e.preventDefault(); load(filterEmail); };

  const clearFilter = () => { setFilterEmail(''); setShowFilter(false); load(); };

  if (loading) {
    return (
      <div className="oh-loading">
        <span className="oh-dot" /><span className="oh-dot" /><span className="oh-dot" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="oh-error">
        <p>{error}</p>
        <button className="oh-retry" onClick={() => load()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="oh-page">
      <div className="oh-head">
        <div>
          <h1 className="oh-title">My Shipments</h1>
          <p className="oh-sub">{orders.length} protocol{orders.length !== 1 ? 's' : ''} on record</p>
        </div>
        <div className="oh-head-actions">
          <button className="oh-filter-toggle" onClick={() => setShowFilter(v => !v)}>
            {showFilter ? 'Hide Filter' : 'Filter by Email'}
          </button>
          <button className="oh-refresh" onClick={() => load(filterEmail)}>Refresh</button>
        </div>
      </div>

      {showFilter && (
        <form className="oh-filter-form" onSubmit={handleFilter}>
          <input
            className="oh-filter-input"
            type="email"
            placeholder="customer@example.com"
            value={filterEmail}
            onChange={e => setFilterEmail(e.target.value)}
          />
          <button type="submit" className="oh-filter-submit">Search</button>
          <button type="button" className="oh-filter-clear" onClick={clearFilter}>Clear</button>
        </form>
      )}

      {orders.length === 0 ? (
        <div className="oh-empty">
          <span className="oh-empty-icon">◈</span>
          <h2 className="oh-empty-title">No Shipments Found</h2>
          <p className="oh-empty-sub">
            {filterEmail ? `No orders for ${filterEmail}` : 'No protocols have shipped yet.'}
          </p>
          {filterEmail && (
            <button className="oh-clear-btn" onClick={clearFilter}>Show All</button>
          )}
        </div>
      ) : (
        <div className="oh-list">
          {orders.map((order) => {
            const meta = STATUS_META[order.status.toLowerCase()] ?? { label: order.status, color: 'var(--text-muted)' };
            return (
              <div key={order.id} className="oh-card">
                <div className="oh-card-top">
                  <div className="oh-card-id">
                    <span className="oh-card-num">{order.orderNumber}</span>
                    <span className="oh-card-date">{formatDate(order.createdAt)}</span>
                  </div>
                  <span
                    className="oh-status"
                    style={{ '--status-color': meta.color } as React.CSSProperties}
                  >
                    {meta.label}
                  </span>
                </div>

                <div className="oh-card-body">
                  <div className="oh-customer">
                    <span className="oh-customer-name">{order.customerName}</span>
                    <span className="oh-customer-email">{order.customerEmail}</span>
                  </div>
                  <div className="oh-amount">
                    <span className="oh-amount-label">Total</span>
                    <span className="oh-amount-value">${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {order.orderItems && order.orderItems.length > 0 && (
                  <div className="oh-card-footer">
                    <span className="oh-items-count">
                      {order.orderItems.length} supplement{order.orderItems.length !== 1 ? 's' : ''}
                    </span>
                    {order.updatedAt && order.updatedAt !== order.createdAt && (
                      <span className="oh-updated">Updated {formatDate(order.updatedAt)}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
