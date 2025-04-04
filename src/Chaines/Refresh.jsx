import React, { useState } from "react";
import { Button } from "react-bootstrap";
import styled from "styled-components";
import { ArrowClockwise, Search } from "react-bootstrap-icons";
import { BounceLoader } from "react-spinners";
import UserProfile from "../Authentification/User/UserProfile";
import SearchResultsModal from "../Produits/SearchResultsModal";
import api from "../services/axios";

let fs, path, localFolder;

// Vérifier si nous sommes côté serveur (Node.js)
if (typeof window === "undefined") {
  fs = require("fs");
  path = require("path");
  localFolder = path.join(__dirname, "images");

  if (!fs.existsSync(localFolder)) {
    fs.mkdirSync(localFolder, { recursive: true });
  }
}

const downloadImage = async (url) => {
  if (typeof window !== "undefined") return url; // En mode client, on retourne juste l'URL

  try {
    const fileName = path.basename(url);
    const localPath = path.join(localFolder, fileName);

    if (fs.existsSync(localPath)) {
      return localPath; // Retourne le chemin si l'image est déjà téléchargée
    }

    // Télécharger l'image
    const response = await fetch(url);
    const buffer = Buffer.from(await response.arrayBuffer());

    // Sauvegarde l'image
    fs.writeFileSync(localPath, buffer);
    console.log(`✅ Image téléchargée : ${localPath}`);

    return localPath;
  } catch (error) {
    console.error("❌ Erreur lors du téléchargement de l'image :", error);
    return null;
  }
};

const getLocalImage = async (url) => {
  if (typeof window !== "undefined") return url; // En mode client, retourne l'URL d'origine

  let cache = {};
  try {
    cache = JSON.parse(localStorage.getItem("imageCache")) || {};
  } catch (error) {
    console.error("❌ Erreur lors de la lecture du cache :", error);
  }

  if (cache[url]) {
    return cache[url]; // Retourne le chemin si l'image est déjà en cache
  }

  const localPath = await downloadImage(url);
  if (localPath) {
    cache[url] = localPath;
    localStorage.setItem("imageCache", JSON.stringify(cache));
  }

  return localPath;
};

// Composant Refresh
const Refresh = ({ onRefresh }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const handleRefreshPage = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/process");

      const updatedProducts = await Promise.all(
        response.data.map(async (product) => ({
          ...product,
          localImage: await getLocalImage(product.image),
        }))
      );

      onRefresh(updatedProducts);
    } catch (error) {
      console.error("❌ Erreur de synchronisation :", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RefreshButtonContainer>
      <RefreshButtonStyle onClick={() => setShowSearchModal(true)}>
        <Search size={22} />
      </RefreshButtonStyle>

      <RefreshButtonStyle onClick={handleRefreshPage} disabled={isLoading}>
        {isLoading ? <BounceLoader size={20} color="#fff" /> : <ArrowClockwise size={22} />}
      </RefreshButtonStyle>

      <SearchResultsModal show={showSearchModal} handleClose={() => setShowSearchModal(false)} />
      <UserProfile />
    </RefreshButtonContainer>
  );
};

// Styles
const RefreshButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const RefreshButtonStyle = styled(Button)`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  backdrop-filter: blur(4px);
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  border: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
    background: linear-gradient(135deg, #2575fc, #6a11cb);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

export default Refresh;
