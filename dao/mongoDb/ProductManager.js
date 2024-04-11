const Product = require("../models/products");

class ProductManager {
  constructor() {
    this.products = [];
  }

  async addProduct(product) {
    const newProduct = new Product(product);
    await newProduct.save();
  }

  async getProducts() {
    return await Product.find();
  }

  async getProductById(id) {
    return await Product.findById(id);
  }

  async updateProduct(id, newData) {
    await Product.findByIdAndUpdate(id, newData); // chequear
  }

  async deleteProduct(id) {
    await Product.findByIdAndDelete(id); // chequear
  }
}
module.exports = ProductManager;
