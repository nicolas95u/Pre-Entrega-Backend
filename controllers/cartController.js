const CartManager = require("../dao/mongoDb/CartManager");
const cartManager = new CartManager();
const {
  validateObjectId
} = require("../utils/validator/objectId.utils");
const logger = require("../config/logger");

exports.createCart = async (req, res) => {
  const {
    userId
  } = req.body;

  try {
    validateObjectId([userId]);

    const newCart = {
      userId: userId,
      products: [],
    };

    const cartManager = new CartManager();
    await cartManager.addCart(newCart);

    logger.info("Carrito creado correctamente.");
    res.status(201).json({
      message: "Carrito creado correctamente :)", cartId: newCart._id
    });
  } catch (error) {
    logger.error("Error al crear carrito:", error);
    res.status(500).json({
      error: "Error al crear carrito"
    });
  }
};

exports.addProductToCart = async (req, res) => {
  const {
    productId,
    quantity
  } = req.body;
  const userId = req.user._id;

  try {
    const cart = await cartManager.addProductToCart(userId, productId, quantity);
    logger.info("Producto agregado al carrito correctamente.");
    res.status(200).json({
      message: 'Producto agregado al carrito',
      cart
    });
  } catch (error) {
    logger.error("Error al agregar producto al carrito:", error);
    res.status(500).json({
      message: 'Error al agregar producto al carrito',
      error: error.message
    });
  }
};

exports.getCartById = async (req, res) => {
  try {
    const {
      cid
    } = req.params;

    const cart = await cartManager.getCartById(cid);
    res.status(200).json(cart);
  } catch (error) {
    logger.error("Error al obtener el carrito con detalles de productos:", error);
    res.status(500).json({
      error: "Error al obtener el carrito con detalles de productos"
    });
  }
};

exports.purchaseCart = async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await cartManager.getCartById(cartId);
    if (!cart) {
      return res.status(404).json({
        message: 'Carrito no encontrado'
      });
    }

    let totalAmount = 0;
    for (let item of cart.products) {
      const product = await cartManager.getProductById(item.product._id);
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `No hay suficiente stock para el producto ${product.title}`
        });
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

    logger.info("Compra realizada correctamente.");
    res.json(ticket);
  } catch (error) {
    logger.error("Error procesando la compra:", error);
    res.status(500).json({
      message: 'Error procesando la compra'
    });
  }
};
