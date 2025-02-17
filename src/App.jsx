import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chaines from "./Chaines";
import ProduitDetails from './ProduitDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Chaines />} />
        <Route path="/produit/:id" element={<ProduitDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
