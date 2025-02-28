import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { ExclamationCircleFill, BoxArrowInRight, Eye, EyeSlash } from "react-bootstrap-icons";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import "./Login.css";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://gestion-planning-back-end-1.onrender.com/login",
        { email, password },
        { withCredentials: true }
      );
      const token = response.data.token;
      login(token); 
      onLoginSuccess(token); 
      navigate("/Chaines");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur lors de la connexion.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form className="login-form" onSubmit={handleLogin}>
      <h2>Connexion</h2>

      {error && (
        <div className="error-message">
          <ExclamationCircleFill className="error-icon" />
          {error}
        </div>
      )}

      <InputGroup className="mb-3">
        <FormControl
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </InputGroup>

      <InputGroup className="mb-3 d-flex flex-row">
        <FormControl
          type={showPassword ? "text" : "password"}
          className="p-2"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
            onClick={togglePasswordVisibility}
            className="p-2 h-100 bg-success outline-secondary"
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {showPassword ? <EyeSlash /> : <Eye />}
          </Button>

      </InputGroup>

      <Button type="submit" className="btn-login btn-success btn-sm" disabled={loading}>
        {loading ? "Chargement..." : <BoxArrowInRight className="login-icon" />}
      </Button>
    </form>
  );
};

export default Login;