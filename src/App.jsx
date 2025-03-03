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
                    <Route path="/Chaines" element={<PrivateRoute element={<Chaines />} />} />
                    <Route
                        path="/produit/:id"
                        element={
                            <PrivateRoute
                                element={
                                    <>
                                        <ProduitDetails />
                                        <MySwiper />
                                    </>
                                }
                            />
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
