import './home.css'
import { Header } from '../components/header';
import { useEffect, useState } from "react";
export  function Home() {
    const [products, setProducts] = useState([]);
    useEffect(() => {
      fetch("/api/products")
        .then(res => res.json())
        .then(data => setProducts(data));
    }, []);
   /* useEffect(() => {
        async function getProducts() {

            const response = await fetch(
                "http://127.0.0.1:8000/products-stream"
            );

            const reader = response.body.getReader();

            const decoder = new TextDecoder();

            let buffer = "";

            while (true) {

                const { done, value } = await reader.read();

                if (done) break;

                buffer += decoder.decode(value);

                const lines = buffer.split("\n");

                buffer = lines.pop();

                for (const line of lines) {

                    if (line.trim()) {

                        const product = JSON.parse(line);

                       setProducts(prev => {
                          const exists = prev.some(p => p._id === product._id);
                          if (exists) return prev;
                          return [...prev, product];
                        });
                    }
                }
            }
        }

        getProducts();

    }, []);*/

                        
    return(
  <>
    <Header />
    <div className="home-page">
        <div className="products-grid">
          {

            products.map((product) => (
            <div className="product-container" key={product.id}>
                 <div className="product-image-container">
                     <img className="product-image" src={`../../public/${product.image}`} />
                 </div>

                 <div className="product-name limit-text-to-2-lines">
                      {product.name}
                 </div>
                 <div className="product-rating-container">
                   <img className="product-rating-stars"
                     src={`../../public/images/ratings/rating-${product.rating.stars * 10}.png`} />
                   <div className="product-rating-count link-primary">
                     {product.rating.count}
                   </div>
                 </div>
                 <div className="product-price">
                   ${(product.priceCents/100).toFixed(2)}
                 </div>
                 <div className="product-quantity-container">
                   <select>
                     <option value="1">1</option>
                     <option value="2">2</option>
                     <option value="3">3</option>
                     <option value="4">4</option>
                     <option value="5">5</option>
                     <option value="6">6</option>
                     <option value="7">7</option>
                     <option value="8">8</option>
                     <option value="9">9</option>
                     <option value="10">10</option>
                   </select>
                 </div>
                 <div className="product-spacer"></div>
                 <div className="added-to-cart">
                   <img src="images/icons/checkmark.png" />
                   Added
                 </div>
                 <button className="add-to-cart-button button-primary">
                   Add to Cart
                 </button>
            </div>
          ))
          }

        </div>
    </div>
</>
    );
}