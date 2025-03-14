import { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { Container, Row, Col, Card, ListGroup, Button, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import MyNavbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import DeleteButton from "./DeleteButton";
import NoImage from "../assets/No+Image.png";
import api from "../services/axios";

// Loader et animation
const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background: rgba(255, 255, 255, 0.8);
`;

const pulseAnimation = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.7;
  }
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
  background-color: #007bff;
  animation: ${pulseAnimation} 1.4s infinite ease-in-out;
  animation-delay: ${({ delay }) => delay || "0s"};
`;
const StyledCard = styled(Card)`
  height: 100%;
  min-height: 300px; // Hauteur minimale
  max-height: 600px; // Hauteur maximale
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const CardBody = styled(Card.Body)`
  flex-grow: 1; // Le corps de la carte s'adapte au contenu
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled(Card.Title)`
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: bold;
  text-align: center;
`;

const StyledListGroup = styled(ListGroup)`
  flex-grow: 1; // La liste s'adapte à l'espace disponible
  overflow-y: auto; // Ajout d'une barre de défilement si nécessaire
`;

const StyledListGroupItem = styled(ListGroup.Item)`
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s, box-shadow 0.2s;
  border-radius: 5px;
  margin-bottom: 10px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: linear-gradient(135deg, #2575fc, #6a11cb);
    color: white;
    transform: scale(1.02);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const StyledList = styled.div`
  text-align: center;
  font-style: italic;
  background: transparent;
  border: none;
  color: #888;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ProductContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`;

const ProductStyle = styled.span`
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 15ch;
  display: inline-block;
`;

const HoverCard = styled.div`
  position: fixed;
  left: ${({ x, chaine }) => (chaine === 1 ? `${x + 15}px` : `${x - 240 - 15}px`)};
  top: ${({ y, cardHeight }) => {
    const viewportHeight = window.innerHeight;
    const calculatedBottom = y + cardHeight + 20;
    return calculatedBottom > viewportHeight ? `${y - cardHeight - 10}px` : `${y}px`;
  }};
  z-index: 900;
  width: 240px;
  transition: all 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  opacity: ${({ show }) => (show ? 1 : 0)};
  transform: ${({ show }) =>
    show ? "scale(1) translateY(0)" : "scale(0.95) translateY(-15px)"};
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.12));
  pointer-events: none;
`;

const ControlButton = styled(Button)`
  width: 25px;
  height: 100vh;
  background: none;
  border: none;
  opacity: 0;
  position: relative;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;

const MobileRow = styled(Row)`
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export default function Chaines() {
  const [showPosition6, setShowPosition6] = useState(true);
  const [data, setData] = useState({});
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [chaine, setChaine] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);
  const isProcessing = useRef(false);
  const navigate = useNavigate();
  const filterAndSortProducts = (products, positionId) => {
    if (!products || products.length === 0) return [];  
    const productsWithDefaultOrder = products.map((product, index) => ({
      ...product,
      order: product.order !== undefined && product.order !== null ? product.order : index + 1,
    }));
  
    const sortedProducts = productsWithDefaultOrder.sort((a, b) => a.order - b.order);  
    const uniqueOrderProducts = [];
    const usedOrders = new Set();
  
    for (const product of sortedProducts) {
      let order = product.order;
      while (usedOrders.has(order)) {
        order++;
      }
      usedOrders.add(order);
      uniqueOrderProducts.push({ ...product, order });
    }
    return uniqueOrderProducts;
  };

  const handleRefresh = (produits) => {
    setIsLoading(true);
    try {
      const groupedData = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
      produits.forEach((produit) => {
        if (groupedData[produit.position_id]) {
          groupedData[produit.position_id].push(produit);
        }
      });

      for (const key in groupedData) {
        groupedData[key] = filterAndSortProducts(groupedData[key], key);
      }

      setData(groupedData);
      setError(null);
    } catch (err) {
      console.error("Erreur :", err);
      setError("Échec de la récupération des données.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isMounted.current = true;
    handleRefresh([]); 
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleDragStart = (e, sourcePosition, item, index) => {
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ from: sourcePosition, item, index })
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = async (e, targetPosition, dropIndex) => {
    e.preventDefault();
    if (isProcessing.current) return;
    isProcessing.current = true;
  
    const transferData = JSON.parse(e.dataTransfer.getData("text/plain"));
    
    // On récupère l'état courant et on s'assure que les clés existent
    const newData = { ...data };
    if (!newData[targetPosition]) newData[targetPosition] = [];
    if (!newData[transferData.from]) newData[transferData.from] = [];
  
    try {
      if (transferData.from === targetPosition) {
        // Déplacement dans la même chaîne
        const list = [...newData[targetPosition]];
        const [movedItem] = list.splice(transferData.index, 1);
        list.splice(dropIndex, 0, movedItem);
        newData[targetPosition] = list.map((item, index) => ({
          ...item,
          order: index + 1,
        }));
      } else {
        // Déplacement entre deux chaînes
        const sourceList = [...newData[transferData.from]];
        const targetList = [...newData[targetPosition]];
        const [movedItem] = sourceList.splice(transferData.index, 1);
  
        // Suppression éventuelle de l'élément "invisible" dans la chaîne cible
        if (
          targetList.length === 1 &&
          targetList[0].id === `invisible-${targetPosition}`
        ) {
          targetList.pop();
        }
  
        targetList.splice(dropIndex, 0, movedItem);
        newData[transferData.from] = sourceList.map((item, index) => ({
          ...item,
          order: index + 1,
        }));
        newData[targetPosition] = targetList.map((item, index) => ({
          ...item,
          order: index + 1,
        }));
      }
  
      // Mise à jour de l'état
      setData(newData);
  
      // Construction du payload avec la mise à jour de tous les produits de la chaîne concernée
      let updates = [];
      if (transferData.from === targetPosition) {
        newData[targetPosition].forEach((item, index) => {
          updates.push({
            produit: item,
            newPosition: targetPosition,
            newOrder: index + 1,
          });
        });
      } else {
        newData[targetPosition].forEach((item, index) => {
          updates.push({
            produit: item,
            newPosition: targetPosition,
            newOrder: index + 1,
          });
        });
        newData[transferData.from].forEach((item, index) => {
          updates.push({
            produit: item,
            newPosition: transferData.from,
            newOrder: index + 1,
          });
        });
      }
  
      const dragPayload = { multipleUpdates: updates };
  
      await api.post("/update_drag", dragPayload, {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Erreur lors du déplacement :", err);
      setError("Erreur lors du déplacement - Veuillez réessayer");
    } finally {
      isProcessing.current = false;
    }
  };
  
  const handleMouseEnter = (e, item) => {
    setHoveredItem(item);
    setHoverPosition({ x: e.clientX, y: e.clientY });
    setChaine(item.position_id);
  };

  const handleMouseMove = (e) => {
    setHoverPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const handleItemClick = (item) => {
    navigate(`/produit/${item.id}`, { state: { produit: item } });
  };

  const handleDeleteSuccess = (deletedItem) => {
    setData((prevData) => {
      const newData = { ...prevData };
      for (const key in newData) {
        newData[key] = newData[key]
          .filter((produit) => produit.id !== deletedItem.id)
          .map((item, index) => ({
            ...item,
            order: index + 1,
          }));
      }
      return newData;
    });
  };

  if (isLoading) {
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

  return (
    <>
      <MyNavbar onRefresh={handleRefresh} />
      <Container fluid className="p-4">
        <MobileRow className="g-1 flex-nowrap justify-content-center align-items-stretch">
          {[1, 2, 3, 4, 5].map((num) => (
            <Col key={num} xs={12} sm={6} md={2}>
              <StyledCard>
                <CardBody>
                  <CardTitle>Chaine {num}</CardTitle>
                  <StyledListGroup
                    variant="secondary"
                    onDragOver={handleDragOver}
                    onDrop={(e) =>
                      handleDrop(e, num, filterAndSortProducts(data[num], num).length)
                    }
                  >
                    {filterAndSortProducts(data[num], num).length === 0 ? (
                      <StyledList>
                        <br />
                        <br />
                      </StyledList>
                    ) : (
                      filterAndSortProducts(data[num], num).map((item, index) => (
                        <StyledListGroupItem
                          key={item.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, num, item, index)}
                          onDrop={(e) => handleDrop(e, num, index)}
                          onDragOver={handleDragOver}
                          onClick={() => handleItemClick(item)}
                          onMouseEnter={(e) => handleMouseEnter(e, item)}
                          onMouseMove={handleMouseMove}
                          onMouseLeave={handleMouseLeave}
                        >
                          <ProductContainer>
                            <ProductStyle>{item.style}</ProductStyle>
                          </ProductContainer>
                        </StyledListGroupItem>
                      ))
                    )}
                  </StyledListGroup>
                </CardBody>
              </StyledCard>
            </Col>
          ))}
  
          <Col md="auto" className="d-flex align-items-center">
            <ControlButton
              variant="outline-light"
              onClick={() => {
                setShowPosition6(!showPosition6);
              }}
            />
          </Col>
  
          {showPosition6 && (
            <Col xs={12} sm={6} md={2}>
              <StyledCard className="bg-dark text-white">
                <CardBody>
                  <CardTitle>Chaine 6</CardTitle>
                  <StyledListGroup
                    variant="flush"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 6, filterAndSortProducts(data[6], 6).length)}
                  >
                    {filterAndSortProducts(data[6], 6).length === 0 ? (
                      <StyledList>
                        <br />
                        <br />
                      </StyledList>
                    ) : (
                      filterAndSortProducts(data[6], 6).map((item, index) => (
                        <StyledListGroupItem
                          key={item.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, 6, item, index)}
                          onDrop={(e) => handleDrop(e, 6, index)}
                          onDragOver={handleDragOver}
                          onClick={() => handleItemClick(item)}
                          onMouseEnter={(e) => handleMouseEnter(e, item)}
                          onMouseMove={handleMouseMove}
                          onMouseLeave={handleMouseLeave}
                          className="bg-secondary text-white"
                        >
                          <ProductContainer>
                            <ProductStyle>{item.style}</ProductStyle>
                          </ProductContainer>
                        </StyledListGroupItem>
                      ))
                    )}
                  </StyledListGroup>
                </CardBody>
              </StyledCard>
            </Col>
          )}
        </MobileRow>
      </Container>
    </>
  );
}