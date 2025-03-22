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
  const d = new Date(timestamp);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()} - ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
};

const LoaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
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
const Message = styled.p`
  margin: 0.5rem auto;
  text-align: center;
  font-weight: bold;
  color: ${({ type }) => (type === "success" ? "#2ecc71" : "#e74c3c")};
  display: flex;
  align-items: center;
  gap: 8px;
`;
const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 320px;
  border: 1px solid ${({ darkMode, chainNumber }) =>
    chainNumber === 6 ? "white" : darkMode ? "#444" : "#ddd"};
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  background-color: ${({ darkMode, chainNumber }) =>
    chainNumber === 6 ? "black" : darkMode ? "#333" : "#fff"};
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
  }
`;
const StyledListGroupItem = styled(ListGroup.Item)`
  cursor: pointer;
  transition: transform 0.3s;
  margin-bottom: 12px;
  padding: 10px;
  border: 1px solid ${({ darkMode }) => (darkMode ? "#555" : "#eee")};
  border-radius: 8px;
  background-color: ${({ darkMode }) => (darkMode ? "#444" : "#f9f9f9")};
  &:hover { transform: scale(1.03); background-color: ${({ darkMode }) => (darkMode ? "#555" : "#eee")}; }
  &:active { transform: scale(0.97); }
`;
const StyledList = styled.div`
  text-align: center;
  font-style: italic;
  color: #555;
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
  height: 80px;
  object-fit: fill;
  @media (max-width: 768px) { width: 100%; height: 210px; }
