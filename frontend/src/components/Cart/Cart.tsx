import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartItemCard from './CartItemCard';
import './Cart.css';

const Cart: React.FC = () => {
  const { cart, removeItemFromCart, updateItemQuantity, clearCart, getTotalPrice } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <span className="cart-empty-icon">◈</span>
        <h2 className="cart-empty-title">No Active Protocols</h2>
        <p className="cart-empty-sub">Build your personalized supplement stack to get started.</p>
        <button className="cart-empty-btn" onClick={() => navigate('/')}>
          Open Protocol Studio
        </button>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = 4.99;
  const total = subtotal + shipping;

  return (
    <div className="cart-page">
      <div className="cart-head">
        <div>
          <h1 className="cart-title">My Stack</h1>
          <p className="cart-sub">{cart.length} protocol{cart.length !== 1 ? 's' : ''} queued for dispatch</p>
        </div>
        <button className="cart-reset-btn" onClick={clearCart}>
          Clear All
        </button>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              onUpdateQuantity={updateItemQuantity}
              onRemove={removeItemFromCart}
            />
          ))}
        </div>

        <div className="cart-sidebar">
          <div className="cart-summary">
            <span className="cart-summary-label">Order Summary</span>

            <div className="cart-summary-rows">
              <div className="cart-summary-row">
                <span>Protocols</span>
                <span>{cart.length}</span>
              </div>
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="cart-summary-row">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
            </div>

            <div className="cart-summary-divider" />

            <div className="cart-summary-total">
              <span className="cart-summary-total-label">Total / month</span>
              <span className="cart-summary-total-value">${total.toFixed(2)}</span>
            </div>

            <button
              className="cart-checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              <span>Proceed to Checkout</span>
              <span className="cart-checkout-arrow">→</span>
            </button>

            <button
              className="cart-continue-btn"
              onClick={() => navigate('/')}
            >
              Add More Supplements
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
