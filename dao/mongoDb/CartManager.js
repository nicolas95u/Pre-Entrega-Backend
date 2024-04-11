const Cart = require("../models/carts");

class CartManager {
  constructor() {
    this.carts = [];
  }

  async addCart(products) {
    const cart = new Cart({ products });
    await cart.save();
  }

  async getCarts() {
    return await Cart.find();
  }

  async getCartById(id) {
    return await Cart.findById(id);
  }

  async addProduct(cid, pid) {
    const cart = await this.getCartById(cid);
    const productIndex = cart.products.findIndex((product) => product.product === pid);
    if (productIndex !== -1) {
      cart.products[productIndex].quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }
    await cart.save();
  }
}
module.exports = CartManager;
