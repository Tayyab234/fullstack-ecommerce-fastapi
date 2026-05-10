import type { CartProduct } from "../../pages/checkout";
import { useState} from "react";
import axios from "axios";
export function UpdateDelete({item, setCartItems, setCartQuantity, cartQuantity,setUpdateFlag}:{item:CartProduct; setCartItems: React.Dispatch<React.SetStateAction<CartProduct[]>>; setCartQuantity: React.Dispatch<React.SetStateAction<number>>; cartQuantity: number;setUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>}) {
   const [value,setvalue] = useState(0);
   const [isEditing, setIsEditing] = useState(false);
   function updatefunc() {
     setIsEditing((prev) => !prev);       
        if(isEditing){
            const value1=value+cartQuantity;
            setCartQuantity(value1);
            axios.put("/api/cart", {
            productId: item.productId,
            quantity: item.quantity
            });
       }
    }
    function deletefunc() {
        axios.delete(`/api/cart/${item.productId}`);
        setUpdateFlag((prev) => !prev);
        setCartQuantity((prev) => prev - item.quantity);
    }
    
    return (
        <div className="product-quantity">
            <span>
            Quantity:{" "}
            <span className="quantity-label">
                {isEditing ? (
                <input
                type="number"
                value={item.quantity}
                className="inp1"
                onChange={(e) => {
                    const newValue = Number(e.target.value);

                    if (newValue < 1) return;

                    setvalue(newValue-item.quantity);

                    setCartItems((prev) =>
                    prev.map((cartItem) =>
                        cartItem.productId === item.productId
                        ? { ...cartItem, quantity: newValue }
                        : cartItem
                    )
                    );
                }}
                />
                ) : (
                item.quantity
                )}
            </span>
            </span>

            <span
            className="update-quantity-link link-primary"
            onClick={updatefunc}
            >
            {isEditing ? "Save" : "Update"}
            </span>

            <span className="delete-quantity-link link-primary" onClick={()=>deletefunc()}>
            Delete
            </span>
        </div>
    );
}