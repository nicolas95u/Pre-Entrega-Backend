const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.products = [];
        this.loadProducts();
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf8');
            this.products = JSON.parse(data);
        } catch (error) {
            console.error('Error loading products:', error);
            throw new Error('Unable to load products');
        }
    }

    saveProducts() {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2));
            console.log('Products saved successfully.');
        } catch (error) {
            console.error('Error saving products:', error);
            throw new Error('Unable to save products');
        }
    }

    addProduct(product) {
        if (!product || typeof product !== 'object') {
            throw new Error('Invalid product data');
        }
        product.id = this.products.length + 1; 
        this.products.push(product);
        this.saveProducts();
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    updateProduct(id, newData) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...newData };
            this.saveProducts();
            return true;
        }
        return false;
    }

    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            this.saveProducts();
            return true;
        }
        return false;
    }
}

module.exports = ProductManager;
