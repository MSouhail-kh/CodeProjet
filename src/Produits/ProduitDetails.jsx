import React, { useEffect, useState } from 'react';
import api from '../services/axios';
import { useParams, useNavigate } from 'react-router-dom';
import MyNavbar from '../Navbar/Navbar';
import { Container, Card, Form, Button, Row, Col, Spinner, Alert, Modal } from 'react-bootstrap';
import { FilePdf, PencilSquare, CheckCircle, Palette, Calendar, Image, FileEarmarkText, CardText, XCircle } from 'react-bootstrap-icons';
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

const formatDate = (dateStr) => {
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
  const { po } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFileName, setImageFileName] = useState('');
  const [dossierTechniqueFileName, setDossierTechniqueFileName] = useState('');
  const [dossierSerigraphieFileName, setDossierSerigraphieFileName] = useState('');
  const [bonDeCommandeFileName, setBonDeCommandeFileName] = useState('');
  const [patronageFileName, setPatronageFileName] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/produits/${po}`);
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
  }, [po]);

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

  const handleSave = async () => {
    try {
      const formData = new FormData();

      Object.keys(editedData).forEach((key) => {
        if (editedData[key] !== null && editedData[key] !== undefined) {
          formData.append(key, editedData[key]);
        }
      });

      const response = await api.put(`/update/produits/${po}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setProduct(response.data);
      setIsEditing(false);
      setPreviewImage(null);
      setLoading(false);
      navigate(`/Chaines`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileClick = (fileUrl) => {
    setSelectedFile(fileUrl);
    setShowFileModal(true);
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
      <MyNavbar />
      <Container className="mt-2" style={{ maxWidth: '1500px' }}>
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
                    {isEditing ? (
                      <>
                      </>
                    ) : (
                      product.style
                    )}
                  </Card.Title>

                  <div className="d-flex align-items-center gap-2">
                    {/* <Button
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
                    </Button> */}

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
                  Détails 
                </SectionTitle>

                <Card.Subtitle className=" text-muted">
                  {isEditing ? (
                    <Row className="g-3">
                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label>Style : </Form.Label>
                          <StyledFormControl
                            type="text"
                            name="style"
                            value={editedData.style || ''}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label>Quantité :</Form.Label>
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
                          <Form.Label>Référence PO :</Form.Label>
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
                          <Form.Label>Couleur :</Form.Label>
                          <div >
                            <StyledFormControl
                              type="text"
                              name="coloris"
                              value={editedData.coloris }
                              onChange={handleInputChange}
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                  ) : (
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
                          {isEditing ? (
                            <StyledFormControl
                              type="date"
                              name="date_reception"
                              value={editedData.date_reception || ''}
                              onChange={handleInputChange}
                            />
                          ) : (
                            <div className="text-muted">
                              {formatDate(product.date_reception)}
                            </div>
                          )}
                        </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Date de Livraison : </Form.Label>
                      {isEditing ? (
                        <StyledFormControl
                          type="date"
                          name="date_livraison"
                          value={editedData.date_livraison || ''}
                          onChange={handleInputChange}
                        />
                      ) : (
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
                      {isEditing ? (
                        <>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Marque : </Form.Label>
                              <StyledFormControl
                                type="text"
                                name="brand"
                                value={editedData.brand || ''}
                                onChange={handleInputChange}
                              />
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Type de commande : </Form.Label>
                              <StyledFormControl
                                as="select"
                                name="type_de_commande"
                                value={editedData.type_de_commande || ''}
                                onChange={handleInputChange}
                              >
                                <option value="">Sélectionner...</option>
                                <option value="CMT">CMT</option>
                                <option value="MAKER">MAKER</option>
                              </StyledFormControl>
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>État : </Form.Label>
                              <StyledFormControl
                                type="text"
                                name="etat_de_commande"
                                value={editedData.etat_de_commande || ''}
                                onChange={handleInputChange}
                              >
                              </StyledFormControl>
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Référence : </Form.Label>
                              <StyledFormControl
                                type="text"
                                name="reference"
                                value={editedData.reference || ''}
                                onChange={handleInputChange}
                              />
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Type de produit : </Form.Label>
                              <StyledFormControl
                                as="select"
                                name="type_de_produit"
                                value={editedData.type_de_produit || ''}
                                onChange={handleInputChange}
                              >
                                <option value="">Sélectionner...</option>
                                <option value="TSHIRT">TSHIRT</option>
                                <option value="TSHIRT MC">TSHIRT MC</option>
                                <option value="TEE SHIRT ML">TEE SHIRT ML</option>
                              </StyledFormControl>
                            </Form.Group>
                          </Col>
                        </>
                      ) : (
                        <>
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
                        </>        
                      )}
                    </Row>
                  </Card.Body>
                </StyledCard>

                <SectionTitle>
                  <FileEarmarkText className="me-1" />
                  Fichiers
                </SectionTitle>

                {isEditing ? (
                  <>
                    <FileInputLabel>
                      <Image size={20} />
                      <span>Changer l'image du produit : </span>
                      <input
                        type="file"
                        name="image"
                        onChange={handleInputChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                      />
                      {imageFileName && <FileName>{imageFileName}</FileName>}
                    </FileInputLabel>

                    <FileInputLabel className="mt-3">
                      <FilePdf size={20} />
                      <span>Changer le dossier technique (PDF) : </span>
                      <input
                        type="file"
                        name="technique"
                        onChange={handleInputChange}
                        accept="application/pdf"
                        style={{ display: 'none' }}
                      />
                      {dossierTechniqueFileName && <FileName>{dossierTechniqueFileName}</FileName>}
                    </FileInputLabel>

                    <FileInputLabel className="mt-3">
                      <FilePdf size={20} />
                      <span>Changer le dossier de sérigraphie (PDF / ZIP / RAR) : </span>
                      <input
                        type="file"
                        name="serigraphie"
                        onChange={handleInputChange}
                        accept=".pdf, .zip, .rar, application/pdf, application/zip, application/x-rar-compressed"
                        style={{ display: 'none' }}
                      />
                      {dossierSerigraphieFileName && <FileName>{dossierSerigraphieFileName}</FileName>}
                    </FileInputLabel>

                    <FileInputLabel className="mt-3">
                      <FilePdf size={20} />
                      <span>Changer le bon de commande (PDF) : </span>
                      <input
                        type="file"
                        name="commande"
                        onChange={handleInputChange}
                        accept="application/pdf"
                        style={{ display: 'none' }}
                      />
                      {bonDeCommandeFileName && <FileName>{bonDeCommandeFileName}</FileName>}
                    </FileInputLabel>

                    <FileInputLabel className="mt-3">
                      <FilePdf size={20} />
                      <span>Changer le patronage (PDF / ZIP / RAR) : </span>
                      <input
                        type="file"
                        name="patronage"
                        onChange={handleInputChange}
                        accept=".pdf, .zip, .rar, application/pdf, application/zip, application/x-rar-compressed"
                        style={{ display: 'none' }}
                      />
                      {patronageFileName && <FileName>{patronageFileName}</FileName>}
                    </FileInputLabel>
                  </>
                ) : (
                  <>
                    {product.documents.technique && (
                      <DownloadLink
                        href={product.documents.technique}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.preventDefault();
                          handleFileClick(product.documents.technique);
                        }}
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
                        onClick={(e) => {
                          e.preventDefault();
                          handleFileClick(product.documents.serigraphie);
                        }}
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
                        onClick={(e) => {
                          e.preventDefault();
                          handleFileClick(product.documents.commande);
                        }}
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
                        onClick={(e) => {
                          e.preventDefault();
                          handleFileClick(product.documents.patronage);
                        }}
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
            src={previewImage || product.image || 'https://via.placeholder.com/300'}
            alt={product.style}
            style={{ width: '100%', height: 'auto' }}
          />
        </Modal.Body>
      </Modal>

      <Modal show={showFileModal} onHide={() => setShowFileModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Télécharger le fichier</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Voulez-vous télécharger ce fichier ?</p>
          <Button
            variant="primary"
            onClick={() => {
              window.open(selectedFile, '_blank');
              setShowFileModal(false);
            }}
          >
            Télécharger
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProduitDetails;
