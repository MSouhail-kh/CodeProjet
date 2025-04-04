import React, { useEffect, useState } from 'react';
import api from '../services/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Row, Col, Spinner, Alert, Modal } from 'react-bootstrap';
import { FilePdf, PencilSquare, CheckCircle, Palette, Calendar, Image, FileEarmarkText, CardText, XCircle ,HouseDoorFill } from 'react-bootstrap-icons';
import styled, { keyframes } from "styled-components";
import NoImage from "../assets/No+Image.png";
import Loader from '../Loader';


const pulseAnimation = keyframes`
  0% { transform: scale(0.8); opacity: 0.7; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(0.8); opacity: 0.7; }
`;


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

const FileName = styled.span`
  font-size: 0.9rem;
  color: #3498db;
  margin-left: 8px;
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
  height: 40px;
  width: 100%;

  &:focus {
    border-color: #3498db;
    box-shadow: none;
  }
`;

const DetailItem = styled.div`
  padding: 0.8rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const DetailLabel = styled.span`
  font-weight: 500;
  color: #6c757d;
  min-width: 50px;
`;

const DetailValue = styled.span`
  color: #2c3e50;
  font-weight: 200;
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

export const HomeButtonStyle = styled(Button)`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  backdrop-filter: blur(4px);
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  border: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
    background: linear-gradient(135deg, #2575fc, #6a11cb);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const formatDate = (dateStr) => {
  // Si la date est exactement "0/0/0", la retourner directement
  if (dateStr === "0/0/0") {
    return "0/0/0";
  }

  if (!dateStr || isNaN(Date.parse(dateStr))) {
    return '- / - / -';
  }

  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day} / ${month} / ${year}`;
};


const ProduitDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/produits/${id}`);
        setProduct(response.data);
        setEditedData(response.data);
        setLoading(false); 
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
      setEditedData(prev => ({
        ...prev,
        [name]: files[0],
      }));

      switch (name) {
        case 'image':
          setImageFileName(files[0].name);
          break;
        case 'technique':
          setDossierTechniqueFileName(files[0].name);
          break;
        case 'serigraphie':
          setDossierSerigraphieFileName(files[0].name);
          break;
        case 'commande':
          setBonDeCommandeFileName(files[0].name);
          break;
        case 'patronage':
          setPatronageFileName(files[0].name);
          break;
        default:
          break;
      }

      if (name === 'image') {
        setPreviewImage(URL.createObjectURL(files[0]));
      }
    } else {
      setEditedData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };


  const handleImageClick = () => {
    setShowImageModal(true);
  };

  if (loading) {
    return <Loader />;
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
      <Container className="mt-4" style={{ maxWidth: '1500px' }}>
        <StyledCard>
          <Row>
            <Col md={6}>
              <Card.Img
                variant="top"
                src={previewImage || product.image || NoImage}
                alt={product.style}
                style={{ 
                  height: '100%', 
                  objectFit: 'fill',
                  borderRight: '1px solid #e0e0e0',
                  cursor: 'pointer'
                }}
                onClick={handleImageClick}
              />
            </Col>
            
            <Col md={6}>
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <Card.Title className="mb-0" style={{ fontSize: '1.75rem', fontWeight: '600' }}>
                    { (
                      product.style
                    )}
                  </Card.Title>

                    <div className="d-flex align-items-center gap-2 btn-sm">
                     <HomeButtonStyle>
                        <HouseDoorFill onClick={() => {navigate(`/Chaines`)}} size={18} />
                     </HomeButtonStyle>                    
                    </div>
                  
                </div>

                <SectionTitle>
                  <Palette className="me-1" />
                  Détails 
                </SectionTitle>

                <Card.Subtitle className=" text-muted">
                  {(
                    <div className="d-flex flex-wrap gap-3">
                      <div>
                        <strong>Style :</strong>{product.style}
                      </div>
                      /
                      <div>
                        <strong>Quantité :</strong>{product.qty}
                      </div>
                      /
                      <div>
                        <strong>Référence PO :</strong>{product.po}
                      </div>
                      /
                      <div >
                        <strong>Couleur :</strong>{product.coloris}
                        </div>
                    </div>
                  )}
                </Card.Subtitle>
                <br />

                <SectionTitle>
                  <Calendar className="me-1 h-2" />
                  Calendrier
                </SectionTitle>

                <Row className="mb-8">
                  <Col md={6}>
                       <Form.Group>
                          <Form.Label>Date de Réception : </Form.Label>
                          { (
                            <div className="text-muted">
                              {formatDate(product.date_reception)}
                            </div>
                          )}
                        </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Date de Livraison : </Form.Label>
                      { (
                        <div className="text-muted">{formatDate(product.date_livraison)}</div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <SectionTitle className="mt-4">
                  Détails Techniques
                </SectionTitle>

                <StyledCard className="mb-4">
                  <Card.Body>
                    <Row className="g-3">
                      {(
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px', margin: '0 auto' }}>
                            <DetailItem>
                              <DetailLabel>
                                 Marque :
                              </DetailLabel>
                              <DetailValue>{product.brand || '-'}</DetailValue>
                            </DetailItem>

                            <DetailItem>
                              <DetailLabel>
                                 État :
                              </DetailLabel>
                              <DetailValue status={product.etat_de_commande?.toLowerCase().replace(' ', '-')}>
                                {product.etat_de_commande || '-'}
                              </DetailValue>
                            </DetailItem>

                            <DetailItem>
                              <DetailLabel>
                                 Référence :
                              </DetailLabel>
                              <DetailValue>{product.reference || '-'}</DetailValue>
                            </DetailItem>

                            <DetailItem>
                              <DetailLabel>
                                 Type produit :
                              </DetailLabel>
                              <DetailValue>{product.type_de_produit || '-'}</DetailValue>
                            </DetailItem>

                            <DetailItem>
                              <DetailLabel>
                                 Type commande :
                              </DetailLabel>
                              <DetailValue>{product.type_de_commande || '-'}</DetailValue>
                            </DetailItem>
                          </div>
                      )}
                    </Row>
                  </Card.Body>
                </StyledCard>

                <SectionTitle>
                  <FileEarmarkText className="me-1" />
                  Fichiers
                </SectionTitle>

                {product.documents && (
                  <>
                    {product.documents.technique && (
                      <DownloadLink
                        href={product.documents.technique}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FilePdf size={20} />
                        Télécharger le Dossier Technique PDF
                      </DownloadLink>
                    )}
                    {product.documents.serigraphie && (
                      <DownloadLink
                        href={product.documents.serigraphie}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FilePdf size={20} />
                        Télécharger le Dossier de Sérigraphie
                      </DownloadLink>
                    )}
                    {product.documents.commande && (
                      <DownloadLink
                        href={product.documents.commande}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FilePdf size={20} />
                        Télécharger le Bon de Commande
                      </DownloadLink>
                    )}
                    {product.documents.patronage && (
                      <DownloadLink
                        href={product.documents.patronage}
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

      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={previewImage || product.image || NoImage }
            alt={product.style}
            style={{ width: '100%', height: 'auto' }}
          />
        </Modal.Body>
      </Modal>

    </>
  );
};

export default ProduitDetails;
