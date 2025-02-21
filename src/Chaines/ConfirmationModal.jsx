import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const ConfirmationModal = ({ show, message, onCancel }) => {
  const [password, setPassword] = useState("");

  const handleConfirm = async () => {
    if (password === "12345678") {
      try {
        await axios.delete("http://localhost:5000/supprimer/produits");
        window.location.reload();
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        alert("Échec de la suppression de tous les produits !");
      }
    } else {
      alert("Mot de passe incorrect !");
    }
  };

  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
        <Form.Group controlId="confirmationPassword">
          <Form.Label>Mot de passe</Form.Label>
          <Form.Control
            type="password"
            placeholder="Entrez le mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
