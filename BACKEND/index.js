import path from "path";
import dotenv from "dotenv";
import express from "express";
import DBConnection from "./config/db.js";
import cors from 'cors';

import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/categories.js";
import videoRoutes from "./routes/videos.js";
import commentRoutes from "./routes/comments.js";
import likesDislikesRoutes from "./routes/likes_dislikes.js";
import searchRoutes from "./routes/search.js";
import channelsRoutes from "./routes/channels.js";

dotenv.config({ path: path.resolve("./config/.env") });

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

DBConnection();

app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  next();
});

const versionOne = (routeName) => `/api/v1/${routeName}`;

app.use(versionOne("categories"), categoryRoutes);
app.use(versionOne("videos"), videoRoutes);
app.use(versionOne("comments"), commentRoutes);
app.use(versionOne("likes_dislikes"), likesDislikesRoutes);
app.use(versionOne("search"), searchRoutes);
app.use(versionOne("auth"), authRoutes);
app.use(versionOne("channels"), channelsRoutes);

app.use(express.static(path.resolve("./BACKEND/public")));

app.get('/test', (req, res) => {
    res.send('Connection to backend successful!');
});

import errorHandler from "./middleware/error.js";
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});