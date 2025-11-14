import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
} from "../controllers/productContoller.js";
import { verifyAuth, authorizedRoles } from "../middlewares/authenticate.js";
import { cacheMiddleware, clearCache } from "../middlewares/cache.js";
import { rateLimiter } from "../middlewares/rateLimit.js";

const router = express.Router();

// PUBLIC ROUTES (no authentication required)

// Get all products
router.get(
  "/all",
  cacheMiddleware("products_all", 3600),
  getAllProducts
);

// Get single product by ID
router.get(
  "/:id",
  cacheMiddleware("product_", 3600),
  getProductById
);


// Get products by category
router.get(
  "/category/:category",
  cacheMiddleware("products_category_", 3600),
  getProductsByCategory
);

// ADMIN ONLY ROUTES (authentication + admin role required)

// Create new product (admin only)
router.post(
  "/create",
  rateLimiter,
  verifyAuth,
  authorizedRoles("admin"),
  clearCache("products_all"),
  createProduct
);

// Update product (admin only)
router.patch(
  "/update/:id",
  rateLimiter,
  verifyAuth,
  authorizedRoles("admin"),
  clearCache("products_all"),
  clearCache("product_"),
  updateProduct
);

// Delete product (admin only)
router.delete(
  "/delete/:id",
  rateLimiter,
  verifyAuth,
  authorizedRoles("admin"),
  clearCache("products_all"),
  clearCache("product_"),
  deleteProduct
);

export default router;
