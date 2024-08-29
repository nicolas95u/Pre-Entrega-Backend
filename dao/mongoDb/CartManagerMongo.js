import Cart from "../../models/carts.js";
import Product from "../../models/products.js";
import { validateObjectId } from "../../utils/validator/objectId.utils.js";
import logger from '../../config/logger.js';
import mongoose from 'mongoose';
import e from "express";

class CartManager {
  async createCart(userId) {
    try {
      validateObjectId([userId]);

      const newCart = {
        userId: userId,
        products: [],
      };

      logger.info(`Intentando crear un nuevo carrito para el usuario: ${userId}`);
      const cart = await this.addCart(newCart);
      logger.info(`Carrito creado con ID: ${cart._id}`);

      return cart._id;
    } catch (error) {
      logger.error(`Error dentro de createCart: ${error.message}`);
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
      logger.error("Error al crear el carrito dentro de addCart:", error);
      throw new Error("No se pudo crear el carrito");
    }
  }

  async getCartById(id) {
    try {
      validateObjectId([id]);
      logger.info(`Intentando obtener el carrito con ID: ${id}`);

      const cart = await Cart.findById(id).populate("products.product");
      if (!cart || cart.length == 0) {
        throw new Error("Carrito no encontrado");
      }

      logger.info(`Carrito obtenido exitosamente: ${cart}`);
      return cart;
    } catch (error) {
      logger.error("Error al obtener el carrito:", error);
      throw new Error(error.message ? error.message : "No se pudo obtener el carrito");
    }
  }

  async getCartByUserId(id) {
    try {
      validateObjectId([id]);
      logger.info(`Intentando obtener el carrito con ID: ${id}`);

      const cart = await Cart.find({ userId: id }).populate("products.product");

      if (!cart || cart.length == 0) {
        throw new Error("Carrito no encontrado");
      }

      logger.info(`Carrito obtenido exitosamente: ${cart}`);
      return cart;
    } catch (error) {
      logger.error("Error al obtener el carrito:", error);
      throw new Error(error.message ? error.message : "No se pudo obtener el carrito");
    }
  }

  async addProductToCart(userId, productId, quantity = 1) {
    try {
        validateObjectId([userId, productId]);

        let cart = await Cart.findOne({ userId }).populate('products.product');
        if (!cart) {
            cart = new Cart({ userId, products: [] });
        }

        // Agregar el log para depuración
        logger.info(`Buscando producto con ID: ${productId} en el carrito del usuario: ${userId}`);

        let existingProduct;
        if (quantity == -1) {
            existingProduct = cart.products.find((product) => product._id.equals(productId));
        } else {
            existingProduct = cart.products.find((product) => product.product.equals(productId));
        }

        // Log para ver si encontró el producto
        logger.info(`Producto encontrado: ${existingProduct ? JSON.stringify(existingProduct) : 'No encontrado'}`);

        if (existingProduct) {
            existingProduct.quantity += quantity;

            if (existingProduct.quantity == 0) {
                cart.products = cart.products.filter((product) => !product.product.equals(existingProduct.product));
            }
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await cart.save();
        return cart;
    } catch (error) {
        logger.error("Error al añadir el producto al carrito:", error);
        throw new Error("No se pudo añadir el producto al carrito");
    }
}


  async getProductById(productId) {
    try {
      return await Product.findById(productId);
    } catch (error) {
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
    } catch (error) {
      throw new Error("Error al actualizar el stock del producto");
    }
  }
  async emptyCart(id) {
    try {
      validateObjectId([id]);

      logger.info(`Intentando vaciar el carrito del usuario con ID: ${id}`);

      // Encuentra el carrito por el ID del usuario
      const cart = await Cart.findById(id);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      // Vacía el carrito eliminando todos los productos
      cart.products = [];
      await cart.save();

      logger.info(`Carrito del usuario con ID: ${id} vaciado exitosamente`);
      return cart;
    } catch (error) {
      logger.error("Error al vaciar el carrito:", error);
      throw new Error("No se pudo vaciar el carrito");
    }
  }
}


export default CartManager;
