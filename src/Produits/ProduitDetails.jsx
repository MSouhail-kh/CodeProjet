import React, { useEffect, useState } from 'react';
import api from '../services/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Alert, Modal } from 'react-bootstrap';
import styled from "styled-components";
import NoImage from "../assets/No+Image.png";

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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/produits/${po}`);
        setProduct(response.data);
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

  if (loading) {
    return <div>Chargement...</div>;
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
                src={product.image || NoImage}
                alt={product.style}
                style={{ 
                  height: '100%', 
                  objectFit: 'fill',
                  borderRight: '1px solid #e0e0e0',
                  cursor: 'pointer'
                }}
              />
            </Col>
            
            <Col md={6}>
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <Card.Title className="mb-0" style={{ fontSize: '1.75rem', fontWeight: '600' }}>
                    {product.style}
                  </Card.Title>
                </div>

                <SectionTitle>
                  Détails 
                </SectionTitle>

                <Card.Subtitle className="text-muted">
                  <div className="d-flex flex-wrap gap-3">
                    <div>
                      <strong>Style :</strong> {product.style}
                    </div>
                    /
                    <div>
                      <strong>Quantité :</strong> {product.qty}
                    </div>
                    /
                    <div>
                      <strong>Référence PO :</strong> {product.po}
                    </div>
                    /
                    <div>
                      <strong>Couleur :</strong> {product.coloris}
                    </div>
                  </div>
                </Card.Subtitle>
                <br />

                <SectionTitle>
                  Calendrier
                </SectionTitle>

                <Row className="mb-8">
                  <Col md={6}>
                    <div>
                      <strong>Date de Réception :</strong> {formatDate(product.date_reception)}
                    </div>
                  </Col>
                  <Col md={6}>
                    <div>
                      <strong>Date de Livraison :</strong> {formatDate(product.date_livraison)}
                    </div>
                  </Col>
                </Row>

                <SectionTitle>
                  Fichiers
                </SectionTitle>

                <div>
                  {product.documents.technique && (
                    <DownloadLink
                      href={product.documents.technique}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Télécharger le Dossier Technique PDF
                    </DownloadLink>
                  )}
                  {product.documents.serigraphie && (
                    <DownloadLink
                      href={product.documents.serigraphie}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Télécharger le Dossier de Sérigraphie
                    </DownloadLink>
                  )}
                </div>
              </Card.Body>
            </Col>
          </Row>
        </StyledCard>
      </Container>
    </>
  );
};

export default ProduitDetails;