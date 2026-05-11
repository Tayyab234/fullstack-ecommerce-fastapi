import "./order.css";
import {Header} from "../components/header";
import { Link } from "react-router";
import {useState,useEffect } from "react";
import img4 from "../assets/images/icons/buy-again.png";
import axios from "axios";
export interface OrderProduct {
  productId: string;
  productImage: string;
  productName: string;
  productPriceCents: number;
  productDelivery: string;
  productQuantity: number;
}
export interface Order {
  id: string;
  date: string;
  totalPriceCents: number;
  products: OrderProduct[];
}
export  function Order({cartQuantity, setCartQuantity,}: {cartQuantity: number; setCartQuantity: (quantity: number) => void}) {
    function Added(product: OrderProduct) {
      axios.post("/api/cart", {
        productId: product.productId,
        quantity: product.productQuantity,
        productName: product.productName,
        productPriceCents: product.productPriceCents,
        image: product.productImage,
        option: 1
      });
      setCartQuantity(cartQuantity + 1);
    }
    const [orders, setOrders] = useState<Order[]>([]);
    useEffect(() => {
      async function fetchOrders() {
        const response = await axios.get("/api/orders");
        const ordersData =await  response.data;
        setOrders(ordersData.orders);
      }
      fetchOrders(); 
    }, []);

    //Sconst response = await axios.get("/api/orders");

    return(
     <>

        
        <Header cartQuantity={cartQuantity} />
        <div className="orders-page">
          <div className="page-title">Your Orders</div>
          <div className="orders-grid">
            {orders.length && orders.map((order) => (
              <div className="order-container" key={order.id}>
                <div className="order-header">
                  <div className="order-header-left-section">
                    <div className="order-date">
                      <div className="order-header-label">Order Placed:</div>
                      <div>{order.date}</div>
                    </div>
                    <div className="order-total">
                      <div className="order-header-label">Total:</div>
                      <div>${(order.totalPriceCents / 100).toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="order-header-right-section">
                    <div className="order-header-label">Order ID:</div>
                    <div>{order.id}</div>
                  </div>
                </div>
                {order.products.length && order.products.map((product) => (
                  <div className="order-details-grid" key={product.productId}>
                    <div className="product-image-container">
                      <img src={`../../public/${product.productImage}`} />
                    </div>
                    <div className="product-details">
                      <div className="product-name">
                        {product.productName}
                      </div>
                      <div className="product-delivery-date">
                        Arriving on: {product.productDelivery}
                      </div>
                      <div className="product-quantity">
                        Quantity: {product.productQuantity}
                      </div>
                      <button className="buy-again-button button-primary">
                        <img className="buy-again-icon" src={img4} />
                        <span className="buy-again-message" onClick={()=>Added(product)}>Add to Cart</span>
                      </button>
                    </div>
                    <div className="product-actions">
                      
                      <Link to="/track" state={{ product, date: order.date }}>
                        <button className="track-package-button button-secondary">
                          Track package
                        </button>
                      </Link>
                    </div>
                  </div>
              ))}
              </div>))}

           </div>
      </div>
    </>
  );
}