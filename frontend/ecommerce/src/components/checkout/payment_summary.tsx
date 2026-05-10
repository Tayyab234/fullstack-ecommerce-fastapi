import type { BillingInfo } from "../../pages/checkout";

export function PaymentSummary({cartPrice}:{cartPrice: BillingInfo}) {
   
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
            <button className="place-order-button button-primary">
              Place your order
            </button>
        </div>
    );

}