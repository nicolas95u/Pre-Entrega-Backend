import Product from "../../models/products.js";
import logger from '../../config/logger.js';

class ProductManager {
  async addProduct(productData) {
    try {
      const product = new Product(productData);
      await product.save();
      return product;
    } catch (error) {
      logger.error("Error adding product:", error);
      throw new Error("Unable to add product");
    }
  }

  async deleteProduct(productId) {
    try {
      await Product.findByIdAndDelete(productId);
      return { message: "Product deleted successfully" };
    } catch (error) {
      logger.error("Error deleting product:", error);
      throw new Error("Unable to delete product");
    }
  }

  async getProducts(query = {}, options = {}) {
    try {
      return await Product.paginate(query, options);
    } catch (error) {
      logger.error("Error fetching products:", error);
      throw new Error("Unable to fetch products");
    }
  }

  async getProductById(productId) {
    try {
      return await Product.findById(productId);
    } catch (error) {
      logger.error("Error fetching product by ID:", error);
      throw new Error("Unable to fetch product by ID");
    }
  }

  async updateProduct(productId, updateData) {
    try {
      return await Product.findByIdAndUpdate(productId, updateData, { new: true });
    } catch (error) {
      logger.error("Error updating product:", error);
      throw new Error("Unable to update product");
    }
  }

  async addReview(productId, reviewData) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Product not found");
      }
      product.reviews.push(reviewData);
      await product.save();
      return reviewData;
    } catch (error) {
      logger.error("Error adding review:", error);
      throw new Error("Unable to add review");
    }
  }

  async getProductDescription(productId) {
    try {
      const product = await Product.findById(productId).select("description");
      if (!product) {
        throw new Error("Product not found");
      }
      return product.description;
    } catch (error) {
      logger.error("Error fetching product description:", error);
      throw new Error("Unable to fetch product description");
    }
  }
}

export default ProductManager;
