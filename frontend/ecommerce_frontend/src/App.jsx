import {Routes, Route} from 'react-router'
import {Home} from './pages/home'
import { Order } from './pages/order';
import { Checkout } from './pages/checkout';
import { Track } from './pages/track';
import './App.css'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/checkout' element={<Checkout/>} />
      <Route path='/order' element={<Order/>} />
      <Route path='/track' element={<Track/>} />
    </Routes>

  );

}

export default App
