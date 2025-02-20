import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled , {keyframes} from 'styled-components';
import { useParams } from 'react-router-dom';
import MyNavbar from '../Navbar/Navbar';


const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
`;

const pulseAnimation = keyframes`
  0% { transform: scale(0.8); opacity: 0.7; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(0.8); opacity: 0.7; }
`;

const BouncingLoader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Dot = styled.div`
  width: 20px;
  height: 20px;
  margin: 0 5px;
  border-radius: 50%;
  background-color: #007bff; // Couleur bleue (peut être modifiée)
  animation: ${pulseAnimation} 1.4s infinite ease-in-out;
  animation-delay: ${(props) => props.delay || "0s"};

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.4s;
  }
`;

const Container = styled.div`
  max-width: 100%;
  margin: 1rem auto;
  padding: 1rem;
  font-family: 'Arial', sans-serif;
`;

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

const ImageWrapper = styled.div`
  flex: 1;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

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

const ProductInfo = styled.div`
  flex: 2;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TitleSection = styled.div`
  margin-bottom: 1rem;
`;

const ProductTitle = styled.h1`
  font-size: 2rem;
  color: #333;
  margin: 0;
  font-weight: 700;
`;

const ProductSubtitle = styled.h2`
  font-size: 1.5rem;
  color: #777;
  margin: 0.3rem 0;
  font-weight: 400;
`;

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

const Dates = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const DateLabel = styled.div`
  font-size: 0.85rem;
  color: #555;
  background: #f8f8f8;
  padding: 0.5rem;
  border-radius: 8px;
  flex: 1;
`;

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

const DownloadLink = styled.a`
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  width: 40%;
`;

const ProduitDetails = () => {
  const { id } = useParams();
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
    return (
      <LoaderContainer>
        <BouncingLoader>
          <Dot />
          <Dot delay="0.2s" />
          <Dot delay="0.4s" />
        </BouncingLoader>
      </LoaderContainer>
    );
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
                <Coloris>Color : <ColorCircle customColor={product.coloris} /> </Coloris>
              </ProductSubtitle>
            </TitleSection>
            <Dates>
              <DateLabel>
                <strong>Date de Réception:</strong>
                <br />
                {product.date_reception_bon_commande}
              </DateLabel>
              <DateLabel>
                <strong>Date de Livraison:</strong>
                <br />
                {product.date_livraison_commande}
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