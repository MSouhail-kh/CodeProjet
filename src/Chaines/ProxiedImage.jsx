import React, { useState, useEffect } from "react";
import axios from "axios";
import NoImage from "../assets/No+Image.png";

const ProxiedImage = ({ imageUrl, alt, ...rest }) => {
  const [proxiedUrl, setProxiedUrl] = useState(null);

  useEffect(() => {
    if (imageUrl) {
      axios
        .get(`/.netlify/functions/getImage?imageUrl=${encodeURIComponent(imageUrl)}`, {
          responseType: "blob",
        })
        .then((response) => {
          const url = URL.createObjectURL(response.data);
          setProxiedUrl(url);
        })
        .catch((error) => {
          console.error("Erreur lors du téléchargement de l'image proxifiée :", error);
          setProxiedUrl(NoImage);
        });
    } else {
      setProxiedUrl(NoImage);
    }
  }, [imageUrl]);

  return <img src={proxiedUrl || NoImage} alt={alt} {...rest} />;
};

export default ProxiedImage;
