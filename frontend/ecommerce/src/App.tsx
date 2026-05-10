import {Routes, Route} from 'react-router'
import {Home} from './pages/home'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Order } from './pages/order';
import { Checkout } from './pages/checkout';
import { Track } from './pages/track';
import './App.css'

function App() {
  const [addedProduct, setAddedProduct] = useState<string | null>(null);
  const [cartQuantity, setCartQuantity] = useState(0);
    useEffect(() => {
      axios.get("/api/cart/count")
        .then(response=>{
          return  response.data;
        }).then(data=>{
          setCartQuantity(data.count);
        });
    },[addedProduct,cartQuantity]);

  return (
    <Routes>
      <Route path='/' element={<Home addedProduct={addedProduct} setAddedProduct={setAddedProduct} cartQuantity={cartQuantity} />} />
      <Route path='/checkout' element={<Checkout cartQuantity={cartQuantity} setCartQuantity={setCartQuantity} />} />
      <Route path='/order' element={<Order cartQuantity={cartQuantity} />} />
      <Route path='/track' element={<Track/>} />
    </Routes>

  );

}

export default App
