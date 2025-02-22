import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import MyNavbar from '../Navbar/Navbar';
import { Container, Card, Form, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { FilePdf, PencilSquare, CheckCircle, Palette, Calendar, Image, FileEarmarkText, CardText ,XCircle} from 'react-bootstrap-icons';
import styled from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css';

// Styles avec Styled Components
const StyledCard = styled(Card)`
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const SectionTitle = styled.h5`
  font-family: 'Segoe UI', sans-serif;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
`;

const DownloadLink = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2c3e50;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.3s ease;

  &:hover {
    background: #f8f9fa;
    color: #3498db;
    transform: translateX(5px);
  }
`;

const StyledFormControl = styled(Form.Control)`
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #3498db;
    box-shadow: none;
  }
`;

const ColorPreview = styled.span`
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #e0e0e0;
  vertical-align: middle;
  margin-left: 8px;
`;

const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.5rem;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #3498db;
    background: #f8f9fa;
  }
`;

const FileName = styled.span`
  font-size: 0.9rem;
  color: #3498db;
  margin-left: 8px;
`;
const ProduitDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  // États pour stocker les noms des fichiers sélectionnés
  const [imageFileName, setImageFileName] = useState('');
  const [dossierTechniqueFileName, setDossierTechniqueFileName] = useState('');
  const [dossierSerigraphieFileName, setDossierSerigraphieFileName] = useState('');
  const [bonDeCommandeFileName, setBonDeCommandeFileName] = useState('');
  const [patronageFileName, setPatronageFileName] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/produits/${id}`);
        setProduct(response.data);
        setEditedData(response.data);
      } catch (err) {
        setError('Erreur lors de la récupération des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      // Si c'est un fichier, stockez le fichier dans editedData
      setEditedData(prev => ({
        ...prev,
        [name]: files[0],
      }));

      // Mettre à jour le nom du fichier sélectionné
      switch (name) {
        case 'image':
          setImageFileName(files[0].name);
          break;
        case 'dossier_technique':
          setDossierTechniqueFileName(files[0].name);
          break;
        case 'dossier_serigraphie':
          setDossierSerigraphieFileName(files[0].name);
          break;
        case 'bon_de_commande':
          setBonDeCommandeFileName(files[0].name);
          break;
        case 'patronage':
          setPatronageFileName(files[0].name);
          break;
        default:
          break;
      }

      // Afficher un aperçu de l'image sélectionnée
      if (name === 'image') {
        setPreviewImage(URL.createObjectURL(files[0]));
      }
    } else {
      // Sinon, stockez la valeur normale
      setEditedData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      // Ajoutez tous les champs modifiés au FormData
      Object.keys(editedData).forEach((key) => {
        if (editedData[key] !== null && editedData[key] !== undefined) {
          formData.append(key, editedData[key]);
        }
      });

      const response = await axios.put(
        `http://localhost:5000/update/produits/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Important pour les fichiers
          },
        }
      );

      setProduct(response.data);
      setIsEditing(false);
      setPreviewImage(null); // Réinitialiser l'aperçu de l'image
      window.location.reload(); // Recharger la page pour afficher les nouvelles données
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">Aucun produit trouvé</Alert>
      </Container>
    );
  }

  return (
    <>
      <MyNavbar />
      <Container className="mt-4" style={{ maxWidth: '1200px' }}>
        <StyledCard>
          <Row>
            <Col md={6}>
              <Card.Img
                variant="top"
                src={previewImage || product.image || 'https://via.placeholder.com/300'}
                alt={product.name}
                style={{ 
                  height: '100%', 
                  objectFit: 'cover',
                  borderRight: '1px solid #e0e0e0'
                }}
              />
            </Col>
            
            <Col md={6}>
              <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                  <Card.Title className="mb-0" style={{ fontSize: '1.75rem', fontWeight: '600' }}>
                    {isEditing ? (
                      <StyledFormControl
                        type="text"
                        name="titre"
                        value={editedData.titre || ''}
                        onChange={handleInputChange}
                        placeholder="Titre du produit"
                      />
                    ) : (
                      product.titre
                    )}
                  </Card.Title>

                  <div className="d-flex align-items-center gap-2">
                    {/* Bouton Modifier/Sauvegarder */}
                    <Button
                      variant={isEditing ? 'success' : 'outline-primary'}
                      onClick={isEditing ? handleSave : () => setIsEditing(true)}
                      className="d-flex align-items-center gap-2 btn-sm"
                    >
                      {isEditing ? (
                        <>
                          <CheckCircle size={18} />
                          Sauvegarder
                        </>
                      ) : (
                        <>
                          <PencilSquare size={18} />
                          Modifier
                        </>
                      )}
                    </Button>

                    {isEditing && (
                      <Button
                        variant="outline-danger"
                        onClick={() => setIsEditing(false)}
                        className="d-flex align-items-center gap-2 btn-sm"
                      >
                        <XCircle size={18}/>
                        <span>Fermer</span>
                      </Button>
                    )}
                  </div>
                </div>
                <SectionTitle>
                  <Palette className="me-1" />
                  Détails du produit
                </SectionTitle>

                <Card.Subtitle className="mb-4 text-muted">
                  {isEditing ? (
                    <Row className="g-3">
                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label>Nom du modèle</Form.Label>
                          <StyledFormControl
                            type="text"
                            name="name"
                            value={editedData.name || ''}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label>Quantité</Form.Label>
                          <StyledFormControl
                            type="number"
                            name="qty"
                            value={editedData.qty || ''}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label>Référence PO</Form.Label>
                          <StyledFormControl
                            type="text"
                            name="po"
                            value={editedData.po || ''}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label>Couleur</Form.Label>
                          <div className="d-flex align-items-center gap-2">
                            <StyledFormControl
                              type="color"
                              name="coloris"
                              value={editedData.coloris || '#cccccc'}
                              onChange={handleInputChange}
                              style={{ width: '60px' }}
                            />
                            <span>{editedData.coloris}</span>
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                  ) : (
                    <div className="d-flex flex-wrap gap-3">
                      <div>
                        <strong>Modèle:</strong> {product.name}
                      </div>
                      /
                      <div>
                        <strong>Quantité:</strong> {product.qty}
                      </div>
                      /
                      <div>
                        <strong>PO:</strong> {product.po}
                      </div>
                      /
                      <div className="d-flex align-items-center">
                        <strong>Couleur:</strong>
                        <ColorPreview style={{ backgroundColor: product.coloris }} />
                      </div>
                    </div>
                  )}
                </Card.Subtitle>

                <SectionTitle>
                  <Calendar className="me-1 h-2" />
                  Calendrier
                </SectionTitle>

                <Row className="mb-4 g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Date de Réception : </Form.Label>
                      {isEditing ? (
                        <StyledFormControl
                          type="date"
                          name="date_reception_bon_commande"
                          value={editedData.date_reception_bon_commande || ''}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="text-muted">{product.date_reception_bon_commande}</div>
                      )}
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Date de Livraison : </Form.Label>
                      {isEditing ? (
                        <StyledFormControl
                          type="date"
                          name="date_livraison_commande"
                          value={editedData.date_livraison_commande || ''}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="text-muted">{product.date_livraison_commande}</div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <SectionTitle>
                  <CardText className="me-1" />
                  Description
                </SectionTitle>

                {isEditing ? (
                  <Form.Control
                    as="textarea"
                    name="descriptions"
                    value={editedData.descriptions || ''}
                    onChange={handleInputChange}
                    rows={4}
                    style={{ border: '2px solid #e0e0e0', borderRadius: '8px' }}
                  />
                ) : (
                  <p>{product.descriptions}</p>
                )}

            <SectionTitle>
              <FileEarmarkText className="me-1" />
              Fichiers
            </SectionTitle>

            {isEditing ? (
              <>
                {/* Champ pour changer l'image du produit */}
                <FileInputLabel>
                  <Image size={20} />
                  <span>Changer l'image du produit</span>
                  <input
                    type="file"
                    name="image"
                    onChange={handleInputChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  {imageFileName && <FileName>{imageFileName}</FileName>}
                </FileInputLabel>

                {/* Champ pour changer le dossier technique */}
                <FileInputLabel className="mt-3">
                  <FilePdf size={20} />
                  <span>Changer le dossier technique (PDF)</span>
                  <input
                    type="file"
                    name="dossier_technique"
                    onChange={handleInputChange}
                    accept="application/pdf"
                    style={{ display: 'none' }}
                  />
                  {dossierTechniqueFileName && <FileName>{dossierTechniqueFileName}</FileName>}
                </FileInputLabel>

                {/* Champ pour changer le dossier de sérigraphie */}
                <FileInputLabel className="mt-3">
                  <FilePdf size={20} />
                  <span>Changer le dossier de sérigraphie (PDF)</span>
                  <input
                    type="file"
                    name="dossier_serigraphie"
                    onChange={handleInputChange}
                    accept="application/pdf"
                    style={{ display: 'none' }}
                  />
                  {dossierSerigraphieFileName && <FileName>{dossierSerigraphieFileName}</FileName>}
                </FileInputLabel>

                {/* Champ pour changer le bon de commande */}
                <FileInputLabel className="mt-3">
                  <FilePdf size={20} />
                  <span>Changer le bon de commande (PDF)</span>
                  <input
                    type="file"
                    name="bon_de_commande"
                    onChange={handleInputChange}
                    accept="application/pdf"
                    style={{ display: 'none' }}
                  />
                  {bonDeCommandeFileName && <FileName>{bonDeCommandeFileName}</FileName>}
                </FileInputLabel>

                {/* Champ pour changer le patronage */}
                <FileInputLabel className="mt-3">
                  <FilePdf size={20} />
                  <span>Changer le patronage (PDF)</span>
                  <input
                    type="file"
                    name="patronage"
                    onChange={handleInputChange}
                    accept="application/pdf"
                    style={{ display: 'none' }}
                  />
                  {patronageFileName && <FileName>{patronageFileName}</FileName>}
                </FileInputLabel>
              </>
            ) : (
              <>
                {/* Afficher les liens de téléchargement si les fichiers existent */}
                {product.dossier_technique && (
                  <DownloadLink
                    href={product.dossier_technique}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FilePdf size={20} />
                    Télécharger le Dossier Technique PDF
                  </DownloadLink>
                )}
                {product.dossier_serigraphie && (
                  <DownloadLink
                    href={product.dossier_serigraphie}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FilePdf size={20} />
                    Télécharger le Dossier de Sérigraphie
                  </DownloadLink>
                )}
                {product.bon_de_commande && (
                  <DownloadLink
                    href={product.bon_de_commande}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FilePdf size={20} />
                    Télécharger le Bon de Commande
                  </DownloadLink>
                )}
                {product.patronage && (
                  <DownloadLink
                    href={product.patronage}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FilePdf size={20} />
                    Télécharger le Patronage
                  </DownloadLink>
                )}
              </>
            )}
              </Card.Body>
            </Col>
          </Row>
        </StyledCard>
      </Container>
    </>
  );
};

export default ProduitDetails;