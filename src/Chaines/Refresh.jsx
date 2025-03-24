import React, { useState } from "react";
import { Button } from "react-bootstrap";
import styled from "styled-components";
import { ArrowClockwise } from "react-bootstrap-icons";
import { BounceLoader } from "react-spinners";
import api from "../services/axios";

export const RefreshButtonStyle = styled(Button)`
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: white;
  padding: 12px 25px;
  font-size: 16px;
  border-radius: 30px;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
  font-weight: bold;
  border: none;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
    background: linear-gradient(135deg, #2575fc, #6a11cb);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(98, 0, 234, 0.3);
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
