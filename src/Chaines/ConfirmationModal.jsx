import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import styled from 'styled-components';
import api from '../services/axios';

export const ModalBody = styled(Modal.Body)`
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
`;

export const ModalHeader = styled(Modal.Header)`
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  border-bottom: none;

  .modal-title {
    color: white;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .btn-close {
    filter: invert(1);
  }
`;

export const StyledFormControl = styled(Form.Control)`
  width: 100%;
  height: 45px;
  padding: 10px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

export const GradientButton = styled(Button)`
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  border: none;
  color: white;
  padding: 2px 15px;
  font-size: 15px;
  border-radius: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(106, 17, 203, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(106, 17, 203, 0.4);
    background: linear-gradient(135deg, #2575fc, #6a11cb);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 15px rgba(106, 17, 203, 0.3);
  }
`;

export const FermerButton = styled(Button)`
  background: linear-gradient(135deg, rgb(120, 1, 247), #2575fc);
  border: none;
  color: white;
  padding: 2px 15px;
  font-size: 15px;
  border-radius: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(106, 17, 203, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgb(235, 6, 6);
    background: linear-gradient(135deg, #2575fc, #6a11cb);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 15px rgb(235, 6, 6);
  }
`;

const ConfirmationModal = ({ show, message, onCancel }) => {
  const [password, setPassword] = useState("");

  const handleConfirm = async () => {
    if (password === "12345678") {
      try {
        await api.delete("/supprimer/produits");
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
      <ModalHeader closeButton>
        <Modal.Title>🗑 Confirmation</Modal.Title>
      </ModalHeader>
      <ModalBody>
        <p>{message}</p>
        <Form.Group controlId="confirmationPassword">
          <Form.Label>Mot de passe</Form.Label>
          <StyledFormControl
            type="password"
            placeholder="Entrez le mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
      </ModalBody>
      <Modal.Footer>
        <FermerButton variant="secondary" onClick={onCancel}>
          Annuler
        </FermerButton>
        <GradientButton variant="primary" onClick={handleConfirm}>
          OK
        </GradientButton>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;