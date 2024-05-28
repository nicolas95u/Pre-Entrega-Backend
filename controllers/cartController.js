const CartManager = require("../dao/mongoDb/CartManager");
const cartManager = new CartManager();

exports.updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    await cartManager.updateProductQuantity(
      parseInt(cid),
      parseInt(pid),
      parseInt(quantity)
    );

    res
      .status(200)
      .json({ message: "Cantidad de producto actualizada correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error al actualizar la cantidad del producto en el carrito",
      });
  }
};

exports.createCart = async (req, res) => {
  try {
    const userId = req.userId; // Obtener ID del usuario de la solicitud
    const cartId = await cartManager.createCart(userId); // Crear el carrito

    res
      .status(201)
      .json({ message: "Carrito creado correctamente", cartId: cartId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear carrito" });
  }
};

exports.removeProduct = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    await cartManager.removeProduct(parseInt(cid), parseInt(pid));

    res
      .status(200)
      .json({ message: "Producto eliminado del carrito correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar el producto del carrito" });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const { cid } = req.params;

    await cartManager.clearCart(parseInt(cid));

    res.status(200).json({ message: "Carrito vaciado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al vaciar el carrito" });
  }
};

exports.getCartWithDetails = async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await cartManager.getCartWithDetails(parseInt(cid));

    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener el carrito con detalles de productos" });
  }
};
