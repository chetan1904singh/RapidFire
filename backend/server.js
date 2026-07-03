import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import { auth } from "./firebase/firebaseAdmin.js";
import socketHandler from "./socket/socketHandler.js";
import "dotenv/config";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Authenticate every socket connection
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("No authentication token"));
    }

    const decoded = await auth.verifyIdToken(token);

    socket.user = decoded;

    next();
  } catch (err) {
    console.error("Socket Authentication Failed:", err.message);
    next(new Error("Unauthorized"));
  }
});

// Register all socket events
socketHandler(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});