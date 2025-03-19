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

const LoaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  animation: gradientAnimation 10s ease infinite;

  @keyframes gradientAnimation {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
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
  box-shadow: 0 0 12px rgba(249, 199, 79, 0.8);
`;

const BouncingLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Message = styled.p`
  margin: 0.5rem auto 0;
  text-align: center;
  font-weight: bold;
  color: ${({ type }) => (type === "success" ? "#2ecc71" : "#e74c3c")};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  transition: opacity 0.3s ease;

  &::before {
    content: ${({ type }) => (type === "success" ? "'\\2713'" : "'\\26A0'")};
    font-size: 1.2em;
  }
`;
const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  min-height: 340px;
  border: none;
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: ${({ darkMode }) =>
    darkMode
      ? "linear-gradient(135deg, #2c3e50, #34495e)"
      : "linear-gradient(135deg, #ffffff, #f8f9fa)"};
  color: ${({ darkMode }) => (darkMode ? "white" : "black")};
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  }
`;

const StyledListGroupItem = styled(ListGroup.Item)`
  cursor: pointer;
  height: 100%;
  transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 12px;
  margin-bottom: 12px;
  border: 2px solid ${({ darkMode }) => (darkMode ? "#34495e" : "#e0e0e0")};
  background: ${({ darkMode }) =>
    darkMode
      ? "linear-gradient(135deg, #2c3e50, #34495e)" // Fond sombre pour la chaîne 6
      : "linear-gradient(135deg, #f9f9f9, #ffffff)"};
  color: ${({ darkMode }) => (darkMode ? "white" : "black")}; // Texte blanc pour le mode sombre
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background: ${({ darkMode }) =>
      darkMode
        ? "linear-gradient(135deg, #6a11cb, #2575fc)" // Couleur de survol pour le mode sombre
        : "linear-gradient(135deg, #6a11cb, #2575fc)"};
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(0.98);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const StyledList = styled.div`
  text-align: center;
  font-style: italic;
  background: transparent;
  border: none;
  color: #555;
  min-height: 120px;

  @media (max-width: 768px) {
    min-height: 60vh;
  }
`;

const ProductContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 10px;
`;
const ProductImage = styled.img`
  width: 150px;
  height: 200px;
  border-radius: 12px;
  object-fit: cover;
  border: 2px solid rgba(249, 199, 79, 0.3);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 210px;
  }
`;

const ProductStyle = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 16ch;
`;

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

const ControlButton = styled(Button)`
  width: 30px;
  height: 100%;
  background: transparent;
  position: relative;
  cursor: pointer;
  &:hover {
    background-color: transparent;
  }
  @media (max-width: 768px) {
    width: 100%;
    height: 6vh;
  }
`;
const MobileRow = styled(Row)`
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    padding: 0 1rem;
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
  darkMode = true,
}) => {
  const sortedProducts = filterAndSortProducts(products, chainNumber);
  return (
    <Col xs={12} sm={6} md={2}>
      <StyledCard darkMode={darkMode}>
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
                  darkMode={darkMode}
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
              onClick={() => setShowPosition6(!showPosition6)}
            />
          </Col>
          {showPosition6 && (
            <ChainColumn
              className='text-light '
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

      <HoverPreview
        hoveredItem={hoveredItem}
        hoverPosition={hoverPosition}
        chain={chain}
        show={!!hoveredItem}
      />
    </>
  );
}