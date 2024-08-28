const CartManager = require("../dao/mongoDb/CartManager");
const cartManager = new CartManager();
const ProductManager = require("../dao/mongoDb/ProductManager");
const productManager = new ProductManager();
const logger = require("../config/logger");

exports.addToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const product = await productManager.getProductById(pid);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    if (req.user.role === "premium" && product.owner === req.user.email) {
      return res.status(403).json({ error: "No puedes agregar tu propio producto al carrito" });
    }

    const updatedCart = await cartManager.addToCart(cid, pid);

    res.status(200).json(updatedCart);
  } catch (error) {
    logger.error("Error al agregar producto al carrito:", error);
    res.status(500).json({ error: "Error al agregar producto al carrito" });
  }
};

exports.createCart = async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    logger.error("Error al crear carrito:", error);
    res.status(500).json({ error: "Error al crear carrito" });
  }
};

exports.getCartById = async (req, res) => {
  try {
    const { cid } = req.params;
   
    const cart = await cartManager.getCartById(cid);
    
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.status(200).json(cart);
  } catch (error) {
    logger.error("Error al obtener carrito:", error);
    res.status(500).json({ error: "Error al obtener carrito" });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    const updatedCart = await cartManager.updateCart(cid, products);

    if (!updatedCart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.status(200).json(updatedCart);
  } catch (error) {
    logger.error("Error al actualizar carrito:", error);
    res.status(500).json({ error: "Error al actualizar carrito" });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const deletedCart = await cartManager.deleteCart(cid);

    if (!deletedCart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.status(200).json({ message: "Carrito eliminado correctamente" });
  } catch (error) {
    logger.error("Error al eliminar carrito:", error);
    res.status(500).json({ error: "Error al eliminar carrito" });
  }
};

exports.deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartManager.deleteProductFromCart(cid, pid);

    if (!updatedCart) {
      return res.status(404).json({ error: "Carrito o producto no encontrado" });
    }

    res.status(200).json(updatedCart);
  } catch (error) {
    logger.error("Error al eliminar producto del carrito:", error);
    res.status(500).json({ error: "Error al eliminar producto del carrito" });
  }
};

exports.emptyCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const emptiedCart = await cartManager.emptyCart(cid);

    if (!emptiedCart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.status(200).json({ message: "Carrito vaciado correctamente" });
  } catch (error) {
    logger.error("Error al vaciar carrito:", error);
    res.status(500).json({ error: "Error al vaciar carrito" });
  }
};
