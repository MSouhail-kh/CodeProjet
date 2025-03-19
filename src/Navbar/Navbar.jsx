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
  font-size: 1.8rem;
  font-weight: 800;
  padding: 0.5rem 1.5rem;
  border-radius: 15px;
  background: linear-gradient(45deg, #fff, #e0e0e0);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      120deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    );
    transition: 0.6s;
  }

  &:hover {
    transform: scale(1.05);
    &::before {
      left: 100%;
    }
  }

  @media (max-width: 768px) {
    font-size: 1.4rem;
    padding: 0.4rem 1rem;
  }
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding-right: 1rem;

  @media (max-width: 768px) {
    gap: 0.8rem;
    padding-right: 0.5rem;
  }
`;

const IconButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: ${({ theme }) => theme.navIconBg};
  backdrop-filter: blur(4px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px) scale(1.1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
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
      const duration = (Date.now() - startTime) / 1000; 
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
              <LogoContainer href="/Chaines">
                <img 
                  src="/chemin/vers/logo.png" 
                  alt="Sigmatex Logo"
                  style={{ height: '32px', marginRight: '12px' }}
                />
                Sigmatex
              </LogoContainer>
              
              <IconsContainer>
                <IconButton onClick={handleShowSearchModal}>
                  <Search size={22} style={{ strokeWidth: '1.5' }} />
                </IconButton>
                
                <IconButton 
                  onClick={handleRefreshPage} 
                  disabled={isLoading}
                  style={{ position: 'relative' }}
                >
                  {isLoading ? (
                    <BounceLoader 
                      size={26} 
                      color="#fff" 
                      css="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"
                    />
                  ) : (
                    <ArrowClockwise size={22} />
                  )}
                </IconButton>
                
                <UserProfile />
              </IconsContainer>
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
