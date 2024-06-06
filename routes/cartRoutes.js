const express = require('express');
const CartManager = require('../dao/mongoDb/CartManager');
const Ticket = require('../dao/models/ticket');
const isUser = require('../middlewares/validation/isUser.middleware');
const router = express.Router();
const cartManager = new CartManager();

// Endpoint para agregar productos al carrito
router.post('/add-to-cart', isUser, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  try {
    const cart = await cartManager.addProductToCart(userId, productId, quantity);
    res.status(200).json({ message: 'Producto agregado al carrito', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar producto al carrito', error: error.message });
  }
});

// Endpoint para obtener un carrito con detalles completos de productos usando "populate"
router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await cartManager.getCartById(cid);

    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener el carrito con detalles de productos" });
  }
});

// Endpoint para finalizar la compra y generar un ticket
router.post('/:cid/purchase', isUser, async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await cartManager.getCartById(cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    let totalAmount = 0;
    for (let item of cart.products) {
      const product = await cartManager.getProductById(item.product._id);
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `No hay suficiente stock para el producto ${product.title}` });
      }
      totalAmount += product.price * item.quantity;
    }

    const ticket = new Ticket({
      code: `TICKET-${Date.now()}`,
      purchase_datetime: new Date(),
      amount: totalAmount,
      purchaser: req.user.email,
    });
    await ticket.save();

    for (let item of cart.products) {
      await cartManager.updateProductStock(item.product._id, -item.quantity);
    }

    res.json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error procesando la compra' });
  }
});

module.exports = router;
