import Product from "../models/product.js";
import responseHandler from "../utils/responseHandler.js";

const { errorResponse, notFoundResponse } = responseHandler;

const productService = {
  createProduct: async (productData, next) => {
    try {
      const { name, description, price, category } = productData;
      if (!name || !description || price === undefined || !category) {
        return next(
          errorResponse(
            "Name, description, price, and category are required",
            400
          )
        );
      }

      // Create new product
      const newProduct = await Product.create(productData);

      if (!newProduct) {
        return next(errorResponse("Product could not be created", 500));
      }

      return newProduct;
    } catch (error) {
      return next(errorResponse(error.message || "something went wrong", 500));
    }
  },

  getAllProducts: async (page = 1, limit = 3, query = "", category = "", next) => {
    const sanitizeQuery =
      query || category
        ? (query || category).toLowerCase().replace(/[^\w\s]/gi, "")
        : "";
    const [products, total] = sanitizeQuery
      ? await Promise.all([
          Product.find({
            $or: [
              { name: { $regex: sanitizeQuery, $options: "i" } },
              { category: { $regex: sanitizeQuery, $options: "i" } },
            ],
          })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit),
          Product.countDocuments({
            $or: [
              { name: { $regex: sanitizeQuery, $options: "i" } },
              { category: { $regex: sanitizeQuery, $options: "i" } },
            ],
          }),
        ])
      : await Promise.all([
          Product.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit),
          Product.countDocuments(),
        ]);
    if (!products || products.length === 0) {
      return next(notFoundResponse("No products found"));
    }
    return {
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
        hasMore: (page - 1) * limit + products.length < total,
        limit,
      },
      products,
    };
  },

  getProductById: async (productId, next) => {
    try {
      if (!productId) {
        return next(errorResponse("Product ID is required", 400));
      }

      const product = await Product.findById(productId);

      if (!product) {
        return next(notFoundResponse("Product not found"));
      }

      return product;
    } catch (error) {
      return next(errorResponse(error.message, 400));
    }
  },

  updateProduct: async (productId, updateData, next) => {
    try {
      if (!productId) {
        return next(errorResponse("Product ID is required", 400));
      }

      // Find and update product
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        updateData,
        {
          new: true, // Return updated document
          runValidators: true, // Run schema validators
        }
      );

      if (!updatedProduct) {
        return next(notFoundResponse("Product not found"));
      }
      return updatedProduct;
    } catch (err) {
      return next(errorResponse(err.message, 400));
    }
  },

  deleteProduct: async (productId, next) => {
    try {
      if (!productId) {
        return next(errorResponse("Product ID is required", 400));
      }

      const deletedProduct = await Product.findByIdAndDelete(productId);

      if (!deletedProduct) {
        return next(notFoundResponse("Product not found"));
      }

      return deletedProduct;
    } catch (err) {
      return next(errorResponse(err.message, 400));
    }
  },

  getProductsByCategory: async (category, next) => {
    try {
      if (!category || category.trim().length === 0) {
        return next(errorResponse("Category is required", 400));
      }

      const products = await Product.find({
        category: { $regex: category, $options: "i" },
      });

      if (!products || products.length === 0) {
        return next(
          notFoundResponse(`No products found in category: ${category}`)
        );
      }

      return products;
    } catch (err) {
      return next(errorResponse(err.message, 400));
    }
  },
};

export default productService;
