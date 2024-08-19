import express from 'express';
import CartManager from '../dao/mongoDb/CartManagerMongo.js';
import Ticket from '../models/ticket.js';
import isUser from '../middlewares/validation/isUser.middleware.js';
import logger from '../config/logger.js';

const router = express.Router();
const cartManager = new CartManager();

/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       required:
 *         - userId
 *         - products
 *       properties:
 *         id:
 *           type: string
 *           description: El ID del carrito
 *         userId:
 *           type: string
 *           description: El ID del usuario
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: El ID del producto
 *               quantity:
 *                 type: number
 *                 description: La cantidad del producto
 *       example:
 *         userId: "603e5f3e9f1b1b0017f5d2b8"
 *         products: [{ productId: "603e5f3e9f1b1b0017f5d2b9", quantity: 2 }]
 */

/**
 * @swagger
 * /api/carts/add-to-cart:
 *   post:
 *     summary: Añade un producto al carrito
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *             example:
 *               productId: "603e5f3e9f1b1b0017f5d2b9"
 *               quantity: 2
 *     responses:
 *       200:
 *         description: Producto añadido al carrito
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al añadir producto al carrito
 */
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

/**
 * @swagger
 * /api/carts/{cid}:
 *   get:
 *     summary: Obtiene un carrito por ID con detalles completos de productos usando "populate"
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del carrito
 *     responses:
 *       200:
 *         description: Carrito encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Carrito no encontrado
 *       500:
 *         description: Error al obtener el carrito
 */
router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await cartManager.getCartById(cid);

    res.status(200).json(cart);
  } catch {
    res
      .status(500)
      .json({ error: "Error al obtener el carrito con detalles de productos" });
  }
});

/**
 * @swagger
 * /api/carts/{cid}/purchase:
 *   post:
 *     summary: Finaliza la compra y genera un ticket
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del carrito
 *     responses:
 *       200:
 *         description: Compra finalizada y ticket generado
 *       404:
 *         description: Carrito no encontrado
 *       400:
 *         description: No hay suficiente stock para algún producto
 *       500:
 *         description: Error al procesar la compra
 */
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

    res.json(ticket);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Error procesando la compra' });
  }
});

export default router;
