// socket.js
import { io } from 'socket.io-client';

const socket = io("https://gestion-planning-back-end-1.onrender.com", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionDelay: 5000,
  reconnectionAttempts: Infinity,
  withCredentials: true,
  autoConnect: true,
  extraHeaders: {
    "my-custom-header": "abcd",
    "x-client-version": "1.0.0"
  }
});

export default socket;
