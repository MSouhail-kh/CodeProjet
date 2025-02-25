import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaUserPlus , FaPaperPlane , FaKey} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

export const Login = ({ onLoginSuccess }) => { 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation logic
    if (!email || !password) {
      setError("Veuillez remplir tous les champs requis.");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Adresse e-mail invalide.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        {
          username: email,
          password,
        },
        { withCredentials: true ,withXSRFToken : true} 
      );
      const token = response.data.token;

      // Stocker le token dans le stockage local
      localStorage.setItem("jwt_token", token);
      console.log("Connexion réussie !");

      // Appeler la fonction pour récupérer l'utilisateur après la connexion
      if (onLoginSuccess) {
        onLoginSuccess(token);  // Passer le token à App.js ou autre fonction pour récupérer l'utilisateur
      }

      setError("");
      setLoading(false);
      // Redirection ou autre logique ici
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la connexion.");
      setLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center vh-100 bg-light"
      style={{ background: "#D0EFFF" }}
    >
      <Row className="w-100">
        <Col md={4} className="mx-auto">
          <div className="p-4 shadow rounded" style={{ backgroundColor: "#FFFFFF" }}>
            <h1
              className="text-center mb-4"
              style={{ color: "#00008B", fontSize: "28px", fontWeight: "bold" }}
            >
              Se connecter
            </h1>
            {error && (
              <Alert variant="danger" className="text-center">
                {error}
              </Alert>
            )}
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: "16px", fontWeight: "bold", color: "#0288D1" }}>
                  Adresse e-mail
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Entrez votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ fontSize: "14px", color: "#1565C0" }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: "16px", fontWeight: "bold", color: "#0288D1" }}>
                  Mot de passe
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ fontSize: "14px", color: "#1565C0" }}
                />
              </Form.Group>
              <Button
                type="submit"
                className="btn btn-sm w-100"
                style={{
                  backgroundColor: "#0288D1",
                  borderColor: "#0288D1",
                  fontSize: "14px",
                  textTransform: "uppercase",
                }}
                disabled={loading}
              >
                {loading ? "Chargement..." : "Se connecter"}
              </Button>
              <div className="text-center mt-3">
                <a
                  href="/forgot-password"
                  style={{ color: "#1565C0", textDecoration: "underline", fontSize: "14px" }}
                >
                  Mot de passe oublié ?
                </a>
                <br />
                <a
                  href="/register"
                  style={{ color: "#00008B", fontWeight: "bold", fontSize: "14px" }}
                >
                  Créer un compte
                </a>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Veuillez remplir tous les champs obligatoires.");
    } else if (!validateEmail(email)) {
      setError("Adresse e-mail invalide.");
    } else if (password.length < 8) {
      setError("Mot de passe trop court.");
    } else if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
    } else {
      setError("");
      axios
        .post('http://localhost:5000/api/signup', {
          username: email, 
          password: password,
        })
        .then((response) => {
          setSuccess("Inscription réussie !");
          console.log("Inscription réussie :", response.data);
        })
        .catch((error) => {
          setError("Erreur d'inscription, veuillez réessayer.");
          console.error("Erreur d'inscription :", error.response ? error.response.data : error);
        });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center vh-100 bg-light"
      style={{ background: "#D0EFFF" }}
    >
      <Row className="w-100">
        <Col md={5} className="mx-auto">
          <div className="p-4 shadow rounded" style={{ backgroundColor: "#FFFFFF" }}>
            <h1
              className="text-center mb-4"
              style={{ color: "#00008B", fontSize: "28px", fontWeight: "bold" }}
            >
              Create an account
            </h1>
            {error && (
              <Alert variant="danger" className="text-center">
                {error}
              </Alert>
            )}
            {success && (
              <Alert variant="success" className="text-center">
                {success}
              </Alert>
            )}
            <Form onSubmit={handleRegister}>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: "16px", fontWeight: "bold", color: "#0288D1" }}>
                  <FaUser className="me-2" /> Prénom
                </Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  placeholder="Entrez votre prénom"
                  value={formData.firstName}
                  onChange={handleChange}
                  style={{ fontSize: "14px", color: "#1565C0" }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: "16px", fontWeight: "bold", color: "#0288D1" }}>
                  <FaUser className="me-2" /> Nom
                </Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  placeholder="Entrez votre nom"
                  value={formData.lastName}
                  onChange={handleChange}
                  style={{ fontSize: "14px", color: "#1565C0" }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: "16px", fontWeight: "bold", color: "#0288D1" }}>
                  <FaEnvelope className="me-2" /> Adresse e-mail
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Entrez votre email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ fontSize: "14px", color: "#1565C0" }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: "16px", fontWeight: "bold", color: "#0288D1" }}>
                  <FaLock className="me-2" /> Mot de passe
                </Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Entrez votre mot de passe"
                  value={formData.password}
                  onChange={handleChange}
                  style={{ fontSize: "14px", color: "#1565C0" }}
                />
                <Form.Text style={{ color: "#B0BEC5" }}>
                  Votre mot de passe doit contenir au moins 8 caractères.
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: "16px", fontWeight: "bold", color: "#0288D1" }}>
                  <FaLock className="me-2" /> Confirmez le mot de passe
                </Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirmez votre mot de passe"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{ fontSize: "14px", color: "#1565C0" }}
                />
              </Form.Group>
              <Button
                type="submit"
                className="btn btn-sm "
                style={{ backgroundColor: "#0288D1", borderColor: "#0288D1", fontSize: "14px", textTransform: "uppercase" }}
              >
                <FaUserPlus className="me-2" /> S'inscrire
              </Button>
              <div className="text-center mt-3">
                <a href="#login" style={{ color: "#1565C0", textDecoration: "underline", fontSize: "14px" }}>
                  Se connecter
                </a>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Veuillez entrer une adresse e-mail valide.");
      return;
    }

    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      const response = await axios.post("http://localhost:5000/api/forgot-password", { email });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Row className="w-100">
        <Col md={5} className="mx-auto">
          <div className="p-4 shadow rounded" style={{ backgroundColor: "#FFFFFF" }}>
            <h2
              className="text-center mb-4"
              style={{ color: "#00008B", fontWeight: "bold" }}
            >
              Réinitialisation de mot de passe
            </h2>
            {message && (
              <Alert variant="success" className="text-center">
                {message}
              </Alert>
            )}
            {error && (
              <Alert variant="danger" className="text-center">
                {error}
              </Alert>
            )}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label
                  htmlFor="email"
                  style={{ fontWeight: "bold", color: "#0288D1" }}
                >
                  <FaEnvelope className="me-2" /> Adresse e-mail
                </Form.Label>
                <Form.Control
                  id="email"
                  type="email"
                  placeholder="Entrez votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ color: "#1565C0" }}
                  required
                />
              </Form.Group>
              <Button
                type="submit"
                className="w-100"
                style={{ backgroundColor: "#0288D1", borderColor: "#0288D1" }}
                disabled={isSubmitting}
              >
                <FaPaperPlane className="me-2" />{" "}
                {isSubmitting ? "Envoi en cours..." : "Envoyer le lien"}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export const ResetPassword = () => {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const response = await axios.post("http://localhost:5000/api/reset-password", {
        userId,
        newPassword,
        resetToken: token,
      });
      setMessage(response.data.message);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue.");
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Row className="w-100">
        <Col md={5} className="mx-auto">
          <div className="p-4 shadow rounded" style={{ backgroundColor: "#FFFFFF" }}>
            <h2 className="text-center mb-4" style={{ color: "#00008B", fontWeight: "bold" }}>
              Réinitialisez votre mot de passe
            </h2>
            {message && <Alert variant="success" className="text-center">{message}</Alert>}
            {error && <Alert variant="danger" className="text-center">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: "bold", color: "#0288D1" }}>
                  <FaLock className="me-2" /> Nouveau mot de passe
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Entrez votre nouveau mot de passe"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ color: "#1565C0" }}
                  required
                />
              </Form.Group>
              <Button
                type="submit"
                className="w-100"
                style={{ backgroundColor: "#0288D1", borderColor: "#0288D1" }}
              >
                <FaKey className="me-2" /> Réinitialiser
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

