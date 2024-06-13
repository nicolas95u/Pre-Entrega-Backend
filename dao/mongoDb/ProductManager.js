const Product = require("../../models/products");

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

  async getProductDescription(id) {
    const product = await Product.findById(id);
    if (product) {
      return product.description;
    }
    return null;
  }

  async updateProduct(id, newData) {
    await Product.findByIdAndUpdate(id, newData);
  }

  async deleteProduct(id) {
    await Product.findByIdAndDelete(id);
  }
}

module.exports = ProductManager;
