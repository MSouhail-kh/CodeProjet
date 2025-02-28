import { useState, useEffect } from "react";
import axios from "axios";
import styled, { keyframes } from "styled-components";
import { Container, Row, Col, Card, ListGroup, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import MyNavbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import DeleteButton from "./DeleteButton";

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
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

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.4s;
  }
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
  transition: background-color 0.2s;

  &:hover {
    background: linear-gradient(135deg, #2575fc, #6a11cb);
  }
`;
const HoverCard = styled.div`
  position: fixed;
  left: ${({ x, chaine }) => (chaine === 1 ? x + 10 : x - 220 - 15)}px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 900;
  width: 220px;
`;

const ControlButton = styled(Button)`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://gestion-planning-back-end-1.onrender.com/produits")
      .then((response) => {
        const groupedData = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
        const produits = Object.values(response.data);
        produits.forEach((produit) => {
          if (groupedData[produit.position_id]) {
            groupedData[produit.position_id].push(produit);
          }
        });
        setData(groupedData);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des produits :", error);
      });
  }, []);

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

  const handleDragStart = (e, sourcePosition, item, index) => {
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ from: sourcePosition, item, index })
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = (e, targetPosition) => {
    e.preventDefault();
    const transferData = JSON.parse(e.dataTransfer.getData("text/plain"));
    if (transferData.from === targetPosition) return;

    setData((prevData) => {
      const newSource = [...prevData[transferData.from]];
      const newTarget = [...prevData[targetPosition]];
      newSource.splice(transferData.index, 1);
      newTarget.push(transferData.item);
      return {
        ...prevData,
        [transferData.from]: newSource,
        [targetPosition]: newTarget,
      };
    });

    axios
      .post(
        "https://gestion-planning-back-end-1.onrender.com/drag",
        {
          oldPosition: transferData.from,
          newPosition: targetPosition,
          produit: transferData.item,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        // Rafraîchir la page après la réussite
        window.location.reload();
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi de la notification :", error);
      });
  };
  const handleMouseEnter = (e, item) => {
    setHoveredItem(item);
    setHoverPosition({ x: e.clientX });
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

  if (Object.keys(data).length === 0) {
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
            <Col
              key={num}
              xs={12}
              sm={6}
              md={2}
              onDrop={(e) => handleDrop(e, num)}
              onDragOver={handleDragOver}
            >
              <StyledCard>
                <Card.Body>
                  <Card.Title className="text-center fw-bold">
                    Chaine {num}
                  </Card.Title>
                  <ListGroup variant="secondary">
                    {data[num]?.map((item, index) => (
                      <StyledListGroupItem
                        key={index}
                        draggable
                        onDragStart={(e) => handleDragStart(e, num, item, index)}
                        onClick={() => handleItemClick(item)}
                        onMouseEnter={(e) => handleMouseEnter(e, item)}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                      >
                        {item.style}
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
            <Col
              xs={12} // Occuper toute la largeur sur mobile
              sm={6}
              md={2}
              onDrop={(e) => handleDrop(e, 6)}
              onDragOver={handleDragOver}
            >
              <StyledCard className="bg-dark text-white">
                <Card.Body>
                  <Card.Title className="text-center fw-bold">
                    Chaine 6
                  </Card.Title>
                  <ListGroup variant="flush">
                    {data[6]?.map((item, index) => (
                      <StyledListGroupItem
                        key={index}
                        draggable
                        onDragStart={(e) => handleDragStart(e, 6, item, index)}
                        onClick={() => handleItemClick(item)}
                        className="bg-secondary text-white"
                        onMouseEnter={(e) => handleMouseEnter(e, item)}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                      >
                        {item.style}
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
        <HoverCard x={hoverPosition.x} chaine={chaine}>
          <Card className="shadow-custom">
            {hoveredItem.image ? (
            <Card.Img
              variant="top"
              src={
                hoveredItem.image.startsWith("https")
                  ? hoveredItem.image
                  : `https://gestion-planning-back-end-1.onrender.com/assets/uploads/${hoveredItem.image}`
              }
              style={{ height: "120px", objectFit: "cover" }}
            />
            ) : null}
            <Card.Body>
              <Card.Title>{hoveredItem.style}</Card.Title>
              <span>
                {hoveredItem.style} / Qty: {hoveredItem.qty}
              </span>
            </Card.Body>
          </Card>
        </HoverCard>
      )}
    </>
  );
}
