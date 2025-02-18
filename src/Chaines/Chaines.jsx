import { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Button,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import MyNavbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";

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
    background-color: #f8f9fa;
  }
`;

const HoverCard = styled.div`
  position: absolute;
  left: ${({ x }) => x + 15}px;
  top: ${({ y }) => y - 90}px;
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

export default function Chaines() {
  const [showPosition6, setShowPosition6] = useState(true); 
  const [data, setData] = useState({});
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/produits")
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
        "http://localhost:5000/drag",
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
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi de la notification :", error);
      });
  };

  const handleMouseEnter = (e, item) => {
    setHoveredItem(item);
    setHoverPosition({ x: e.clientX, y: e.clientY });
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
    return <div className="loading">Chargement...</div>;
  }

  return (
    <>
      <MyNavbar />
      <Container fluid className="p-4">
        <Row className="g-3 justify-content-center align-items-stretch">
          {[1, 2, 3, 4, 5].map((num) => (
            <Col
              key={num}
              md={2}
              onDrop={(e) => handleDrop(e, num)}
              onDragOver={handleDragOver}
            >
              <StyledCard>
                <Card.Body>
                  <Card.Title className="text-center fw-bold">
                    Chaine {num}
                  </Card.Title>
                  <ListGroup variant="flush">
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
                        {item.name}
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
                        {item.name}
                      </StyledListGroupItem>
                    ))}
                  </ListGroup>
                </Card.Body>
              </StyledCard>
            </Col>
          )}
        </Row>
      </Container>
      
      {hoveredItem && (
      <HoverCard x={hoverPosition.x} y={hoverPosition.y}>
        <Card className="shadow-custom">
          {hoveredItem.image ? (
            <Card.Img 
              variant="top" 
              src={
                hoveredItem.image.startsWith("http")
                  ? hoveredItem.image
                  : `http://localhost:5000/static/uploads/${hoveredItem.image}`
              }
              style={{ height: '100px', objectFit: 'cover' }}
            />
          ) : null}
          <Card.Body>
            <Card.Title>{hoveredItem.title || hoveredItem.name}</Card.Title>
            <span>{hoveredItem.name} / Qty: {hoveredItem.qty}</span>
          </Card.Body>
        </Card>
      </HoverCard>
      )}
    </>
  );
}