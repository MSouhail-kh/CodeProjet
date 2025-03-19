import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { Container, Row, Col, Card, ListGroup, Button } from "react-bootstrap";
import MyNavbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import NoImage from "../assets/No+Image.png";
import api from "../services/axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { CheckCircle } from "react-bootstrap-icons";

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
};
import styled from 'styled-components';
import { keyframes } from 'styled-components';
import { Card, ListGroup, Button, Row } from 'react-bootstrap';

/* Animations */
const pulseAnimation = keyframes`
  0% { transform: scale(0.8); opacity: 0.7; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(0.8); opacity: 0.7; }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

/* Loader Styles */
export const LoaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    width: 200vw;
    height: 200vh;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: ${floatAnimation} 4s infinite ease-in-out;
  }
`;

export const Dot = styled.div`
  width: 24px;
  height: 24px;
  margin: 0 8px;
  border-radius: 50%;
  background: linear-gradient(145deg, #ffd60a, #f9c74f);
  box-shadow: 0 4px 12px rgba(249, 199, 79, 0.3);
  animation: ${pulseAnimation} 1.4s infinite cubic-bezier(0.4, 0, 0.2, 1);
  animation-delay: ${(props) => props.delay || "0s"};
  position: relative;
  z-index: 1;
`;

export const BouncingLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
`;

/* Message Styles */
export const Message = styled.p`
  margin: 1rem auto 0;
  padding: 12px 24px;
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
  border-radius: 8px;
  background: ${({ type }) => type === "success" ? 'rgba(46, 204, 113, 0.15)' : 'rgba(231, 76, 60, 0.15)'};
  color: ${({ type }) => type === "success" ? "#27ae60" : "#c0392b"};
  display: inline-flex;
  align-items: center;
  gap: 12px;
  backdrop-filter: blur(4px);
  border: 1px solid ${({ type }) => type === "success" ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)'};
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

/* Card & List Styles */
export const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 380px;
  border: none;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 20px;
    border: 2px solid transparent;
    background: linear-gradient(45deg, #f9c74f, #ffd60a) border-box;
    mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  &:hover {
    transform: translateY(-10px) rotateZ(1deg);
    box-shadow: 0 15px 45px rgba(0, 0, 0, 0.2);
  }
`;

export const StyledListGroupItem = styled(ListGroup.Item)`
  height: 100%;
  width: 100%;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 12px;
  padding: 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  &:hover {
    background: linear-gradient(145deg, #90be6d, #7aa95c);
    box-shadow: 0 6px 16px rgba(122, 169, 92, 0.3);
    transform: translateY(-3px);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const StyledList = styled.div`
  text-align: center;
  font-style: italic;
  background: transparent;
  border: none;
  color: #555;
  min-height: 120px;
  padding: 20px;
  backdrop-filter: blur(8px);
  border-radius: 16px;

  @media (max-width: 768px) {
    min-height: 60vh;
  }
`;

/* Product Styles */
export const ProductContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
`;

export const ProductImage = styled.img`
  width: 160px;
  height: 220px;
  border-radius: 16px;
  object-fit: cover;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  filter: saturate(0.9) brightness(0.98);
  border: 2px solid transparent;

  &:hover {
    transform: scale(1.05) rotateZ(1deg);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    filter: saturate(1.1) brightness(1.02);
    border-color: #f9c74f;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 240px;
  }
`;

export const ProductStyle = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3436;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 20ch;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

/* Hover Card */
export const HoverCard = styled.div`
  position: fixed;
  left: ${({ x, chain }) => (chain === 1 ? x + 30 : x - 280 - 30)}px;
  top: ${({ y, cardHeight }) => {
    const viewportHeight = window.innerHeight;
    const calculatedBottom = y + cardHeight + 30;
    return calculatedBottom > viewportHeight ? y - cardHeight - 20 : y;
  }}px;
  z-index: 1000;
  width: 280px;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(20px);
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${({ show }) => (show ? 1 : 0)};
  transform: ${({ show }) =>
    show ? "scale(1) translateY(0)" : "scale(0.9) translateY(10px)"};

  &::before {
    content: '';
    position: absolute;
    ${({ chain }) => (chain === 1 ? 'right: -10px;' : 'left: -10px;')}
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-${({ chain }) => (chain === 1 ? 'left' : 'right')}-color: rgba(255, 255, 255, 0.96);
  }
`;

/* Controls */
export const ControlButton = styled(Button)`
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  opacity: 0.9;
  position: relative;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    background: rgba(255, 255, 255, 0.95);
  }

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
  }
`;

export const MobileRow = styled(Row)`
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    
    > * {
      width: 100%;
      margin: 0;
    }
  }
