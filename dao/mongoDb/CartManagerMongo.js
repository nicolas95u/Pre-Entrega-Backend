import Cart from "../../models/carts.js";
import Product from "../../models/products.js";
import { validateObjectId } from "../../utils/validator/objectId.utils.js";
import logger from '../../config/logger.js';

class CartManager {
  async createCart(userId) {
    try {
      validateObjectId([userId]);

      const newCart = {
        userId: userId,
        products: [],
      };

      const cart = await this.addCart(newCart);

      return cart._id;
    } catch (error) {
      logger.error(error);
      throw new Error("Error al crear carrito");
    }
  }

  async addCart(cartData) {
    try {
      const cart = new Cart(cartData);
      await cart.save();
      logger.info("Carrito creado correctamente.");
      return cart;
    } catch (error) {
      logger.error("Error al crear el carrito:", error);
      throw new Error("No se pudo crear el carrito");
    }
  }

  async getCarts() {
    try {
      return await Cart.find();
    } catch (error) {
      logger.error("Error al obtener el carrito:", error);
      throw new Error("No se pudo obtener el carrito");
    }
  }

  async getCartById(id) {
    try {
      return await Cart.findById(id).populate("products.product");
    } catch (error) {
      logger.error("Error al obtener el carrito:", error);
      throw new Error("No se pudo obtener el carrito");
    }
  }

  async addProductToCart(userId, productId, quantity = 1) {
    try {
      validateObjectId([userId, productId]);

      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({ userId, products: [] });
      }

      const existingProduct = cart.products.find((product) => product.product.equals(productId));

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      await cart.save();
      return cart;
    } catch {
      logger.error("Error al añadir el producto al carrito:", error);
      throw new Error("No se pudo añadir el producto al carrito");
    }
  }

  async getProductById(productId) {
    try {
      return await Product.findById(productId);
    } catch {
      throw new Error("Producto no encontrado");
    }
  }

  async updateProductStock(productId, quantity) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Producto no encontrado");
      }
      product.stock += quantity;
      await product.save();
    } catch {
      throw new Error("Error al actualizar el stock del producto");
    }
  }
}

export default CartManager;
