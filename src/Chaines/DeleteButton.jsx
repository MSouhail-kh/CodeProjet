import React, { useState } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import styled from "styled-components";
import { Trash } from "react-bootstrap-icons";
import ConfirmationModal from "./ConfirmationModal";

export const StyledDeleteButton = styled(Button)`
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  border: none;
  color: white;
  padding: 8px 20px;
  font-size: 15px;
  border-radius: 25px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 75, 43, 0.3);
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 75, 43, 0.5);
    background: linear-gradient(135deg, #ff4b2b, #ff416c);
    color: #fff;
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 15px rgba(255, 75, 43, 0.4);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 75, 43, 0.3);
  }
`;

const DeleteButton = ({ onDeleteSuccess }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDrop = async (e) => {
    e.preventDefault();
    try {
      const transferData = JSON.parse(e.dataTransfer.getData("text/plain"));
      const item = transferData.item;

      if (!item || !item.id) {
        throw new Error("Données de transfert invalides");
      }

      await axios.delete(`https://gestion-planning-back-end.onrender.com/supprimer/produits/${item.id}`);
      onDeleteSuccess(item.id);
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Échec de la suppression du produit !");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleClick = () => {
    setShowConfirm(true);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <StyledDeleteButton
        variant="danger"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
        draggable={false}
      >
        <Trash className="bi bi-trash" />
        Supprimer
      </StyledDeleteButton>

      <ConfirmationModal
        show={showConfirm}
        message="Voulez-vous supprimer tous les produits ?"
        onCancel={handleCancel}
      />
    </>
  );
};

export default DeleteButton;
