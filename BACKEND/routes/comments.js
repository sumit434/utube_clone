import express from "express";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/comments.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router
  .route("/:videoId")
  .get(getComments)
  .post(protect, createComment);

router
  .route("/:id")
  .put(protect, updateComment)
  .delete(protect, deleteComment);

export default router;
