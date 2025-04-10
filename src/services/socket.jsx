// socket.js
import { io } from 'socket.io-client';

const socket = io("https://www.clever-davinci.3-148-113-97.plesk.page", {
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
