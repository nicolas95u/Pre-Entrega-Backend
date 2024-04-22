const Cart = require("../models/carts"); // Importar el modelo de carritos
const { validateObjectId } = require("../../utils/validator/objectId.utils"); // Importar la función de validación de ObjectId

class CartManager {
  async createCart(userId) {
    try {
      validateObjectId([userId]); // Validar ID de usuario

      const newCart = {
        userId: userId,
        products: [], // Considerar usar 'items' para consistencia con el esquema
      };

      const cartManager = new CartManager(); // Crear una instancia de CartManager
      await cartManager.addCart(newCart); // Agregar el nuevo carrito

      return newCart._id;
    } catch (error) {
      console.error(error);
      throw new Error("Error al crear carrito");
    }
  }

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
