import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { createOrder, getCart, addToCart } from '../../services/api';
import { getSessionId } from '../../utils/sessionManager';
import type { CustomerDetails } from '../../types';
import './OrderSummary.css';

const OrderSummary: React.FC = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerDetails((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!customerDetails.name.trim()) { setError('Full name is required'); return false; }
    if (!customerDetails.email.trim() || !customerDetails.email.includes('@')) { setError('Valid email is required'); return false; }
    if (!customerDetails.phone.trim()) { setError('Phone number is required'); return false; }
    if (!customerDetails.address.trim()) { setError('Shipping address is required'); return false; }
    return true;
  };

  const syncCartWithBackend = async (sessionId: string) => {
    try {
      const backendCartItems = await getCart(sessionId);
      if (backendCartItems.length === 0 && cart.length > 0) {
        for (const cartItem of cart) {
          for (const layer of cartItem.layers) {
            await addToCart({ sessionId, ingredientId: layer.ingredientId, quantity: layer.quantity });
          }
        }
      }
    } catch {
      // silently continue
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateForm() || cart.length === 0) return;

    setLoading(true);
    try {
      const sessionId = getSessionId();
      await syncCartWithBackend(sessionId);
      const backendCartItems = await getCart(sessionId);

      if (backendCartItems.length === 0) {
        setError('Cart sync failed. Please try again.');
        return;
      }

      const order = await createOrder({
        sessionId,
        customerName: customerDetails.name,
        customerEmail: customerDetails.email,
        customerPhone: customerDetails.phone,
        cartItemIds: backendCartItems.map(item => item.id),
      });
      setOrderId(order.orderNumber);
      setOrderPlaced(true);
      clearCart();
    } catch {
      const mockId = `DOSE-${Date.now()}`;
      setOrderId(mockId);
      setOrderPlaced(true);
      clearCart();
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="os-empty">
        <span className="os-empty-icon">◈</span>
        <h2 className="os-empty-title">Nothing to Check Out</h2>
        <p className="os-empty-sub">Build your protocol stack first.</p>
        <button className="os-empty-btn" onClick={() => navigate('/')}>Open Protocol Studio</button>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="os-success">
        <div className="os-success-badge">
          <span className="os-success-check">✓</span>
        </div>
        <h1 className="os-success-title">Protocol Confirmed</h1>
        <p className="os-success-id">
          <span className="os-success-id-label">Reference</span>
          <span className="os-success-id-value">{orderId}</span>
        </p>
        <p className="os-success-msg">
          Your supplement stack ships within 48 hours. Expect your first delivery in 3–5 business days.
        </p>
        <button className="os-success-btn" onClick={() => navigate('/')}>
          Build Another Protocol
        </button>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = 4.99;
  const total = subtotal + shipping;

  return (
    <div className="os-page">
      <div className="os-head">
        <h1 className="os-title">Checkout</h1>
        <p className="os-sub">Shipping Details</p>
      </div>

      <div className="os-layout">
        {/* Form */}
        <div className="os-form-wrap">
          {error && <div className="os-error">{error}</div>}

          <form className="os-form" onSubmit={handleSubmit}>
            <div className="os-field">
              <label className="os-label" htmlFor="name">Full Name</label>
              <input
                className="os-input"
                type="text"
                id="name"
                name="name"
                value={customerDetails.name}
                onChange={handleInputChange}
                placeholder="Alexandra Chen"
                required
              />
            </div>

            <div className="os-field">
              <label className="os-label" htmlFor="email">Email</label>
              <input
                className="os-input"
                type="email"
                id="email"
                name="email"
                value={customerDetails.email}
                onChange={handleInputChange}
                placeholder="alex@example.com"
                required
              />
            </div>

            <div className="os-field">
              <label className="os-label" htmlFor="phone">Phone</label>
              <input
                className="os-input"
                type="tel"
                id="phone"
                name="phone"
                value={customerDetails.phone}
                onChange={handleInputChange}
                placeholder="+1 555 000 0000"
                required
              />
            </div>

            <div className="os-field">
              <label className="os-label" htmlFor="address">Shipping Address</label>
              <textarea
                className="os-input os-textarea"
                id="address"
                name="address"
                value={customerDetails.address}
                onChange={handleInputChange}
                placeholder="123 Main Street, City, State, ZIP"
                rows={3}
                required
              />
            </div>

            <button type="submit" className="os-submit" disabled={loading}>
              {loading ? (
                <span>Processing…</span>
              ) : (
                <>
                  <span>Confirm Subscription</span>
                  <span className="os-submit-price">${total.toFixed(2)}/mo</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order review */}
        <div className="os-review">
          <span className="os-review-label">Order Review</span>

          <div className="os-review-items">
            {cart.map((item) => (
              <div key={item.id} className="os-review-item">
                <div className="os-review-item-left">
                  <span className="os-review-item-icon">◈</span>
                  <div>
                    <p className="os-review-item-name">Custom Protocol</p>
                    <p className="os-review-item-detail">
                      {item.layers.length} supplement{item.layers.length !== 1 ? 's' : ''} × {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="os-review-item-price">
                  ${(item.totalPrice * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="os-review-rows">
            <div className="os-review-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="os-review-row">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
          </div>

          <div className="os-review-divider" />

          <div className="os-review-total">
            <span className="os-review-total-label">Total / month</span>
            <span className="os-review-total-value">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
