import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { Container, Row, Col, Card, ListGroup, Button } from "react-bootstrap";
import MyNavbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import DeleteButton from "./DeleteButton";
import NoImage from "../assets/No+Image.png";
import api from "../services/axios";
import "bootstrap/dist/css/bootstrap.min.css";

/* Loader Styles */
const LoaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background: rgba(255, 255, 255, 0.8);
`;

const pulseAnimation = keyframes`
  0% { transform: scale(0.8); opacity: 0.7; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(0.8); opacity: 0.7; }
`;

const Dot = styled.div`
  width: 20px;
  height: 20px;
  margin: 0 5px;
  border-radius: 50%;
  background-color: #007bff;
  animation: ${pulseAnimation} 1.4s infinite ease-in-out;
  animation-delay: ${(props) => props.delay || "0s"};
`;

const BouncingLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* Card & List Styles */
const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  min-height: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  border-radius: 12px;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const StyledListGroupItem = styled(ListGroup.Item)`
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s, box-shadow 0.2s;
  border-radius: 5px;
  margin-bottom: 10px;
  border: 1px solid;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
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
  min-height: 100px;

  @media (max-width: 768px) {
    min-height: 50vh;
  }
`;

/* Product Styles */
const ProductContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 10px;
`;

const ProductImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProductStyle = styled.span`
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 15ch;
`;

/* Hover Preview Card */
const HoverCard = styled.div`
  position: fixed;
  left: ${({ x, chain }) => (chain === 1 ? x + 15 : x - 240 - 15)}px;
  top: ${({ y, cardHeight }) => {
    const viewportHeight = window.innerHeight;
    const calculatedBottom = y + cardHeight + 20;
    return calculatedBottom > viewportHeight ? y - cardHeight - 10 : y;
  }}px;
  z-index: 900;
  width: 240px;
  transition: all 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  opacity: ${({ show }) => (show ? 1 : 0)};
  transform: ${({ show }) =>
    show ? "scale(1) translateY(0)" : "scale(0.95) translateY(-15px)"};
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.12));
  pointer-events: none;
`;

/* Control Button & Layout */
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

  @media (max-width: 768px) {
    width: 100%;
    height: 5vh;
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
      <StyledCard className={darkMode ? "bg-dark text-white" : ""}>
        <Card.Body>
          <Card.Title className="text-center fw-bold">
            Chaine {chainNumber}
          </Card.Title>
          <ListGroup
            variant="secondary"
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
                    <ProductImage src={item.image} alt={item.style} />
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

/** HoverPreview shows a dynamic card when hovering over a product */
const HoverPreview = ({ hoveredItem, hoverPosition, chain, show }) => {
  if (!hoveredItem) return null;
  return (
    <HoverCard
      x={hoverPosition.x}
      y={hoverPosition.y}
      chain={chain}
      show={show}
      cardHeight={240}
    >
      <Card
        className="shadow-custom"
        style={{
          borderRadius: "12px",
          overflow: "hidden",
          border: "none",
        }}
      >
        <div
          style={{
            position: "relative",
            height: "160px",
            backgroundColor: "#f5f5f5",
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
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "#2d3436",
              }}
            >
              {hoveredItem.style}/{hoveredItem.order}
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

export default function Chaines() {
  const [showPosition6, setShowPosition6] = useState(true);
  const [data, setData] = useState({});
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [chain, setChain] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isMounted = useRef(true);
  const isProcessing = useRef(false);
  const navigate = useNavigate();

  const filterAndSortProducts = (products, positionId) => {
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

      // Prepare payload for the update API call
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

  /** Mouse event handlers for the hover preview */
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

  /** Navigate to the product detail page */
  const handleItemClick = (item) => {
    navigate(`/produit/${item.id}`, { state: { produit: item } });
  };

  /** Update state after a successful deletion */
  const handleDeleteSuccess = (deletedItem) => {
    setData((prevData) => {
      const newData = { ...prevData };
      Object.keys(newData).forEach((key) => {
        newData[key] = newData[key]
          .filter((produit) => produit.id !== deletedItem.id)
          .map((item, index) => ({ ...item, order: index + 1 }));
      });
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
      </Container>

      <Col md="auto" className="d-flex align-items-center justify-content-end p-4 m-auto">
        <DeleteButton onDeleteSuccess={handleDeleteSuccess} />
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
