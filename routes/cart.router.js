const express = require("express");
const CartManager = require("../dao/mongoDb/CartManager");
const Product = require("../models/products"); // Importar el modelo de productos
const cartManager = new CartManager(); // chequear
const router = express.Router();

// Endpoint para actualizar la cantidad de un producto en el carrito
router.put("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    await cartManager.updateProductQuantity(parseInt(cid), parseInt(pid), parseInt(quantity));

    res.status(200).json({ message: "Cantidad de producto actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la cantidad del producto en el carrito" });
  }
});

// Endpoint para eliminar un producto específico del carrito
router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    await cartManager.removeProduct(parseInt(cid), parseInt(pid));

    res.status(200).json({ message: "Producto eliminado del carrito correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto del carrito" });
  }
});

// Endpoint para vaciar completamente el carrito
router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    await cartManager.clearCart(parseInt(cid));

    res.status(200).json({ message: "Carrito vaciado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al vaciar el carrito" });
  }
});

// Endpoint para obtener un carrito con detalles completos de productos usando "populate"
router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    // Usar populate para obtener detalles completos de productos en el carrito
    const cart = await cartManager.getCartWithDetails(parseInt(cid));

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito con detalles de productos" });
  }
});

module.exports = router;
