const Cart = require("../models/carts"); // Importa el modelo de carritos definido en '../models/carts.js'

class CartManager {
  async addCart(products) {
    try {
      const cart = new Cart({ products });
      await cart.save();
      console.log("Carrito creado correctamente.");
    } catch (error) {
      console.error("Error al crear el carrito:", error);
      throw new Error("No se pudo crear el carrito");
    }
  }

  async getCarts() {
    try {
      return await Cart.find();
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      throw new Error("No se pudo obtener el carrito");
    }
  }

  async getCartById(id) {
    try {
      return await Cart.findById(id);
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      throw new Error("No se pudo obtener el carrito");
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      // Verificar si el producto ya está en el carrito
      const existingProduct = cart.products.find((product) => product.product.equals(productId));

      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }

      await cart.save();
      console.log("Producto añadido al carrito correctamente.");
    } catch (error) {
      console.error("Error al añadir el producto al carrito:", error);
      throw new Error("No se pudo añadir el producto al carrito");
    }
  }
}

module.exports = CartManager;
