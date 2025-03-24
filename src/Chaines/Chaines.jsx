import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { Container, Row, Col, Card, ListGroup, Button } from "react-bootstrap";
import MyNavbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import NoImage from "../assets/No+Image.png";
import api from "../services/axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { CheckCircle } from "react-bootstrap-icons";
import RefreshButton from "./RefreshButtons";
import Refresh from "./Refresh"; 

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

const LoaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background: transparent !important;
`;

const pulseAnimation = keyframes`
  0% { transform: scale(0.8); opacity: 0.7; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(0.8); opacity: 0.7; }
`;

const Dot = styled.div`
  width: 24px;
  height: 24px;
  margin: 0 6px;
  border-radius: 50%;
  background-color: #f9c74f;
  animation: ${pulseAnimation} 1.4s infinite ease-in-out;
  animation-delay: ${(props) => props.delay || "0s"};
`;

const BouncingLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* Message Styles */
const Message = styled.p`
  margin: 0.5rem auto 0;
  text-align: center;
  font-weight: bold;
  color: ${({ type }) => (type === "success" ? "#2ecc71" : "#e74c3c")};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;
const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  min-height: 320px;
  border: 1px solid ${({ darkMode, chainNumber }) =>
    chainNumber === 6 ? "white" : darkMode ? "#444" : "#ddd"};
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: ${({ darkMode, chainNumber }) =>
    chainNumber === 6 ? "black" : darkMode ? "#333" : "#fff"};

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
  }
`;

const StyledListGroupItem = styled(ListGroup.Item)`
  height: 100%;
  width: 100%;  
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 12px;
  padding: 3px;
  border: 1px solid ${({ darkMode }) => (darkMode ? "#555" : "#eee")};
  border-radius: 8px;
  background-color: ${({ darkMode }) => (darkMode ? "#444" : "transparent !important")};

  &:hover {
    color: #fff;
    transform: scale(1.03);
    background-color: ${({ darkMode }) => (darkMode ? "#555" : "#eee")};
  }

  &:active {
    transform: scale(0.97);
  }
`;

const StyledList = styled.div`
  text-align: center;
  font-style: italic;
  background: transparent;
  border: none;
  color: #555;
  height: 100%;

  @media (max-width: 768px) {
    height: 100%;
  }
`;
const ProductContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    border-color: ${({ darkMode }) => (darkMode ? "#888" : "#ccc")};
    background-color: ${({ darkMode }) => (darkMode ? "#555" : "#eee")};
  }
`;

const ProductImage = styled.img`
  width: 150px;
  height: 65px;
  object-fit: scale-down;

  @media (max-width: 768px) {
    width: 100%;
    height: 120px;
  }
`;

const ProductStyle = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: ${({ darkMode }) => (darkMode ? "white" : "black")};
  max-width: 16ch;

  &:hover {
    background-color: ${({ darkMode }) => (darkMode ? "#555" : "#f0f0f0")};
  }
`;
const HoverCard = styled.div`
  position: fixed;
  left: ${({ x, chain }) => (chain === 1 ? x + 20 : x - 310 - 20)}px; /* Réduit la largeur */
  top: ${({ y, cardHeight }) => {
    const viewportHeight = window.innerHeight;
    const calculatedBottom = y + cardHeight + 10; /* Réduit la hauteur */
    return calculatedBottom > viewportHeight ? y - cardHeight - 25 : y;
  }}px;
  z-index: 1050; /* Plus haut pour éviter les conflits */
  width: 310px; /* Réduit la largeur */
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  opacity: ${({ show }) => (show ? 1 : 0)};
  transform: ${({ show }) =>
    show ? "scale(1.05) translateY(0)" : "scale(0.95) translateY(-10px)"};
  filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.2));
  pointer-events: none;
  background-color: white; /* Ajout d'un fond blanc */
  border-radius: 16px; /* Coins arrondis */
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
`;

const ControlButton = styled(Button)`
  width: 30px;
  height: 100%;
  background: none;
  border: none;
  opacity: 0.9;
  background-color: transparent;
  position: relative;
  cursor: pointer;
  border-radius: 0;
  transition: all 0.3s ease;

  &:hover {
    background-color: transparent;
    opacity: 1;
  }

  &:focus {
    outline: none;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 6vh;
  }
