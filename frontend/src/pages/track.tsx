import "./track.css"
import type { OrderProduct } from "./order";
import { useLocation } from "react-router-dom";
import { Header } from "../components/header";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Link } from "react-router";

dayjs.extend(customParseFormat);
export function Track({cartQuantity}: {cartQuantity: number}) {
  const location = useLocation();
  const trackingInfo = location.state?.product as OrderProduct | undefined;
  const date = location.state?.date ;
  const isPreparing = dayjs().isBefore(dayjs(date,'MMMM D').add(1, "day"));
  const isDelivered = dayjs().isAfter(
    dayjs(trackingInfo?.productDelivery, "MMMM D")
  );
  return(
     <>
        <Header cartQuantity={cartQuantity}/>

        <div className="tracking-page">
            <div className="order-tracking">
              <Link className="back-to-orders-link link-primary" to="/order">
                View all orders
              </Link>
              <div className="delivery-date">
                {dayjs().isAfter(dayjs(trackingInfo?.productDelivery, "MMMM D")) ? (
                 <div> delivered on {dayjs(trackingInfo?.productDelivery, "MMMM D").format('dddd')}, {trackingInfo ? trackingInfo.productDelivery : "Loading..."}</div>
                ) : (
                  <div>Arriving on {dayjs(trackingInfo?.productDelivery, "MMMM D").format('dddd')}, {trackingInfo ? trackingInfo.productDelivery : "Loading..."}</div>
                )}
                
              </div>
              <div className="product-info">
                {trackingInfo?.productName}
              </div>
              <div className="product-info">
                Quantity: {trackingInfo?.productQuantity}
              </div>
              <img className="product-image" src={`../../public/${trackingInfo?.productImage}`} />
              <div className="progress-labels-container">
                <div className="progress-label">
                  Preparing
                </div>
                <div className="progress-label current-status">
                  Shipped
                </div>
                <div className="progress-label">
                  Delivered
                </div>
              </div>
              <div className="progress-bar-container">
                {isPreparing ? (
                  <div className="progress-bar-prepare"></div>
                ) : isDelivered ? (
                  <div className="progress-bar-completed"></div>
                ) : (
                  <div className="progress-bar"></div>
                )}
              </div>
            </div>
        </div>

    </>
    );
}