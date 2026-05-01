import React from 'react';
import type { CartItem } from '../../types';
import './CartItemCard.css';

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onRemove: (itemId: number) => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="cic-root">
      <div className="cic-left">
        <div className="cic-index">
          <span className="cic-stack-icon">◈</span>
        </div>
        <div className="cic-info">
          <span className="cic-label">Custom Protocol</span>
          <span className="cic-count">{item.layers.length} supplement{item.layers.length !== 1 ? 's' : ''}</span>
          <span className="cic-price">${item.totalPrice.toFixed(2)} / serving</span>
        </div>
      </div>

      <div className="cic-right">
        <div className="cic-qty">
          <button
            className="cic-qty-btn"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            aria-label="Decrease"
          >
            −
          </button>
          <span className="cic-qty-val">{item.quantity}</span>
          <button
            className="cic-qty-btn"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            aria-label="Increase"
          >
            +
          </button>
        </div>

        <span className="cic-total">${(item.totalPrice * item.quantity).toFixed(2)}</span>

        <button
          className="cic-remove"
          onClick={() => onRemove(item.id)}
          aria-label="Remove"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default CartItemCard;
