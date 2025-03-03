import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import api from '../services/axios';

const SwiperContainer = styled.div`
  width: 100%;
  padding: 20px 0;
  background: linear-gradient(135deg, #2575fc);
  height: 350px;

  .swiper-pagination-bullet {
    background: #333;
    opacity: 0.5;
    &-active {
      background: #007aff;
      opacity: 1;
    }
  }

  .swiper-button-prev,
  .swiper-button-next {
    color: #007aff;
    padding: 15px;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    
    &:hover {
      background: white;
      transform: scale(1.1);
    }
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  user-select: none;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  }

  h3 {
    color: #2d3436;
    margin: 10px 0;
    font-size: 1.2rem;
    text-align: center;
  }

  p {
    color: #636e72;
    font-size: 0.8rem;
    text-align: center;
    margin: 5px 0;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 10px;

  img {
    width: 90%;
    height: auto;
    object-fit: contain;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }
`;

export default function EnhancedSwiper() {
  const { id: produitId } = useParams();
  const navigate = useNavigate();
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const response = await api.get(`/produits/position/${produitId}`);
        setProduits(response.data);
      } catch (err) {
        setError('Erreur lors du chargement des produits');
      } finally {
        setLoading(false);
      }
    };

    fetchProduits();
  }, [produitId]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleCardClick = (id) => {
    navigate(`/produit/${id}`);
  };

  return (
    <SwiperContainer>
        <Swiper
            slidesPerView={'auto'}
            centeredSlides={true}
            spaceBetween={20}
            grabCursor={true}
            pagination={{
                clickable: true,
                dynamicBullets: true,
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
            breakpoints={{
                320: {
                    slidesPerView: 1,
                },
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            }}
        >
            {produits.map((produit) => (
                <SwiperSlide key={produit.id}>
                    <Card onClick={() => handleCardClick(produit.id)}>
                        <ImageContainer>
                            <img 
                                src={produit.image} 
                                alt={produit.name} 
                            />
                        </ImageContainer>
                        <h3>{produit.name}</h3>
                        <p>{produit.description}</p>
                    </Card>
                </SwiperSlide>
            ))}
        </Swiper>
    </SwiperContainer>
  );
}
