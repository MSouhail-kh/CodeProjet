import React, { useState } from "react";
import { Navbar, Container } from "react-bootstrap";
import { PlusCircle, Search, ArrowClockwise, CheckCircle, XCircle } from "react-bootstrap-icons";
import { BounceLoader } from "react-spinners";
import styled, { keyframes } from "styled-components";
import AjouterProduitsModel from "../Produits/AjouterProduitsModel";
import UserProfile from "../Authentification/User/UserProfile";
import SearchResultsModal from "../Produits/SearchResultsModal";
import api from "../services/axios";

// Animation pour la couleur du texte
const textColorAnimation = keyframes`
  0% { color: #7c4dff; }
  25% { color: #448aff; }
  50% { color: #00bcd4; }
  75% { color: #ff6f61; }
  100% { color: #7c4dff; }
`;


  const StyledNavbar = styled(Navbar)`
    background: linear-gradient(135deg, #7c4dff, #448aff) !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    padding: 0.8rem 0;
  `;


const NavContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 1.5rem;
`;

const LogoContainer = styled(Navbar.Brand)`
  font-size: 1.5rem;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  animation: ${textColorAnimation} 5s ease infinite;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
`;

const MessageContainer = styled(Container)`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;



// Nouveau style pour le message
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


const MyNavbar = ({ produits = [], onRefresh }) => {
  const [showProduitModal, setShowProduitModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState("");
  const [refreshMessageType, setRefreshMessageType] = useState("");

  const handleShowProduit = () => setShowProduitModal(true);
  const handleCloseProduit = () => setShowProduitModal(false);
  const handleShowSearchModal = () => setShowSearchModal(true);
  const handleCloseSearchModal = () => setShowSearchModal(false);

  const handleRefreshPage = async () => {
    const startTime = Date.now();
    setIsLoading(true);
    try {
      const response = await api.get("/process");
      onRefresh(Object.values(response.data));
      const duration = (Date.now() - startTime) / 1000; // Conversion en secondes
      setRefreshMessage(`Processus terminé avec succès en ${duration.toFixed(2)} s`);
      setRefreshMessageType("success");
    } catch (error) {
      console.error("Erreur de synchronisation :", error);
      setRefreshMessage("Échec du processus. Veuillez réessayer.");
      setRefreshMessageType("error");
    } finally {
      setIsLoading(false);
      setTimeout(() => setRefreshMessage(""), 5000);
    }
  };

  return (
    <>
      <StyledNavbar expand="lg" variant="dark">
        <Container fluid>
          <NavContainer>
            <LogoContainer href="/Chaines">Sigmatex</LogoContainer>
            <IconsContainer>
              <IconButton onClick={handleShowSearchModal}>
                <Search size={20} />
              </IconButton>
              {/* <IconButton onClick={handleShowProduit}>
                <PlusCircle size={20} />
              </IconButton> */}
              <IconButton onClick={handleRefreshPage} disabled={isLoading}>
                {isLoading ? <BounceLoader size={20} color="#fff" /> : <ArrowClockwise size={20} />}
              </IconButton>
            </IconsContainer>
            <UserProfile />
          </NavContainer>
        </Container>
      </StyledNavbar>

      {refreshMessage && (
        <Container fluid className="d-flex justify-content-center">
          <Message type={refreshMessageType}>
            {refreshMessageType === "success" ? (
              <CheckCircle size={20} />
            ) : (
              <XCircle size={20} />
            )}
            {refreshMessage}
          </Message>
        </Container>
      )}

      {/* Modals */}
      <AjouterProduitsModel show={showProduitModal} handleClose={handleCloseProduit} />
      <SearchResultsModal show={showSearchModal} handleClose={handleCloseSearchModal} />
    </>
  );
};

export default MyNavbar;
