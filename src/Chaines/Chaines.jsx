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

/* Loader amélioré avec effet de flottement */
const floatingAnimation = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, hsl(240, 76%, 62%), hsl(268, 47%, 44%));
  backdrop-filter: blur(10px);
`;

const Dot = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(45deg, #ff6b6b, #ff9f43);
  border-radius: 16px;
  animation: ${floatingAnimation} 2s ease-in-out infinite;
  box-shadow: 0 15px 35px rgba(255, 107, 107, 0.4);
  transform-style: preserve-3d;
  &::after {
    content: '';
    position: absolute;
    inset: -8px;
    background: linear-gradient(45deg, #ff9f43, #ff6b6b);
    filter: blur(15px);
    opacity: 0.5;
    border-radius: inherit;
  }
`;

// const LoaderMessage = styled.p`
//   color: white;
//   font-size: 1.2rem;
//   margin-top: 2rem;
//   letter-spacing: 2px;
//   text-shadow: 0 2px 4px rgba(0,0,0,0.2);
// `;

/* Cartes redimensionnées avec effet verre */
const StyledCard = styled(Card)`
  min-height: 480px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  
  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 12px 40px rgba(31, 38, 135, 0.25);
  }

  @media (min-width: 1600px) {
    min-height: 600px;
    width: 380px;
  }
`;

/* Élément de liste amélioré */
const StyledListGroupItem = styled(ListGroup.Item)`
  background: rgba(255, 255, 255, 0.7);
  border: 2px solid rgba(144, 190, 109, 0.3);
  backdrop-filter: blur(6px);
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, rgba(144, 190, 109, 0.9), rgba(67, 170, 139, 0.9));
    transform: perspective(500px) translateZ(20px);
    box-shadow: 0 10px 25px rgba(67, 170, 139, 0.3);
  }
`;

/* Image produit améliorée */
const ProductImage = styled.img`
  width: 240px;
  height: 280px;
  border-radius: 20px;
  object-fit: contain;
  padding: 15px;
  background: white;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  
  ${StyledListGroupItem}:hover & {
    transform: scale(1.05) rotate(1deg);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  }

  @media (min-width: 1600px) {
    width: 320px;
    height: 360px;
  }
`;

/* Prévisualisation hover améliorée */
const HoverCard = styled.div`
  width: 340px;
  border-radius: 24px;
  background: linear-gradient(145deg, rgba(255,255,255,0.96), rgba(245,245,245,0.98));
  box-shadow: 0 20px 50px rgba(0,0,0,0.15);
  overflow: hidden;
  transform-style: preserve-3d;
  
  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(45deg, #90be6d, #43aa8b);
    z-index: -1;
    filter: blur(20px);
  }

  img {
    height: 240px;
    object-fit: contain;
    background: linear-gradient(145deg, #f8f9fa, #ffffff);
    transition: transform 0.3s ease;
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
  color: hsl(210, 12%, 25%);
  font-family: 'Inter', sans-serif;
  text-shadow: 0 2px 4px rgba(0,0,0,0.05);
  
  @media (min-width: 1600px) {
    font-size: 1.8rem;
  }
`;

/* Conteneur principal */
const StyledContainer = styled(Container)`
  max-width: 1800px;
  padding: 3rem 5rem;
  background: rgba(248, 249, 250, 0.8);
  backdrop-filter: blur(15px);

  @media (min-width: 1600px) {
    padding: 4rem 8rem;
  }
`;

const BouncingLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* Message de mise à jour */
const UpdateMessage = styled.p`
  font-size: 1.1rem;
  padding: 12px 24px;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(6px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  animation: slideIn 0.6s ease-out;

  @keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
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
        {/* <LoaderMessage>Chargement des produits...</LoaderMessage> */}
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
              <UpdateMessage type="success">
                <CheckCircle size={24} />
                Dernière mise à jour : {formatTimestamp(lastUpdate)}
              </UpdateMessage>
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
