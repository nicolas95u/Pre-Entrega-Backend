import fs from 'fs';
import logger from '/config/logger';

class CartManagerFS {
  constructor(filePath) {
    this.filePath = filePath;
    this.carts = [];
    this.loadCarts();
  }

  loadCarts() {
    try {
      const data = fs.readFileSync(this.filePath, "utf8");
      this.carts = JSON.parse(data);
    } catch (error) {
      logger.error("Error loading carts:", error);
      throw new Error("Unable to load carts");
    }
  }

  saveCarts() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.carts, null, 2));
      logger.info("Carts saved successfully.");
    } catch (error) {
      logger.error("Error saving carts:", error);
      throw new Error("Unable to save carts");
    }
  }

  addCart(products) {
    if (!products || !Array.isArray(products)) {
      throw new Error("Invalid cart data");
    }
    const cart = { id: this.carts.length + 1, products };
    this.carts.push(cart);
    this.saveCarts();
  }

  getCarts() {
    return this.carts;
  }

  getCartById(id) {
    return this.carts.find((cart) => cart.id === id);
  }

  addProduct(cid, pid) {
    const cart = this.getCartById(cid);

    const index = cart.products.findIndex((product) => product.product === pid);

    if (index !== -1) {
      cart.products[index].quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }
    this.saveCarts();
  }
}

export default CartManagerFS;
