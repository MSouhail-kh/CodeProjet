import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; 
import Chaines from "./Chaines";
import ProduitDetails from './ProduitDetails';
import EnhancedSwiper from './Swiper';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Chaines />} />
        <Route path="/produit/:id" element={
          <>
          <ProduitDetails/>
          <EnhancedSwiper />
          </>
           
          } />
        
      </Routes>
    </Router>
  );
}

export default App;
