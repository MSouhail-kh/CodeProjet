import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./Authentification/AuthContext";
import PrivateRoute from "./Authentification/PrivateRoute";
import LoginSignup from "./Authentification/LoginSignup";
import Chaines from "./Chaines/Chaines";
import ProduitDetails from "./Produits/ProduitDetails";
import EnhancedSwiper from "./Swiper/Swiper";
import Refresh from "./Refresh"; // Importer le composant Refresh
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <SaveLastPage /> {/* Garde en mémoire la dernière page */}
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
                                        <EnhancedSwiper />
                                    </>
                                }
                            />
                        }
                    />
                    <Route path="/refresh" element={<Refresh />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

// Composant qui sauvegarde la dernière page visitée
const SaveLastPage = () => {
    const location = useLocation();
    useEffect(() => {
        sessionStorage.setItem("lastPage", location.pathname);
    }, [location]);
    return null;
};

export default App;
