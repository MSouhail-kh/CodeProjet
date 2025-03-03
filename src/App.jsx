import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Authentification/AuthContext";
import PrivateRoute from "./Authentification/PrivateRoute";
import LoginSignup from "./Authentification/LoginSignup";
import Chaines from "./Chaines/Chaines";
import ProduitDetails from "./Produits/ProduitDetails";
import MySwiper from "./Swiper/Swiper";
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route 
            path="/chaines" 
            element={
              <PrivateRoute>
                <Chaines />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/produit/:id" 
            element={
              <PrivateRoute>
                <ProduitDetails />
                <MySwiper />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
