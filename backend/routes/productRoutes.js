import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddelware.js";
import {
  createProductController,
  deleteProductController,
  getProductController,
  productFiltersController,
  productCountController,
  productListController,
  getProductsController,
  searchProductController,
  realtedProductController,
  productCategoryController,
  updateProductController,
  brainTreePaymentController,
} from "../controllers/productController.js";
import { upload } from "../middlewares/multerMiddleware.js";

const router = express.Router();

//create product
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  upload,
  createProductController
);

//grt all products
router.get("/get-products", getProductsController);

//get single product
router.get("/get-product/:slug", getProductController);

//update product
router.put(
  "/update-product/:id",
  requireSignIn,
  isAdmin,
  upload,
  updateProductController
);

//delete product
router.delete(
  "/delete-product/:id",
  requireSignIn,
  isAdmin,
  deleteProductController
);

//filter product
router.post("/product-filters", productFiltersController);

//product count
router.get("/product-count", productCountController);

//products per page
router.get("/product-list/:page", productListController);

//search product
router.get("/search/:keyword", searchProductController);

//similar product
router.get("/related-product/:pid/:cid", realtedProductController);

//category wise product
router.get("/product-category/:slug", productCategoryController);

//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);

export default router;
