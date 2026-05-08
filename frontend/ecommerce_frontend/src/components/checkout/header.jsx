import "./header.css";
import mobilelogoimg from '../../assets/images/mobile-logo.png'
import serachicon from '../../assets/images/icons/checkout-lock-icon.png'
import carticon from '../../assets/images/logo.png'
import { Link } from "react-router";
export function CheckoutHeader() {
      return (
    <div class="checkout-header">
     <div class="header-content">
       <div class="checkout-header-left-section">
         <Link to="/">
           <img class="logo" src={carticon} />
           <img class="mobile-logo" src={mobilelogoimg} />
         </Link>
       </div>
       <div class="checkout-header-middle-section">
         Checkout (<Link class="return-to-home-link"
           to="/">3 items</Link>)
       </div>
       <div class="checkout-header-right-section">
         <img src={serachicon} />
       </div>
     </div>
    </div>
    );
}