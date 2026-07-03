import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import { RouterProvider } from "react-router-dom";

import router from "./router";

import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { GameProvider } from "./context/GameContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  
    <AuthProvider>
      <SocketProvider>
        <GameProvider>
          <RouterProvider router={router} />
        </GameProvider>
      </SocketProvider>
    </AuthProvider>
  
);