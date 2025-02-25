import React, { useState } from 'react';
import './Register.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Register = ({ onRegisterSuccess }) => {
    const [formData, setFormData] = useState({
        prénom: "",
        nom: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await axios.post(
                'http://localhost:5000/signup',
                {   prénom: formData.prénom,
                    nom: formData.nom,
                    email: formData.email,
                    password: formData.password,
                },
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true ,withXSRFToken:true
                }
            );
            setSuccess("Inscription réussie !");
            setLoading(false);

            setTimeout(() => {
                navigate('/Chaines'); 
            }, 2000);

        } catch (error) {
            console.error("Erreur d'inscription :", error);
            setError("Une erreur s'est produite lors de l'inscription.");
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <form className="signup-form" onSubmit={handleRegister}>
            <h2>Inscription</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <input
                type="text"
                className="form-control"
                placeholder="Prénom"
                name="prénom"
                value={formData.prénom}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                className="form-control"
                placeholder="Nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
            />
            <input
                type="email"
                className="form-control"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                className="form-control"
                placeholder="Mot de passe"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
            />

            <button type="submit" className="btn-signup" disabled={loading}>
                {loading ? "Chargement..." : "S'INSCRIRE"}
            </button>
        </form>
    );
};

export default Register;