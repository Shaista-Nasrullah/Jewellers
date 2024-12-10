import express from "express";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddelware.js";
import {
  categoriesController,
  categoryController,
  createCategoryController,
  deleteCategoryController,
  updateCategoryController,
} from "../controllers/categoryController.js";

const router = express.Router();

//routes
//create category
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

//update category
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

//get categories
router.get("/categories", categoriesController);

//get single category
router.get("/category/:slug", categoryController);

//delete category
router.delete(
  "/delete-category/:id",
  requireSignIn,
  isAdmin,
  deleteCategoryController
);

export default router;
