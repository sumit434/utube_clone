import express from "express";
import { protect } from "../middleware/auth.js";
import { reactToVideo, getReaction } from "../controllers/likes_dislikes.js";
import { getReactionCounts } from "../controllers/likes_dislikes.js";

const router = express.Router();
router.get("/:videoId/counts", getReactionCounts);

router.post("/:videoId", protect, reactToVideo);

router.get("/:videoId/reaction", protect, getReaction);

export default router;
