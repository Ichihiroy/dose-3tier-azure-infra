import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Header.css';

export default function Header() {
  const { getTotalItems } = useCart();
  const { pathname } = useLocation();
  const totalItems = getTotalItems();

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          <span className="logo-mark">DOSE</span>
          <span className="logo-sub">Protocol Studio</span>
        </Link>

        <nav className="header-nav">
          <Link to="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
            Build
          </Link>
          <Link to="/orders" className={`nav-link ${pathname === '/orders' ? 'active' : ''}`}>
            Shipments
          </Link>
        </nav>

        <Link to="/cart" className="header-cart">
          <span className="cart-icon">◈</span>
          <span className="cart-label">My Stack</span>
          {totalItems > 0 && (
            <span className="cart-badge">{totalItems}</span>
          )}
        </Link>
      </div>
    </header>
  );
}
