import React from "react";
import styled, { keyframes } from "styled-components";

const LoaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
`;

const pulseAnimation = keyframes`
  0% { transform: scale(0.8); opacity: 0.7; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(0.8); opacity: 0.7; }
`;

const Dot = styled.div`
  width: 24px;
  height: 24px;
  margin: 0 6px;
  border-radius: 50%;
  background-color: #f9c74f;
  animation: ${pulseAnimation} 1.4s infinite ease-in-out;
  animation-delay: ${(props) => props.delay || "0s"};
`;

const BouncingLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Loader = () => (
  <LoaderContainer>
    <BouncingLoader>
      <Dot />
      <Dot delay="0.2s" />
      <Dot delay="0.4s" />
    </BouncingLoader>
  </LoaderContainer>
);

export default Loader;