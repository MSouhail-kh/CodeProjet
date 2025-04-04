import React, { useState } from "react";
import { Button } from "react-bootstrap";
import styled from "styled-components";
import { ArrowClockwise, Search } from "react-bootstrap-icons";
import { BounceLoader } from "react-spinners";
import UserProfile from "../Authentification/User/UserProfile";
import SearchResultsModal from "../Produits/SearchResultsModal";
import api from "../services/axios";

export const RefreshButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const RefreshButtonStyle = styled(Button)`
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
let fs, path;
if (typeof window === "undefined") {
  fs = require("fs");
  path = require("path");
}

const downloadImage = async (url, localPath) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const buffer = Buffer.from(reader.result.split(",")[1], "base64");
        fs.writeFile(localPath, buffer, (err) => {
          if (err) {
            console.log("Erreur lors de l'enregistrement de l'image :", err);
            reject(err);
          } else {
            resolve(localPath);
          }
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.log("Erreur lors du téléchargement de l'image :", error);
    return null;
  }
};

const getLocalImage = async (url) => {
  const cache = JSON.parse(localStorage.getItem("imageCache")) || {};
  const localFolder = path.join(__dirname, "images");

  if (!fs.existsSync(localFolder)) {
    fs.mkdirSync(localFolder);
  }

  if (cache[url]) {
    return cache[url];
  } else {
    const fileName = path.basename(url);
    const localPath = path.join(localFolder, fileName);

    const downloadedImagePath = await downloadImage(url, localPath);
    if (downloadedImagePath) {
      cache[url] = downloadedImagePath;
      localStorage.setItem("imageCache", JSON.stringify(cache));
    }
    return downloadedImagePath;
  }
};

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
      console.log("Erreur de synchronisation :", error);
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

export default Refresh;
