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

/* Loader amélioré avec effet de flottaison */
const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const floatingAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const Dot = styled.div`
  width: 40px;
  height: 40px;
  margin: 0 10px;
  border-radius: 50%;
  background: linear-gradient(45deg, #f9c74f, #ff9a5a);
  animation: ${floatingAnimation} 1.8s ease-in-out infinite;
  box-shadow: 0 8px 24px rgba(249, 199, 79, 0.4);
`;

/* Cartes redimensionnées pour grands écrans */
const StyledCard = styled(Card)`
  min-height: 480px;
  border: 3px solid rgba(144, 190, 109, 0.3);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.2);
  }

  @media (min-width: 1600px) {
    min-height: 600px;
    width: 380px !important;
  }
`;

/* Nouvel effet hover avec gradient */
const StyledListGroupItem = styled(ListGroup.Item)`
  border: 2px solid rgba(144, 190, 109, 0.2);
  background: white;
  margin-bottom: 16px;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #90be6d 0%, #43aa8b 100%);
    transform: scale(1.05);
    box-shadow: 0 8px 24px rgba(67, 170, 139, 0.3);
    color: white;
  }
`;

/* Images plus grandes et qualite HD */
const ProductImage = styled.img`
  width: 240px;
  height: 280px;
  border-radius: 16px;
  object-fit: contain;
  padding: 12px;
  background: white;
  transition: transform 0.3s ease;

  @media (min-width: 1600px) {
    width: 320px;
    height: 360px;
  }

  ${StyledListGroupItem}:hover & {
    transform: scale(1.08);
  }
`;

/* Preview card pour TV */
const HoverCard = styled.div`
  width: 340px;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);

  img {
    height: 240px;
    object-fit: contain;
    background: #f8f9fa;
  }

  @media (min-width: 1600px) {
    width: 420px;
    
    img {
      height: 320px;
    }
  }
`;

/* Typographie améliorée */
const ProductStyle = styled.span`
  font-size: 1.4rem;
  font-weight: 700;
  color: #2d3436;
  letter-spacing: -0.5px;
  max-width: 24ch;
  font-family: 'Inter', sans-serif;

  @media (min-width: 1600px) {
    font-size: 1.8rem;
  }
`;

/* Conteneur principal responsive */
const StyledContainer = styled(Container)`
  max-width: 1800px;
  padding: 2rem 4rem;

  @media (min-width: 1600px) {
    padding: 3rem 6rem;
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
      <StyledContainer fluid className="p-4">
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
            />
          )}
        </MobileRow>
      </StyledContainer>

      <HoverPreview
        hoveredItem={hoveredItem}
        hoverPosition={hoverPosition}
        chain={chain}
        show={!!hoveredItem}
      />
    </>
  );
}
