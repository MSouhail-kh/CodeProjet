import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Authentification/AuthContext";
import PrivateRoute from "./Authentification/PrivateRoute";
import LoginSignup from "./Authentification/LoginSignup";
import Chaines from "./Chaines/Chaines";
import ProduitDetails from "./Produits/ProduitDetails";
import MySwiper from "./Swiper/Swiper";
import Loader from "./Loader";
import "./App.css";
function ProduitPageWrapper() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    console.log("Loading:", loading);
    console.log("Error:", error);
  
    return (
      <>
        {loading && <Loader />}
        {!loading && error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}
        {!loading && !error && (
          <>
            <ProduitDetails setLoading={setLoading} setError={setError} />
            <MySwiper setLoading={setLoading} setError={setError} />
          </>
        )}
      </>
    );
  }

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route
            path="/Chaines"
            element={<PrivateRoute element={<Chaines />} />}
          />
          <Route
            path="/produit/:po"
            element={<PrivateRoute element={<ProduitPageWrapper />} />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;