import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import Login from "./Login/Login";
import Register from "./Register/Register";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";

const LoginSignup = () => {
    const [isSignup, setIsSignup] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const toggleForm = () => {
        setIsSignup(!isSignup);
    };

    const handleLoginSuccess = (token) => {
        login(token);
        navigate("/Chaines");
    };

    return (
        <div className="login-container">
            <div className="login-image">
                <div className="overlay">
                    {isSignup ? (
                        <>
                            <h1>Bienvenue!</h1>
                            <p>Déjà membre? Connectez-vous ici.</p>
                            <button onClick={toggleForm}>SE CONNECTER</button>
                        </>
                    ) : (
                        <>
                            <h1>Rejoignez-nous!</h1>
                            <p>Pas encore membre? Inscrivez-vous ici.</p>
                            <button onClick={toggleForm}>INSCRIVEZ-VOUS</button>
                        </>
                    )}
                </div>
            </div>
            <div className="login-form-container">
                {isSignup ? <Register /> : <Login onLoginSuccess={handleLoginSuccess} />}
            </div>
        </div>
    );
};

export default LoginSignup;
