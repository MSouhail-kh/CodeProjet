// AuthContext.js
import { createContext, useState, useEffect } from "react";
import api from "../services/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        user: null,
        token: localStorage.getItem("token") || null,
    });

    useEffect(() => {
        if (authState.token) {
            fetchUser();
        }
    }, [authState.token]);

    const fetchUser = async () => {
        try {
            const response = await api.get("/user", {
                headers: { Authorization: `Bearer ${authState.token}` },
            });
            setAuthState({ ...authState, user: response.data });
        } catch (error) {
            console.error("Erreur de récupération utilisateur:", error);
            setAuthState({ user: null, token: null });
            localStorage.removeItem("token");
        }
    };

    const login = (token) => {
        localStorage.setItem("token", token);
        setAuthState({ ...authState, token });
    };

    const logout = () => {
        localStorage.removeItem("token");
        setAuthState({ user: null, token: null });
    };

    return (
        <AuthContext.Provider value={{ authState, setAuthState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};