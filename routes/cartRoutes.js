import express from 'express';
import CartManager from '../dao/mongoDb/CartManagerMongo.js';
import Ticket from '../models/ticket.js';
import isUser from '../middlewares/validation/isUser.middleware.js';
import logger from '../config/logger.js';

const router = express.Router();
const cartManager = new CartManager();

router.post('/add-to-cart', isUser, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  try {
    if (!productId || !quantity) {
     
      throw new Error("Faltan datos en la solicitud");
    }

    logger.info(`Agregando producto al carrito: ${productId} para el usuario: ${userId} con cantidad: ${quantity}`);
    const cart = await cartManager.addProductToCart(userId, productId, quantity);
    res.status(200).json({ message: 'Producto agregado al carrito', cart });
    req.io.emit('cartUpdated', cart); 
  } catch (error) {
    logger.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ message: 'Error al agregar producto al carrito', error: error.message });
  
}
});


router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito con detalles de productos" });
  }
});

router.post('/:cid/purchase', isUser, async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await cartManager.getCartById(cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    let totalAmount = 0;
    for (const item of cart.products) {
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

    for (const item of cart.products) {
      await cartManager.updateProductStock(item.product._id, -item.quantity);
    }
    const emptiedCart = await cartManager.emptyCart(cartId);
    res.status(201).redirect("/profile")
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Error procesando la compra' });
  }
});

export default router;
