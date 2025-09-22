import express from "express";
import {
  getCategories,
  getCategory,
  createCategory
} from "../controllers/categories.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router
  .route("/")
  .get(getCategories)
  .post(protect, createCategory);

router
  .route("/:id")
  .get(getCategory)
  
export default router;
