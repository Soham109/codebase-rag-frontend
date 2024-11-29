// hooks/useSocket.js

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const useSocket = (url) => {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(url, {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [url]);

  return socketRef.current;
};

export default useSocket;
