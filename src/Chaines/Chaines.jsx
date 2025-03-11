
import { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { Container, Row, Col, Card, ListGroup, Button, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import MyNavbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import DeleteButton from "./DeleteButton";
import NoImage from "../assets/No+Image.png";
import api from "../services/axios";

// Styles
const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background: rgba(255, 255, 255, 0.8);
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
  background-color: #007bff;
  animation: ${pulseAnimation} 1.4s infinite ease-in-out;
  animation-delay: ${(props) => props.delay || "0s"};
`;

const StyledCard = styled(Card)`
  height: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const StyledListGroupItem = styled(ListGroup.Item)`
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;

  &:hover {
    background: linear-gradient(135deg, #2575fc, #6a11cb);
    color: white;
    transform: scale(1.02);
  }
`;

const SyncStatus = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const HoverCard = styled.div`
  position: fixed;
  left: ${({ x, chaine }) => (chaine === 1 ? x + 15 : x - 240 - 15)}px;
  top: ${({ y, cardHeight }) => {
    const viewportHeight = window.innerHeight;
    const calculatedBottom = y + cardHeight + 20;
    return calculatedBottom > viewportHeight ? y - cardHeight - 10 : y;
  }}px;
  z-index: 900;
  width: 240px;
  transition: all 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  opacity: ${({ show }) => (show ? 1 : 0)};
  transform: ${({ show }) => show ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-15px)'};
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.12));
  pointer-events: none;
`;

const ControlButton = styled(Button)`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #007bff;
  color: white;
  border: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
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
  const navigate = useNavigate();

  const filterAndSortProducts = (products) => {
    if (!products) return [];
    return products
      .filter((product) => product.order !== undefined && product.order !== null)
      .sort((a, b) => a.order - b.order);
  };

  useEffect(() => {
    isMounted.current = true;
    fetchData();
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/produits");
      const produits = Object.values(response.data);

      const groupedData = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
      produits.forEach((produit) => {
        if (groupedData[produit.position_id]) {
          groupedData[produit.position_id].push(produit);
        }
      });

      if (isMounted.current) {
        setData(groupedData);
        setError(null);
      }
    } catch (err) {
      console.error("Erreur :", err);
      if (isMounted.current) setError("Échec de la récupération des données.");
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  };

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
    const transferData = JSON.parse(e.dataTransfer.getData("text/plain"));

    try {
      setData((prev) => {
        const newData = { ...prev };
        if (transferData.from === targetPosition) {
          const newList = [...newData[targetPosition]];
          const [movedItem] = newList.splice(transferData.index, 1);
          newList.splice(dropIndex, 0, movedItem);
          newData[targetPosition] = newList;
        } else {
          const sourceList = [...newData[transferData.from]];
          const targetList = [...newData[targetPosition]];
          const [movedItem] = sourceList.splice(transferData.index, 1);
          if (
            dropIndex !== undefined &&
            dropIndex >= 0 &&
            dropIndex <= targetList.length
          ) {
            targetList.splice(dropIndex, 0, movedItem);
          } else {
            targetList.push(movedItem);
          }
          newData[transferData.from] = sourceList;
          newData[targetPosition] = targetList;
        }
        return newData;
      });

      const dragPayload = {
        oldPosition: transferData.from,
        newPosition: targetPosition,
        produit: transferData.item,
      };
      if (transferData.from === targetPosition) {
        dragPayload.newIndex = dropIndex;
        dragPayload.oldPosition = targetPosition;
        dragPayload.newPosition = targetPosition;
      }

      await api.post("/drag", dragPayload, {
        headers: { "Content-Type": "application/json" },
      });

      setTimeout(async () => {
        try {
          await api.post("/trigger-update", { newPosition: targetPosition }, {
            headers: { "Content-Type": "application/json" },
          });
          await fetchData();
        } catch (syncError) {
          console.error("Erreur de synchronisation :", syncError);
          setError("Problème de synchronisation avec Google Sheets");
        }
      }, 5000);
    } catch (err) {
      console.error("Erreur lors du déplacement :", err);
      setError("Erreur lors du déplacement - Veuillez réessayer");
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
        newData[key] = newData[key].filter(
          (produit) => produit.id !== deletedItem.id
        );
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
      <MyNavbar />
      <Container fluid className="p-4">
        <MobileRow className="g-1 flex-nowrap justify-content-center align-items-stretch">
          {[1, 2, 3, 4, 5].map((num) => (
            <Col key={num} xs={12} sm={6} md={2}>
              <StyledCard>
                <Card.Body>
                  <Card.Title className="text-center fw-bold">
                    Chaine {num}
                  </Card.Title>
                  <ListGroup
                    variant="secondary"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, num, 0)}
                  >
                    {filterAndSortProducts(data[num]).map((item, index) => (
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
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>{item.style}</span>
                          <span style={{ color: "#636e72", fontWeight: "bold" }}>Order: {item.order}</span>
                        </div>
                      </StyledListGroupItem>
                    ))}
                  </ListGroup>
                </Card.Body>
              </StyledCard>
            </Col>
          ))}

          <Col md="auto" className="d-flex align-items-center">
            <ControlButton
              variant="outline-light"
              onClick={() => setShowPosition6(!showPosition6)}
            >
              {showPosition6 ? "▸" : "◂"}
            </ControlButton>
          </Col>

          {showPosition6 && (
            <Col xs={12} sm={6} md={2}>
              <StyledCard className="bg-dark text-white">
                <Card.Body>
                  <Card.Title className="text-center fw-bold">
                    Chaine 6
                  </Card.Title>
                  <ListGroup
                    variant="flush"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 6, 0)}
                  >
                    {filterAndSortProducts(data[6]).map((item, index) => (
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
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>{item.style}</span>
                          <span style={{ color: "#fff", fontWeight: "bold" }}>Order: {item.order}</span>
                        </div>
                      </StyledListGroupItem>
                    ))}
                  </ListGroup>
                </Card.Body>
              </StyledCard>
            </Col>
          )}
        </MobileRow>
      </Container>

      <Col
        md="auto"
        className="d-flex align-items-center justify-content-end p-4 m-auto"
      >
        <DeleteButton onDeleteSuccess={handleDeleteSuccess} />
      </Col>

      {hoveredItem && (
        <HoverCard
          x={hoverPosition.x}
          y={hoverPosition.y}
          chaine={chaine}
          show={hoveredItem !== null}
          cardHeight={240}
        >
          <Card
            className="shadow-custom"
            style={{ borderRadius: "12px", overflow: "hidden", border: "none" }}
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
      )}
    </>
  );
}