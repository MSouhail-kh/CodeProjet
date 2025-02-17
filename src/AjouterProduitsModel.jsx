import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import styled from 'styled-components';

// Définir le style avec animation
const AnimatedModal = styled(Modal)`
  animation: fadeInUp 0.5s ease-out;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const AjouterProduitsModel = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    titre: '',
    name: '',
    image: '',
    qty: 0,
    dossier_technique: null, // Maintenant un fichier
    chaine_production: null, // Maintenant un fichier
    date_reception_bon_comment: '',
    date_livraison_comment: '',
    descriptions: '',
    position_id: 6, // Position ID fixé à 6 par défaut
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      // Si c'est un fichier, on le met à jour dans l'état
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      // Sinon, on gère les champs texte
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    // Ajouter les champs du formulaire à l'objet FormData
    Object.keys(formData).forEach(key => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });
  
    try {
      const response = await axios.post('http://127.0.0.1:5000/ajouter/produits', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data.message);
      handleClose();  // Ferme le modal après l'ajout
      window.location.reload(); // Rafraîchit la page
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit", error);
    }
  };
  
  return (
    <AnimatedModal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Ajouter un Produit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formTitre">
            <Form.Label>Titre</Form.Label>
            <Form.Control
              type="text"
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formName">
            <Form.Label>Nom</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formImage">
            <Form.Label>Image (PNG, JPG...)</Form.Label>
            <Form.Control
                type="file"
                name="image"
                accept="image/png, image/jpeg"
                onChange={handleChange}
            />
            </Form.Group>

          <Form.Group controlId="formQty">
            <Form.Label>Quantité</Form.Label>
            <Form.Control
              type="number"
              name="qty"
              value={formData.qty}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formDossierTechnique">
            <Form.Label>Dossier Technique (PDF)</Form.Label>
            <Form.Control
              type="file"
              name="dossier_technique"
              accept="application/pdf"
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formChaineProduction">
            <Form.Label>Chaine de Production (PDF)</Form.Label>
            <Form.Control
              type="file"
              name="chaine_production"
              accept="application/pdf"
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formDateReceptionBonComment">
            <Form.Label>Date Réception Bon Comment</Form.Label>
            <Form.Control
              type="date"
              name="date_reception_bon_comment"
              value={formData.date_reception_bon_comment}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formDateLivraisonComment">
            <Form.Label>Date Livraison Comment</Form.Label>
            <Form.Control
              type="date"
              name="date_livraison_comment"
              value={formData.date_livraison_comment}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formDescriptions">
            <Form.Label>Descriptions</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descriptions"
              value={formData.descriptions}
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3">
            Ajouter le Produit
          </Button>
        </Form>
      </Modal.Body>
    </AnimatedModal>
  );
};

export default AjouterProduitsModel;
