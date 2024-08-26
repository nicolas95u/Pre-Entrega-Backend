import fs from 'fs';
import logger from '/config/logger';

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.products = [];
    this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.filePath, "utf8");
      this.products = JSON.parse(data);
    } catch (error) {
      logger.error("Error loading products:", error);
      throw new Error("Unable to load products");
    }
  }

  saveProducts() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2));
      logger.info("Products saved successfully.");
    } catch (error) {
      logger.error("Error saving products:", error);
      throw new Error("Unable to save products");
    }
  }

  addProduct(product) {
    if (!product || typeof product !== "object") {
      throw new Error("Invalid product data");
    }
    product.id = this.products.length + 1;
    this.products.push(product);
    this.saveProducts();
  }

  getProducts(limit = 10, page = 1, sort = 'asc', query = '') {
    let filteredProducts = [...this.products];

    if (query) {
      filteredProducts = filteredProducts.filter(product => product.category === query);
    }

    if (sort === 'asc') {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sort === 'desc') {
      filteredProducts.sort((a, b) => b.price - a.price);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filteredProducts.length / limit);
    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;

    return {
      products: paginatedProducts,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage: prevPage !== null,
      hasNextPage: nextPage !== null,
      prevLink: prevPage ? `/productos?limit=${limit}&page=${prevPage}&sort=${sort}&query=${query}` : null,
      nextLink: nextPage ? `/productos?limit=${limit}&page=${nextPage}&sort=${sort}&query=${query}` : null,
    };
  }

  getProductById(id) {
    return this.products.find((product) => product.id === id);
  }

  updateProduct(id, newData) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...newData };
      this.saveProducts();
      return true;
    }
    return false;
  }

  deleteProduct(id) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.saveProducts();
      return true;
    }
    return false;
  }
}

export default ProductManager;
