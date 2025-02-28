import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ExclamationCircleFill, CheckCircleFill, PersonPlusFill, Eye, EyeSlash } from "react-bootstrap-icons";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import "./Register.css";

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
    const [showPassword, setShowPassword] = useState(false); // État pour afficher/masquer le mot de passe
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await axios.post(
                "https://gestion-planning-back-end-1.onrender.com/signup",
                formData,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                    withXSRFToken: true,
                }
            );
            setSuccess("Inscription réussie !");
            setLoading(false);

            setTimeout(() => {
                navigate("/Chaines");
            }, 2000);
        } catch (error) {
            console.error("Erreur d'inscription :", error);
            setError(error.response?.data?.message || "Une erreur s'est produite lors de l'inscription.");
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <form className="signup-form" onSubmit={handleRegister}>
            <h2>Inscription</h2>

            {error && (
                <div className="error-message">
                    <ExclamationCircleFill className="error-icon" />
                    {error}
                </div>
            )}

            {success && (
                <div className="success-message">
                    <CheckCircleFill className="success-icon" />
                    {success}
                </div>
            )}

            <InputGroup className="mb-3">
                <FormControl
                    type="text"
                    placeholder="Prénom"
                    name="prénom"
                    value={formData.prénom}
                    onChange={handleChange}
                    required
                />
            </InputGroup>

            <InputGroup className="mb-3">
                <FormControl
                    type="text"
                    placeholder="Nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                />
            </InputGroup>

            <InputGroup className="mb-3">
                <FormControl
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </InputGroup>

            <InputGroup className="mb-3 d-flex flex-row">
                <FormControl
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe"
                    className="p-2"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <Button
                    onClick={togglePasswordVisibility}
                    className="p-2 h-100 bg-primary outline-secondary"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}>
                    {showPassword ? <EyeSlash /> : <Eye />}
                </Button>
            </InputGroup>

            <Button type="submit" className="btn-signup btn-primary btn-sm" disabled={loading}>
                {loading ? "Chargement..." : <PersonPlusFill className="signup-icon" />}
            </Button>
        </form>
    );
};

export default Register;
