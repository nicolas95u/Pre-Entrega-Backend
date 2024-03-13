const express = require("express");
const CartManager = require("../CartManager");
const cartManager = new CartManager("carrito.json");
const {
  validateArrayOfProducts,
} = require("../middlewares/validation/array.middleware");
const router = express.Router();

router.post("/", validateArrayOfProducts("products"), async (req, res) => {
  try {
    const { products } = req.body;

    cartManager.addCart(products);

    res.status(201).json({ message: "Carrito creado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = cartManager.getCartById(parseInt(cid));

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

router.post(
  "/:cid/product/:pid",
  validateArrayOfProducts("products"),
  async (req, res) => {
    try {
      const { cid, pid } = req.params;
      cartManager.addProduct(parseInt(cid), parseInt(pid));
      res.status(201).json({ message: "Carrito creado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al obtener productos" });
    }
  }
);

module.exports = router;
