import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Collapse, Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Chaines.css";
import MyNavbar from "./MyNavbar";
import { useNavigate } from "react-router-dom";

export default function Chaines() {
  const [showPosition6, setShowPosition6] = useState(false);
  const [data, setData] = useState({});
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/produits")
      .then(response => {
        console.log(response.data);
        const groupedData = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
        const produits = Object.values(response.data);
        produits.forEach(produit => {
          if (groupedData[produit.position_id]) {
            groupedData[produit.position_id].push(produit);
          }
        });
        setData(groupedData);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des produits :", error);
      });
  }, []);

  
  const handleDragStart = (e, sourcePosition, item, index) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ from: sourcePosition, item, index }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetPosition) => {
    e.preventDefault();
    const transferData = JSON.parse(e.dataTransfer.getData("text/plain"));
    if (transferData.from === targetPosition) return;

    setData(prevData => {
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

    axios.post('http://localhost:5000/drag', {
      oldPosition: transferData.from,
      newPosition: targetPosition,
      produit: transferData.item
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error('Erreur lors de l\'envoi de la notification :', error);
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
          {[1, 2, 3, 4, 5].map(num => (
            <Col key={num} md={2} onDrop={(e) => handleDrop(e, num)} onDragOver={handleDragOver}>
              <Card className="h-100 shadow-custom">
                <Card.Body>
                  <Card.Title className="text-center fw-bold">Position {num}</Card.Title>
                  <ListGroup variant="flush">
                    {data[num]?.map((item, index) => (
                      <ListGroup.Item 
                        key={index} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, num, item, index)}
                        onClick={() => handleItemClick(item)}
                        className="list-group-item-custom"
                      >
                        <span
                          className="hoverable-item"
                          onMouseEnter={(e) => handleMouseEnter(e, item)}
                          onMouseMove={handleMouseMove}
                          onMouseLeave={handleMouseLeave}
                        >
                          {item.name}
                        </span>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          ))}
  
          <Col md="auto" className="d-flex align-items-center">
            <Button 
              variant="outline-primary"
              onClick={() => setShowPosition6(!showPosition6)}
              className="control-button"
            >
              {showPosition6 ? "▸" : "◂"}
            </Button>
          </Col>
  
          <Collapse in={showPosition6} dimension="width">
            <Col md={2} onDrop={(e) => handleDrop(e, 6)} onDragOver={handleDragOver}>
              <Card className="h-100 shadow-custom bg-dark text-white">
                <Card.Body>
                  <Card.Title className="text-center fw-bold">Position 6</Card.Title>
                  <ListGroup variant="flush">
                    {data[6]?.map((item, index) => (
                      <ListGroup.Item 
                        key={index} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, 6, item, index)}
                        onClick={() => handleItemClick(item)}
                        className="bg-secondary text-white list-group-item-custom"
                      >
                        <span
                          className="hoverable-item"
                          onMouseEnter={(e) => handleMouseEnter(e, item)}
                          onMouseMove={handleMouseMove}
                          onMouseLeave={handleMouseLeave}
                        >
                          {item.name}
                        </span>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Collapse>
        </Row>
      </Container>
  
      {hoveredItem && (
        <div 
          className="hover-card"
          style={{
            left: hoverPosition.x + 15,
            top: hoverPosition.y - 90, 
            zIndex: 1000,
            width: '250px'
          }}
        >
          <Card className="shadow-custom card-hover">
            {hoveredItem.image && (
              <Card.Img 
                variant="top" 
                src={hoveredItem.image.startsWith("http") ? hoveredItem.image : hoveredItem.image}
                style={{ height: '140px', objectFit: 'cover' }}
              />
            )}
            <Card.Body>
              <Card.Title>{hoveredItem.title}</Card.Title>
              <div className="d-flex justify-content-between align-items-center">
                <span>{hoveredItem.name} / Qty: {hoveredItem.qty}</span>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}
    </>
  );
}
