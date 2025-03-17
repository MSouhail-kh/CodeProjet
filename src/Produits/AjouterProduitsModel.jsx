import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import AnimatedModal from 'components/AnimatedModal';
import GradientButton from 'components/GradientButton';
import { StyledFormControl, StyledFileInput } from 'components/StyledComponents';
import api from 'services/api';

const AjouterProduitsModel = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    style: '',
    // Si vous ne gérez pas l'upload de l'image via Google Drive/Sheets, vous pouvez l'omettre ou le traiter séparément
    image: null,
    qty: 0,
    dossier_technique: null,
    dossier_serigraphie: null,
    bon_de_commande: null,
    patronage: null,
    date_reception_bon_commande: '',
    date_livraison_commande: '',
    position_id: 6,
    coloris: '',
    po: '',
    brand: '',
    type_de_commande: '',
    etat_de_commande: '',
    reference: '',
    type_de_produit: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    // On ajoute toutes les paires clé/valeur au FormData, y compris les fichiers
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        if (value instanceof File) {
          formDataToSend.append(key, value, value.name);
        } else {
          formDataToSend.append(key, value);
        }
      }
    });

    try {
      const response = await api.post('/ajouter/produits', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Réponse:', response.data);
      handleClose();
      navigate(0); // actualise la page pour refléter les changements
    } catch (error) {
      console.error('Erreur:', error.response?.data || error.message);
    }
  };

  return (
    <AnimatedModal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>✨ Ajouter un Style</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formStyle" className="mb-4">
                <Form.Label>Style</Form.Label>
                <StyledFormControl
                  type="text"
                  name="style"
                  value={formData.style}
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

              <Form.Group controlId="formColoris" className="mb-4">
                <Form.Label>Coloris</Form.Label>
                <StyledFormControl
                  type="text"
                  name="coloris"
                  value={formData.coloris}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formBrand" className="mb-4">
                <Form.Label>Marque</Form.Label>
                <StyledFormControl
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formTypeDeCommande" className="mb-4">
                <Form.Label>Type de Commande</Form.Label>
                <StyledFormControl
                  as="select"
                  name="type_de_commande"
                  value={formData.type_de_commande}
                  onChange={handleChange}
                >
                  <option value="">Sélectionner...</option>
                  <option value="CMT">CMT</option>
                  <option value="MAKER">MAKER</option>
                </StyledFormControl>
              </Form.Group>

              <Form.Group controlId="formEtatDeCommande" className="mb-4">
                <Form.Label>État de la Commande</Form.Label>
                <StyledFormControl
                  type="text"
                  name="etat_de_commande"
                  value={formData.etat_de_commande}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formDateReception" className="mb-4">
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
              <Form.Group controlId="formImage" className="mb-4">
                <Form.Label>Image (PNG, JPG...)</Form.Label>
                <StyledFileInput
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
                <Form.Label>Dossier Sérigraphie (PDF, ZIP, RAR)</Form.Label>
                <StyledFileInput
                  type="file"
                  name="dossier_serigraphie"
                  accept=".pdf, .zip, .rar, application/pdf, application/zip, application/x-rar-compressed"
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
                <Form.Label>Patronage (PDF, ZIP, RAR)</Form.Label>
                <StyledFileInput
                  type="file"
                  name="patronage"
                  accept=".pdf, .zip, .rar, application/pdf, application/zip, application/x-rar-compressed"
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formTypeDeProduit" className="mb-4">
                <Form.Label>Type de Produit</Form.Label>
                <StyledFormControl
                  as="select"
                  name="type_de_produit"
                  value={formData.type_de_produit}
                  onChange={handleChange}
                >
                  <option value="">Sélectionner...</option>
                  <option value="TSHIRT">TSHIRT</option>
                  <option value="TSHIRT MC">TSHIRT MC</option>
                  <option value="TEE SHIRT ML">TEE SHIRT ML</option>
                </StyledFormControl>
              </Form.Group>

              <Form.Group controlId="formReference" className="mb-4">
                <Form.Label>Référence</Form.Label>
                <StyledFormControl
                  type="text"
                  name="reference"
                  value={formData.reference}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formDateLivraison" className="mb-4">
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

          <Modal.Footer>
            <GradientButton type="submit" className="btn-sm">
              🚀 Ajouter le Style
            </GradientButton>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </AnimatedModal>
  );
};

export default AjouterProduitsModel;
