import "./header.css";
import mobilelogoimg from '../../assets/images/mobile-logo.png'
import serachicon from '../../assets/images/icons/checkout-lock-icon.png'
import carticon from '../../assets/images/logo.png'
import { Link } from "react-router";
export function CheckoutHeader({cartQuantity}: {cartQuantity: number}) {
      return (
    <div className="checkout-header">
     <div className="header-content">
       <div className="checkout-header-left-section">
         <Link to="/">
           <img className="logo" src={carticon} />
           <img className="mobile-logo" src={mobilelogoimg} />
         </Link>
       </div>
       <div className="checkout-header-middle-section">
         Checkout (<Link className="return-to-home-link"
           to="/"> {cartQuantity} items</Link>)
       </div>
       <div className="checkout-header-right-section">
         <img src={serachicon} />
       </div>
     </div>
    </div>
    );
}