`;
const ProductStyle = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: ${({ darkMode }) => (darkMode ? "white" : "black")};
  max-width: 16ch;
  padding: 5px;
  &:hover { background-color: ${({ darkMode }) => (darkMode ? "#555" : "#f0f0f0")}; }
`;
const HoverCard = styled.div`
  position: fixed;
  left: ${({ x, chain }) => (chain === 1 ? x + 20 : x - 280)}px;
  top: ${({ y, cardHeight }) => (y + cardHeight + 20 > window.innerHeight ? y - cardHeight - 15 : y)}px;
  z-index: 1000;
  width: 260px;
  transition: all 0.3s;
  opacity: ${({ show }) => (show ? 1 : 0)};
  transform: ${({ show }) => (show ? "scale(1)" : "scale(0.95) translateY(-10px)")};
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.15));
  pointer-events: none;
`;
const ControlButton = styled(Button)`
  width: 30px;
  background: none;
  border: none;
  cursor: pointer;
  transition: opacity 0.3s;
  &:hover { opacity: 1; }
  @media (max-width: 768px) { width: 100%; height: 6vh; }
`;
const MobileRow = styled(Row)`
  @media (max-width: 768px) { flex-direction: column; gap: 1rem; }
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
      <StyledCard darkMode={darkMode} chainNumber={chainNumber}>
        <Card.Body>
          <Card.Title className="text-center fw-bold" style={{ color: chainNumber === 6 ? "white" : darkMode ? "white" : "black" }}>
            Chaine {chainNumber}
          </Card.Title>
          <ListGroup variant="flush" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, chainNumber, sortedProducts.length)}>
            {sortedProducts.map((item, index) => (
              <StyledListGroupItem
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, chainNumber, item, index)}
                onDrop={(e) => handleDrop(e, chainNumber, index)}
                onDragOver={handleDragOver}
                onClick={() => handleItemClick(item)}
                onMouseEnter={(e) => handleMouseEnter(e, item)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                darkMode={darkMode}
              >
                <ProductContainer darkMode={darkMode}>
                  <ProductImage src={item.image || NoImage} alt={item.style} darkMode={darkMode} />
                  <ProductStyle darkMode={darkMode}>{item.style}</ProductStyle>
                </ProductContainer>
              </StyledListGroupItem>
            ))}
          </ListGroup>
          <StyledList onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, chainNumber, sortedProducts.length)}>
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
    <HoverCard x={hoverPosition.x} y={hoverPosition.y} chain={chain} show={show} cardHeight={260}>
      <Card className="shadow-custom" style={{ borderRadius: "16px", overflow: "hidden", border: "2px solid #f9c74f" }}>
        <div style={{ height: "180px", background: "#eee" }}>
          <img
            src={hoveredItem.image || NoImage}
            alt={hoveredItem.style}
            style={{ width: "100%", height: "100%", objectFit: hoveredItem.image ? "cover" : "contain", objectPosition: "center", padding: hoveredItem.image ? 0 : "20px" }}
          />
        </div>
        <Card.Body style={{ padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 600, color: "#2d3436" }}>{hoveredItem.style}</h3>
            <span style={{ fontSize: "0.9rem", color: "#636e72", backgroundColor: "#f5f5f5", padding: "4px 8px", borderRadius: "4px" }}>
              Qty: {hoveredItem.qty}
            </span>
          </div>
          {hoveredItem.details && (
            <div style={{ fontSize: "0.875rem", color: "#636e72", lineHeight: 1.4, maxHeight: "100px", overflowY: "auto" }}>
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
    if (!products?.length) return [];
    const productsOrdered = products.map((p, idx) => ({ ...p, order: p.order ?? idx + 1 }));
    const sorted = productsOrdered.sort((a, b) => a.order - b.order);
    const unique = [];
    const used = new Set();
    sorted.forEach((p) => {
      let ord = p.order;
      while (used.has(ord)) ord++;
      used.add(ord);
      unique.push({ ...p, order: ord });
    });
    return unique;
  };

  const handleRefresh = (produits) => {
    setIsLoading(true);
    try {
      const grouped = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
      produits.forEach((p) => { if (grouped[p.position_id]) grouped[p.position_id].push(p); });
      Object.keys(grouped).forEach((key) => { grouped[key] = filterAndSortProducts(grouped[key]); });
      setData(grouped);
      localStorage.setItem("cachedProducts", JSON.stringify(grouped));
      const now = new Date().toISOString();
      localStorage.setItem("lastUpdate", now);
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
    const cached = localStorage.getItem("cachedProducts");
    const cachedUpdate = localStorage.getItem("lastUpdate");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setData(parsed);
        if (cachedUpdate) setLastUpdate(cachedUpdate);
        setIsLoading(false);
      } catch {
        localStorage.removeItem("cachedProducts");
        localStorage.removeItem("lastUpdate");
        handleRefresh(produits);
      }
    } else {
      handleRefresh(produits);
    }
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => { if (Object.keys(data).length) localStorage.setItem("cachedProducts", JSON.stringify(data)); }, [data]);

  const handleDragStart = (e, from, item, idx) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ from, item, index: idx }));
  };
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = async (e, target, dropIdx) => {
    e.preventDefault();
    if (isProcessing.current) return;
    isProcessing.current = true;
    const { from, item, index } = JSON.parse(e.dataTransfer.getData("text/plain"));
    const newData = { ...data };
    if (!newData[target]) newData[target] = [];
    if (!newData[from]) newData[from] = [];
    try {
      if (from === target) {
        const list = [...newData[target]];
        const [moved] = list.splice(index, 1);
        list.splice(dropIdx, 0, moved);
        newData[target] = list.map((p, i) => ({ ...p, order: i + 1 }));
      } else {
        const source = [...newData[from]];
        const targetList = [...newData[target]];
        const [moved] = source.splice(index, 1);
        if (targetList.length === 1 && targetList[0].id === `invisible-${target}`) targetList.pop();
        targetList.splice(dropIdx, 0, moved);
        newData[from] = source.map((p, i) => ({ ...p, order: i + 1 }));
        newData[target] = targetList.map((p, i) => ({ ...p, order: i + 1 }));
      }
      setData(newData);
      let updates = [];
      if (from === target) {
        newData[target].forEach((p, i) => updates.push({ produit: p, newPosition: target, newOrder: i + 1 }));
      } else {
        newData[target].forEach((p, i) => updates.push({ produit: p, newPosition: target, newOrder: i + 1 }));
        newData[from].forEach((p, i) => updates.push({ produit: p, newPosition: from, newOrder: i + 1 }));
      }
      await api.post("/update_drag", { multipleUpdates: updates }, { headers: { "Content-Type": "application/json" } });
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
  const handleMouseMove = (e) => setHoverPosition({ x: e.clientX, y: e.clientY });
  const handleMouseLeave = () => setHoveredItem(null);
  const handleItemClick = (item) => navigate(`/produit/${item.po}`, { state: { produit: item } });

  if (isLoading) {
    return (
      <LoaderContainer>
        <BouncingLoader>
          <Dot /><Dot delay="0.2s" /><Dot delay="0.4s" />
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
            <ControlButton onClick={() => setShowPosition6(!showPosition6)} />
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
      <HoverPreview hoveredItem={hoveredItem} hoverPosition={hoverPosition} chain={chain} show={!!hoveredItem} />
    </>
  );}