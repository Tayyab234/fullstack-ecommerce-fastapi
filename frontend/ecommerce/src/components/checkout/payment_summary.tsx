import type { BillingInfo } from "../../pages/checkout";
import type { CartProduct } from "../../pages/checkout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
export function PaymentSummary({cartPrice, setCartQuantity, cartItems, setCartItems, setUpdateFlag}:{cartPrice: BillingInfo, setCartQuantity: React.Dispatch<React.SetStateAction<number>>, cartItems: CartProduct[], setCartItems: React.Dispatch<React.SetStateAction<CartProduct[]>>, setUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>}) {
   const navigate = useNavigate();
   async function handlePlaceOrder() {
      const response=await axios.post("/api/placeorder", {
        date: dayjs().format("MMMM DD"),
        totalPriceCents: cartPrice.total*100,
        products: cartItems.map(item => ({
          productId: item.productId,
          productImage: item.image,
          productName: item.productName,
          productPriceCents: item.productPriceCents,
          productDelivery: item.option === 1 ? dayjs().add(10, 'day').format('MMMM D') : item.option === 2 ? dayjs().add(5, 'day').format('MMMM D') : dayjs().add(2, 'day').format('MMMM D'),
          productQuantity: Number(item.quantity) 
        }))
      });
      console.log(response);
      setCartQuantity(0);
      setCartItems([]);
      setUpdateFlag((prev) => !prev);
      navigate("/order");

    }
    return(
        <div className="payment-summary">
            <div className="payment-summary-title">Payment Summary</div>
            <div className="payment-summary-row">
              <div>Items ({cartPrice?.items}):</div>
              <div className="payment-summary-money">${cartPrice?.itemsTotal.toFixed(2)}</div>
            </div>
            <div className="payment-summary-row">
              <div>Shipping &amp; handling:</div>
              <div className="payment-summary-money">${cartPrice?.shipping.toFixed(2)}</div>
            </div>
            <div className="payment-summary-row subtotal-row">
              <div>Total before tax:</div>
              <div className="payment-summary-money">${cartPrice?.subtotal.toFixed(2)}</div>
            </div>
            <div className="payment-summary-row">
              <div>Estimated tax (10%):</div>
              <div className="payment-summary-money">${cartPrice?.tax.toFixed(2)}</div>
            </div>
            <div className="payment-summary-row total-row">
              <div>Order total:</div>
              <div className="payment-summary-money">${cartPrice?.total.toFixed(2)}</div>
            </div>
            <button className="place-order-button button-primary" onClick={()=>handlePlaceOrder()}>
              Place your order
            </button>
        </div>
    );

}