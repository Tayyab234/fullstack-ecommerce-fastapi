import "./checkout.css";
import { CheckoutHeader } from "../components/checkout/header";
import { PaymentSummary } from "../components/checkout/payment_summary";
import { UpdateDelete } from "../components/checkout/update_delete";
import dayjs from "dayjs";
import { useEffect,useState} from "react";
import axios from "axios";
export interface CartProduct {
  image:string;
  option:number;
  productName: string;
  productId: string;
  productPriceCents: number;
  quantity:number;
}
export interface BillingInfo {
  items:number;
  itemsTotal:number;
  shipping: number;
  subtotal:number;
  tax: number;
  total:number;
}

export function Checkout({ cartQuantity, setCartQuantity }: { cartQuantity: number; setCartQuantity: React.Dispatch<React.SetStateAction<number>> }) {
  const [cartItems, setCartItems] = useState<CartProduct[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: string }>({});
  const [cartPrice, setCartPrice] = useState<BillingInfo>();
  const [updateFlag, setUpdateFlag] = useState(false);
  useEffect(() => {
    
     async function fetchCartPrice() {
          const response=await axios.get("/api/cart");
          const data=await response.data;
          setCartPrice(data);
     }
    fetchCartPrice(); 
  },[cartItems,quantities,cartQuantity]);
  useEffect(() => {
     async function fetchCartItems() {
        const response = await axios.get("/api/cart/items");
        const data = response.data;
        setCartItems(data);
     }
      fetchCartItems();
  },[updateFlag]);
  const handleDeliveryOption = (
  productId: string,
  option: number
  ) => {
    setCartItems((prev) =>
      prev.map((item) =>{
        if(item.productId === productId){
           setQuantities((prev) => ({
            ...prev,
            [productId]: dayjs().add(option === 1 ? 10 : option === 2 ? 5 : 2, "day").format("dddd, MMMM D")
          }));
          axios.put("/api/cart", {
            productId,  
            option
          });
           return { ...item, option }
        }else
          return item;
      }
      )
    );
  };
  return (
    <>
      <CheckoutHeader cartQuantity={cartQuantity} />
      <div className="checkout-page">
        <div className="page-title">Review your order</div>
        <div className="checkout-grid">
          <div className="order-summary">
            {cartItems.length && cartItems.map((item,index) => {

                return(
                <div className="cart-item-container" key={item.productId}>
                  <div className="delivery-date">
                    Delivery date: {quantities[item.productId] || dayjs().add(item.option === 1 ? 10 : item.option === 2 ? 5 : 2, "day").format("dddd, MMMM D")}
                  </div>
                  <div className="cart-item-details-grid">
                    <img
                      className="product-image"
                      src={`../../public/${item.image}`}
                    />
                    <div className="cart-item-details">
                      <div className="product-name">
                        {item.productName}
                      </div>
                      <div className="product-price">${(item.productPriceCents / 100).toFixed(2)}</div>
                      <UpdateDelete item={item} setCartItems={setCartItems} setCartQuantity={setCartQuantity} cartQuantity={cartQuantity} setUpdateFlag={setUpdateFlag} />
                    </div>
                    <div className="delivery-options">
                      <div className="delivery-options-title">
                        Choose a delivery option:
                      </div>
                      <div className="delivery-option">
                        <input
                          type="radio"
                          checked={item.option === 1}
                          onChange={() =>
                            handleDeliveryOption(item.productId, 1)
                          }
                          className="delivery-option-input"
                          name={`delivery-option-${index}`}
                        />
                        <div>
                          <div className="delivery-option-date">
                            {dayjs().add(10, "day").format("dddd, MMMM D")}
                          </div>
                          <div className="delivery-option-price">FREE Shipping</div>
                        </div>
                      </div>
                      <div className="delivery-option">
                        <input
                          type="radio"
                          checked={item.option === 2}
                          onChange={() =>
                            handleDeliveryOption(item.productId, 2)
                          }
                          className="delivery-option-input"
                          name={`delivery-option-${index}`}
                        />
                        <div>
                          <div className="delivery-option-date">
                            {dayjs().add(5, "day").format("dddd, MMMM D")}
                          </div>
                          <div className="delivery-option-price">
                            $4.99 - Shipping
                          </div>
                        </div>
                      </div>
                      <div className="delivery-option">
                        <input
                          type="radio"
                          checked={item.option === 3}
                          onChange={() =>
                            handleDeliveryOption(item.productId, 3)
                          }
                          className="delivery-option-input"
                          name={`delivery-option-${index}`}
                        />
                        <div>
                          <div className="delivery-option-date">
                            {dayjs().add(2, "day").format("dddd, MMMM D")}
                          </div>
                          <div className="delivery-option-price">
                            $9.99 - Shipping
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>);
              })
            }
          </div>
          
          {cartPrice && <PaymentSummary cartPrice={cartPrice}  setCartQuantity={setCartQuantity} cartItems={cartItems} setCartItems={setCartItems} setUpdateFlag={setUpdateFlag}/>}

        </div>
      </div>
    </>
  );
}
