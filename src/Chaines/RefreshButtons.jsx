import React, { useState } from "react";
import { Button } from "react-bootstrap";
import styled from "styled-components";
import { ArrowClockwise } from "react-bootstrap-icons";
import { BounceLoader } from "react-spinners";
import api from "../services/axios";


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

const RefreshButton = ({ onRefresh }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefreshPage = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/process");
      onRefresh(response.data);
    } catch (error) {
      console.error("Erreur de synchronisation :", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <RefreshButtonStyle onClick={handleRefreshPage} disabled={isLoading}>
        {isLoading ? (
          <BounceLoader size={20} color="#fff" />
        ) : (
          <ArrowClockwise size={22} />
        )}
      </RefreshButtonStyle>
    </div>
  );
};

export default RefreshButton;
