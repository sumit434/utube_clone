import express from "express";
import { searchUsers, searchVideos } from "../controllers/search.js";

const router = express.Router();

router.get("/users", searchUsers);

router.get("/videos", searchVideos);

export default router;
