import express from "express";
import cors from "cors";
import { verifyToken } from "./middleware/authMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend is Running 🚀");
});

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Frontend Connected Succesully!"
    });
});

app.get("/api/profile", verifyToken, (req, res) => {
  res.json({
    success: true,
    uid: req.user.uid,
    email: req.user.email,
    name: req.user.name,
  });
});

export default app;