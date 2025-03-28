import React, { useState, useEffect } from "react";
import axios from "axios";
import NoImage from "../assets/No+Image.png";

const ProxiedImage = ({ imageUrl, alt, ...rest }) => {
  const [proxiedUrl, setProxiedUrl] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      if (!imageUrl) {
        setProxiedUrl(NoImage);
        setError(true);
        return;
      }

      try {
        const response = await axios.get(
          `/.netlify/functions/getImage?imageUrl=${encodeURIComponent(imageUrl)}`,
          { responseType: "blob" }
        );
        const url = URL.createObjectURL(response.data);
        setProxiedUrl(url);
        setError(false);
      } catch (err) {
        console.error("Erreur lors du téléchargement de l'image proxifiée :", err);
        setProxiedUrl(NoImage);
        setError(true);
      }
    };

    fetchImage();

    // Nettoyage de l'URL blob pour éviter les fuites de mémoire
    return () => {
      if (proxiedUrl) {
        URL.revokeObjectURL(proxiedUrl);
      }
    };
  }, [imageUrl]);

  return (
    <img
      src={proxiedUrl || NoImage}
      alt={alt}
      {...rest}
      style={error ? { border: "2px solid red" } : {}}
    />
  );
};

export default ProxiedImage;