import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import styled from 'styled-components';

export const AnimatedModal = styled(Modal)`
  animation: fadeInUp 0.5s ease-out;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);

  .modal-content {
    border: none;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

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

export const StyledTextArea = styled(Form.Control)`
  width: 100%;
  height: 120px;
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

export const StyledFileInput = styled(Form.Control)`
  width: 100%;
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
  padding: 10px 30px;
  font-size: 16px;
  border-radius: 25px;
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
const AjouterProduitsModel = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    titre: '',
    name: '',
    image: null,
    qty: 0,
    dossier_technique: null,
    dossier_serigraphie: null,
    bon_de_commande: null,
    patronage: null,
    date_reception_bon_commande: '',
    date_livraison_commande: '',
    descriptions: '',
    position_id: 6,
    coloris: '',
    po: '',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
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
      handleClose();
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit', error);
    }
  };

  return (
    <AnimatedModal show={show} onHide={handleClose} size="lg">
      <ModalHeader closeButton>
        <Modal.Title>✨ Ajouter un Produit</Modal.Title>
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formTitre" className="mb-4">
                <Form.Label>Titre</Form.Label>
                <StyledFormControl
                  type="text"
                  name="titre"
                  value={formData.titre}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formName" className="mb-4">
                <Form.Label>Nom</Form.Label>
                <StyledFormControl
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formPO" className="mb-4">
                <Form.Label>PO</Form.Label>
                <StyledFormControl
                  type="text"
                  name="po"
                  value={formData.po}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formQty" className="mb-4">
                <Form.Label>Quantité</Form.Label>
                <StyledFormControl
                  type="number"
                  name="qty"
                  value={formData.qty}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formColoris">
                <Form.Label>Coloris</Form.Label>
                <Form.Control
                  type="color"
                  name="coloris"
                  value={formData.coloris}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formDateReceptionBonComment" className="mb-4">
                <Form.Label>Date Réception Bon Commande</Form.Label>
                <StyledFormControl
                  type="date"
                  name="date_reception_bon_commande"
                  value={formData.date_reception_bon_commande}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="formDossierTechnique">
                <Form.Label>Image (PNG, JPG...)</Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  accept="image/png, image/jpeg"
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formDossierTechnique" className="mb-4">
                <Form.Label>Dossier Technique (PDF)</Form.Label>
                <StyledFileInput
                  type="file"
                  name="dossier_technique"
                  accept="application/pdf"
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formDossierSerigraphie" className="mb-4">
                <Form.Label>Dossier Sérigraphie (PDF)</Form.Label>
                <StyledFileInput
                  type="file"
                  name="dossier_serigraphie"
                  accept="application/pdf"
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formBonDeCommande" className="mb-4">
                <Form.Label>Bon de Commande (PDF)</Form.Label>
                <StyledFileInput
                  type="file"
                  name="bon_de_commande"
                  accept="application/pdf"
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formPatronage" className="mb-4">
                <Form.Label>Patronage (PDF)</Form.Label>
                <StyledFileInput
                  type="file"
                  name="patronage"
                  accept="application/pdf"
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formDateLivraisonComment" className="mb-4">
                <Form.Label>Date Livraison Commande</Form.Label>
                <StyledFormControl
                  type="date"
                  name="date_livraison_commande"
                  value={formData.date_livraison_commande}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="formDescriptions" className="mb-4">
            <Form.Label>Descriptions</Form.Label>
            <StyledTextArea
              as="textarea"
              rows={3}
              name="descriptions"
              value={formData.descriptions}
              onChange={handleChange}
            />
          </Form.Group>
          <GradientButton type="submit" className="btn-sm">
            🚀 Ajouter le Produit
          </GradientButton>
        </Form>
      </ModalBody>
    </AnimatedModal>
  );
};

export default AjouterProduitsModel;