`;

const MobileRow = styled(Row)`
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
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
      <StyledCard darkMode={darkMode}>
        <Card.Body>
          <Card.Title
            className="text-center fw-bold"
            style={{ color: chainNumber === 6 ? "white" : darkMode ? "white" : "black" }}
          >
            Chaine {chainNumber}
          </Card.Title>
          <ListGroup
            variant="flush"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, chainNumber, sortedProducts.length)}
          >
            {sortedProducts.map((item, index) => (
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
                darkMode={darkMode}
              >
                <ProductContainer darkMode={darkMode}>
                  <ProductImage
                    src={item.image || NoImage}
                    alt={item.style}
                    darkMode={darkMode}
                  />
                  <ProductStyle darkMode={darkMode}>
                    {item.style}
                  </ProductStyle>
                </ProductContainer>
              </StyledListGroupItem>
            ))}
          </ListGroup>
          <StyledList
            className="bg-transparent"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, chainNumber, sortedProducts.length)}
          >
            <ProductContainer darkMode={darkMode} />
          </StyledList>
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
      cardHeight={320} /* Augmenté la hauteur */
    >
      <Card
        className="shadow-lg"
        style={{
          borderRadius: "16px",
          overflow: "hidden",
          border: "2px solid #f9c74f",
        }}
      >
        <div
          style={{
            position: "relative",
            height: "220px", /* Augmenté la hauteur de l'image */
            background: "#f5f5f5",
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
        <Card.Body style={{ padding: "20px", position: "relative" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: "12px",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "1.4rem",
                fontWeight: 700,
                color: "#2d3436",
              }}
            >
              {hoveredItem.style}
            </h3>
            <span
              style={{
                fontSize: "1rem",
                color: "#636e72",
                backgroundColor: "#f5f5f5",
                padding: "6px 12px",
                borderRadius: "8px",
              }}
            >
              Qty: {hoveredItem.qty}
            </span>
          </div>
          {hoveredItem.details && (
            <div
              style={{
                fontSize: "1rem",
                color: "#636e72",
                lineHeight: 1.6,
                maxHeight: "120px",
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
      const now = new Date().toISOString();
      localStorage.setItem("lastUpdate", now); // Save lastUpdate in localStorage
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
    const cachedLastUpdate = localStorage.getItem("lastUpdate");
    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        setData(parsedData);
        if (cachedLastUpdate) {
          setLastUpdate(cachedLastUpdate);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur de parsing du cache:", error);
        localStorage.removeItem("cachedProducts");
        localStorage.removeItem("lastUpdate");
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
      <Container fluid className="p-4">
      <Row className="d-flex align-items-center justify-content-between p-2">
        <Col className="d-flex align-items-center gap-3 p-1">
          {lastUpdate && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontWeight: "bold",
                color: "#2ecc71",
                fontSize: "18px",
                padding: "15px 20px",
              }}
            >
              <CheckCircle size={24} />
              Dernière mise à jour : {formatTimestamp(lastUpdate)}
            
            </div>

          )}
        </Col>

        <Col className="d-flex justify-content-end">
          <Refresh onRefresh={handleRefresh} />
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
            />
          )}
        </MobileRow>
      </Container>
      
      <Col
        md="auto"
        className="d-flex align-items-center justify-content-end p-3 ">
              <RefreshButton onRefresh={handleRefresh} />
      </Col>
        
      <HoverPreview
        hoveredItem={hoveredItem}
        hoverPosition={hoverPosition}
        chain={chain}
        show={!!hoveredItem}
      />
    </>
  );
}