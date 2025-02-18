import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import MyNavbar from './MyNavbar';

// Container général
const Container = styled.div`
  max-width: 100%;
  margin: 1rem auto;
  padding: 1rem;
  font-family: 'Arial', sans-serif;
`;

// Carte du produit avec disposition en ligne et styles épurés
const ProductCard = styled.div`
  display: flex;
  flex-direction: row;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// Conteneur de l'image avec fond neutre
const ImageWrapper = styled.div`
  flex: 1;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Image du produit avec ajustement pour s'adapter au conteneur
const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// Placeholder pour l'absence d'image
const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  background: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 0.9rem;
  padding: 1rem;
`;

// Informations sur le produit avec espacement réduit
const ProductInfo = styled.div`
  flex: 2;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

// Section du titre avec marges réduites
const TitleSection = styled.div`
  margin-bottom: 1rem;
`;

// Titre du produit avec taille de police réduite
const ProductTitle = styled.h1`
  font-size: 2rem;
  color: #333;
  margin: 0;
  font-weight: 700;
`;

// Sous-titre du produit avec taille de police réduite
const ProductSubtitle = styled.h2`
  font-size: 1.5rem;
  color: #777;
  margin: 0.3rem 0;
  font-weight: 400;
`;

// Quantité du produit avec taille de police réduite
const Quantity = styled.span`
  font-size: 0.8rem;
  font-weight: bold;
  color: #444;
  margin-left: 0.5rem;
`;

const Po = styled.span`
  font-size: 0.8rem;
  font-weight: bold;
  color: #444;
  margin-left: 0.5rem;

`;

const Coloris = styled.span`
  font-size: 0.8rem;
  font-weight: bold;
  color: #444;
  margin-left: 0.5rem;
`;


const ColorCircle = styled.span`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${props => props.customColor || '#ccc'};
  display: inline-block;
`;

// Section des dates avec espacement réduit
const Dates = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

// Étiquette de date avec taille de police réduite
const DateLabel = styled.div`
  font-size: 0.85rem;
  color: #555;
  background: #f8f8f8;
  padding: 0.5rem;
  border-radius: 8px;
  flex: 1;
`;

// Section de description avec mise en forme améliorée
const DescriptionSection = styled.div`
  margin-top: 1rem;
  font-size: 1rem;
  color: #555;
  line-height: 1.6;
  background: #fafafa;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #eee;
`;

// Bouton de téléchargement retravaillé
const DownloadLink = styled.a`
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  width: 40%;
`;

const ProduitDetails = () => {
  const { id } = useParams(); // Récupération de l'ID via l'URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/produits/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError('Erreur lors de la récupération des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <Container>Chargement en cours...</Container>;
  }

  if (error) {
    return <Container>{error}</Container>;
  }

  if (!product) {
    return <Container>Aucun produit trouvé</Container>;
  }
  return (
    <>
      <MyNavbar />
      <Container>
        <ProductCard>
          <ImageWrapper>
            {product.image ? (
              <ProductImage src={product.image} alt={product.name} />
            ) : (
              <PlaceholderImage>Aucune image</PlaceholderImage>
            )}
          </ImageWrapper>
          <ProductInfo>
            <TitleSection>
              <ProductTitle>{product.titre}</ProductTitle>
              <ProductSubtitle>
                {product.name} /
                <Quantity>Quantité : {product.qty}</Quantity> /
                <Po>Po : {product.po}</Po> /
                <Coloris >Color : <ColorCircle customColor={product.coloris} /> </Coloris>
              </ProductSubtitle>
            </TitleSection>
            <Dates>
              <DateLabel>
                <strong>Date de Réception:</strong>
                <br />
                {product.date_reception_bon_comment}
              </DateLabel>
              <DateLabel>
                <strong>Date de Livraison:</strong>
                <br />
                {product.date_livraison_comment}
              </DateLabel>
            </Dates>
            <DescriptionSection>
              <strong>Description:</strong>
              <p>{product.descriptions}</p>
            </DescriptionSection>
            <hr />
            {product.dossier_technique && (
              <DownloadLink
                href={product.dossier_technique}
                className='link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover'
                target="_blank"
                rel="noopener noreferrer"
              >
                Télécharger le Dossier Technique PDF
              </DownloadLink>
            )}
            {product.dossier_serigraphie && (
              <DownloadLink
                href={product.dossier_serigraphie}
                className='link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover'
                target="_blank"
                rel="noopener noreferrer"
              >
                Télécharger le Dossier de Sérigraphie
              </DownloadLink>
            )}
            {product.bon_de_commande && (
              <DownloadLink
                href={product.bon_de_commande}
                className='link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover'
                target="_blank"
                rel="noopener noreferrer"

              >
                Télécharger le Bon de Commande
              </DownloadLink>
            )}
            {product.patronage && (
              <DownloadLink
                href={product.patronage}
                className='link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover'
                target="_blank"
                rel="noopener noreferrer"
              >
                Télécharger le Patronage
              </DownloadLink>
            )}
          </ProductInfo>
        </ProductCard>
      </Container>
    </>
  );
  };

export default ProduitDetails;