import express from "express";

import {
  uploadVideo,
  getVideos,
  updateVideo,
  getVideoById,
  OnSearch,
  deleteVideo,
  getChannelVideos,
  getVideosByCategory
} from "../controllers/videos.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Combined routes for the base path and for searching
router.route("/").post(protect, uploadVideo).get(getVideos);
router.get('/search', OnSearch);
router.get('/category', getVideosByCategory);
router.get("/:channelId/videos",getChannelVideos );

// Consolidate the routes for a single video by its ID
router.route("/:id")
  .get(getVideoById)
  .put(protect,updateVideo)
  .delete(protect, deleteVideo);
  
export default router;
