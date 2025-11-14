import productService from "../services/product.service.js";
import tryCatchFn from "../utils/tryCatchFn.js";
import responseHandler from "../utils/responseHandler.js";
const { successResponse } = responseHandler;

// Add new product (admin only)
export const createProduct = tryCatchFn(async (req, res, next) => {
  const product = await productService.createProduct(req.body, next);
  if (!product) return;
  return successResponse(
    res,
    product,
    "Product created successfully",
    201
  );
});

// Get all products (public)
export const getAllProducts = tryCatchFn(async (req, res, next) => {
      const { page, limit, query, role } = req.query;
  const result = await productService.getAllProducts(
     parseInt(page),
    parseInt(limit),
    query,
    role,
    next
  );
  if (!result) return;
  return successResponse(
    res,
    result,
    "Products retrieved successfully",
    200
  );
});

// Get single product by ID (public)
export const getProductById = tryCatchFn(async (req, res, next) => {
  const { id: productId } = req.params;
  const product = await productService.getProductById(productId, next);
  if (!product) return;
  return successResponse(
    res,
    product,
    "Product retrieved successfully",
    200
  );
});

// Modify a product (admin only)
export const updateProduct = tryCatchFn(async (req, res, next) => {
  const { id: productId } = req.params;
  const product = await productService.updateProduct(
    productId,
    req.body,
    next
  );
  if (!product) return;
  return successResponse(
    res,
    product,
    "Product updated successfully",
    200
  );
});

//Remove a product (admin only)
export const deleteProduct = tryCatchFn(async (req, res, next) => {
  const { id: productId } = req.params;
  const product = await productService.deleteProduct(productId, next);
  if (!product) return;
  return successResponse(
    res,
    product,
    "Product deleted successfully",
    200
  );
});


// GET PRODUCTS BY CATEGORY (public)
export const getProductsByCategory = tryCatchFn(async (req, res, next) => {
  const { category } = req.params;
  const products = await productService.getProductsByCategory(category, next);
  if (!products) return;
  return successResponse(
    res,
    products,
    "Products by category retrieved successfully",
    200
  );
});
