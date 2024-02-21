class ProductManager {
    constructor() {
      this.products = [];
      this.next_id = 1;
    }
  
    addProduct(title, description, price, thumbnail, code, stock) {
      if (this.products.some((p) => p.code === code)) {
        console.log(`Ya existe un producto con el codigo ${code}`);
        return;
      }
      if (
        !title ||
        !description ||
        !price ||
        !thumbnail ||
        !code ||
        stock === undefined
      ) {
        console.log(
          "Un producto requiere de: title, description, price, thumbnail, code, stock "
        );
        return;
      }
      const newProduct = {
        id: this.next_id++,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };
      console.log(this.next_id);
      console.log(newProduct);
      this.products.push(newProduct);
    }
  
    getProducts() {
      return this.products;
    }
  
    getProductById(id) {
      const product = this.products.find((elem) => {
        if (elem.id === id) return elem;
      });
      if (product) return product;
      else console.log("Error 404 Not found");
    }
  }
  
  const productManager = new ProductManager();