import logoimg from '../assets/images/logo-white.png'
import mobilelogoimg from '../assets/images/mobile-logo-white.png'
import serachicon from '../assets/images/icons/search-icon.png'
import carticon from '../assets/images/icons/cart-icon.png'
import { Link } from "react-router";
export function Header({cartQuantity}: {cartQuantity: number}) {
    
    return (
    <div className="header">
        <div className="left-section">
          <Link to="/" className="header-link">
            <img className="logo"
              src={logoimg} />
            <img className="mobile-logo"
              src={mobilelogoimg} />
          </Link>
        </div>
        <div className="middle-section">
          <input className="search-bar" type="text" placeholder="Search" />
          <button className="search-button">
            <img className="search-icon" src={serachicon} />
          </button>
        </div>
        <div className="right-section">
          <Link className="orders-link header-link" to="/order">
            <span className="orders-text">Orders</span>
          </Link>
          <Link className="cart-link header-link" to="/checkout">
            <img className="cart-icon" src={carticon} />
            <div className="cart-quantity">{cartQuantity}</div>
            <div className="cart-text">Cart</div>
          </Link>
        </div>
    </div>
    );
}