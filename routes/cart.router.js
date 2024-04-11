const express = require("express");
const CartManager = require("../dao/mongoDb/CartManager");
const cartManager = new CartManager(); // chequear
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    cartManager.addCart([]); 
    res.status(201).json({ message: "Carrito creado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = cartManager.getCartById(parseInt(cid));

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    cartManager.addProduct(parseInt(cid), parseInt(pid));
    res.status(201).json({ message: "Producto añadido al carrito correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al añadir el producto al carrito" });
  }
});

module.exports = router;