`;
const ChainColumn = ({
  chainNumber,
  products,
  handleDragOver,
  handleDrop,
  handleDragStart,
  handleItemClick,
  handleMouseEnter,
  handleMouseMove,
  handleMouseLeave,
  filterAndSortProducts,
  darkMode = false,
}) => {
  const sortedProducts = filterAndSortProducts(products, chainNumber);
  return (
    <Col xs={12} sm={6} md={2}>
      <StyledCard className={darkMode ? "bg-dark text-white" : ""}>
        <Card.Body>
          <Card.Title className="text-center fw-bold">
            Chaine {chainNumber}
          </Card.Title>
          <ListGroup
            variant="flush"
            onDragOver={handleDragOver}
            onDrop={(e) =>
              handleDrop(e, chainNumber, sortedProducts.length)
            }
          >
            {sortedProducts.length === 0 ? (
              <StyledList>
                <br />
                <br />
              </StyledList>
            ) : (
              sortedProducts.map((item, index) => (
                <StyledListGroupItem
                  key={item.id}
                  draggable
                  onDragStart={(e) =>
                    handleDragStart(e, chainNumber, item, index)
                  }
                  onDrop={(e) => handleDrop(e, chainNumber, index)}
                  onDragOver={handleDragOver}
                  onClick={() => handleItemClick(item)}
                  onMouseEnter={(e) => handleMouseEnter(e, item)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <ProductContainer>
                    <ProductImage src={item.image || NoImage} alt={item.style} />
                    <ProductStyle>{item.style}</ProductStyle>
                  </ProductContainer>
                </StyledListGroupItem>
              ))
            )}
          </ListGroup>
        </Card.Body>
      </StyledCard>
    </Col>
  );
};

const HoverPreview = ({ hoveredItem, hoverPosition, chain, show }) => {
  if (!hoveredItem) return null;
  return (
    <HoverCard
      x={hoverPosition.x}
      y={hoverPosition.y}
      chain={chain}
      show={show}
      cardHeight={260}
    >
      <Card
        className="shadow-custom"
        style={{
          borderRadius: "16px",
          overflow: "hidden",
          border: "2px solid #f9c74f",
        }}
      >
        <div
          style={{
            position: "relative",
            height: "180px",
            background: "#eee",
          }}
        >
          <img
            src={hoveredItem.image || NoImage}
            alt={hoveredItem.style}
            style={{
              width: "100%",
              height: "100%",
              objectFit: hoveredItem.image ? "cover" : "contain",
              objectPosition: "center",
              padding: hoveredItem.image ? 0 : "20px",
            }}
          />
        </div>
        <Card.Body style={{ padding: "16px", position: "relative" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: "8px",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "1.2rem",
                fontWeight: 600,
                color: "#2d3436",
              }}
            >
              {hoveredItem.style}
            </h3>
            <span
              style={{
                fontSize: "0.9rem",
                color: "#636e72",
                backgroundColor: "#f5f5f5",
                padding: "4px 8px",
                borderRadius: "4px",
              }}
            >
              Qty: {hoveredItem.qty}
            </span>
          </div>
          {hoveredItem.details && (
            <div
              style={{
                fontSize: "0.875rem",
                color: "#636e72",
                lineHeight: 1.4,
                maxHeight: "100px",
                overflowY: "auto",
              }}
            >
              {hoveredItem.details}
            </div>
          )}
        </Card.Body>
      </Card>
    </HoverCard>
  );
};

export default function Chaines({ produits = [] }) {
  const [showPosition6, setShowPosition6] = useState(true);
  const [data, setData] = useState({});
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [chain, setChain] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  const isMounted = useRef(false);
  const isProcessing = useRef(false);
  const navigate = useNavigate();

  const filterAndSortProducts = (products) => {
    if (!products || products.length === 0) return [];
    const productsWithDefaultOrder = products.map((product, index) => ({
      ...product,
      order:
        product.order !== undefined && product.order !== null
          ? product.order
          : index + 1,
    }));
    const sortedProducts = productsWithDefaultOrder.sort(
      (a, b) => a.order - b.order
    );
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

      Object.keys(groupedData).forEach((key) => {
        groupedData[key] = filterAndSortProducts(groupedData[key], key);
      });

      setData(groupedData);
      localStorage.setItem("cachedProducts", JSON.stringify(groupedData));
      // Enregistrement de la date de dernière mise à jour
      const now = new Date().toISOString();
      localStorage.setItem("lastUpdate", JSON.stringify(now));
      setLastUpdate(now);
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
    const cachedData = localStorage.getItem("cachedProducts");
    const cachedUpdate = localStorage.getItem("lastUpdate");
    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        setData(parsedData);
        if (cachedUpdate) {
          setLastUpdate(JSON.parse(cachedUpdate));
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur de parsing du cache:", error);
        localStorage.removeItem("cachedProducts");
        handleRefresh(produits);
      }
    } else {
      handleRefresh(produits);
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (Object.keys(data).length) {
      localStorage.setItem("cachedProducts", JSON.stringify(data));
      const now = new Date().toISOString();
      localStorage.setItem("lastUpdate", JSON.stringify(now));
      setLastUpdate(now);
    }
  }, [data]);

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
    const newData = { ...data };
    if (!newData[targetPosition]) newData[targetPosition] = [];
    if (!newData[transferData.from]) newData[transferData.from] = [];

    try {
      if (transferData.from === targetPosition) {
        const list = [...newData[targetPosition]];
        const [movedItem] = list.splice(transferData.index, 1);
        list.splice(dropIndex, 0, movedItem);
        newData[targetPosition] = list.map((item, index) => ({
          ...item,
          order: index + 1,
        }));
      } else {
        const sourceList = [...newData[transferData.from]];
        const targetList = [...newData[targetPosition]];
        const [movedItem] = sourceList.splice(transferData.index, 1);
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

      setData(newData);

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
    setChain(item.position_id);
  };

  const handleMouseMove = (e) => {
    setHoverPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const handleItemClick = (item) => {
    navigate(`/produit/${item.po}`, { state: { produit: item } });
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
        <Row className="mb-3">
          <Col className="text-end">
            {lastUpdate && (
              <Message type="success">
                <CheckCircle size={20} />
                  Dernière mise à jour : {formatTimestamp(lastUpdate)}
              </Message>
            )}
          </Col>
        </Row>
        <MobileRow className="g-1 flex-nowrap justify-content-center align-items-stretch">
          {[1, 2, 3, 4, 5].map((num) => (
            <ChainColumn
              key={num}
              chainNumber={num}
              products={data[num]}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
              handleDragStart={handleDragStart}
              handleItemClick={handleItemClick}
              handleMouseEnter={handleMouseEnter}
              handleMouseMove={handleMouseMove}
              handleMouseLeave={handleMouseLeave}
              filterAndSortProducts={filterAndSortProducts}
            />
          ))}
          <Col md="auto" className="d-flex align-items-center">
            <ControlButton
              variant="outline-light"
              onClick={() => setShowPosition6(!showPosition6)}
            />
          </Col>
          {showPosition6 && (
            <ChainColumn
              chainNumber={6}
              products={data[6]}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
              handleDragStart={handleDragStart}
              handleItemClick={handleItemClick}
              handleMouseEnter={handleMouseEnter}
              handleMouseMove={handleMouseMove}
              handleMouseLeave={handleMouseLeave}
              filterAndSortProducts={filterAndSortProducts}
              darkMode
              style={{ color: 'white' }}
              />
          )}
        </MobileRow>
      </Container>

      <HoverPreview
        hoveredItem={hoveredItem}
        hoverPosition={hoverPosition}
        chain={chain}
        show={!!hoveredItem}
      />
    </>
  );
}