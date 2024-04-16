const { Schema, model } = require("mongoose");
const Product = require("./products");
const CartManager = require("../dao/mongoDb/CartManager"); // Importar CartManager
const { validateObjectId } = require("../utils/validator/objectId.utils");

const cartSchema = new Schema({
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    },
  ],
});

const Cart = model("Cart", cartSchema);

async function createCart(userId) {
  try {
    validateObjectId([userId]);

    const newCart = {
      userId: userId,
      items: [],
    };

    const cartManager = new CartManager(); // Crear una instancia de CartManager
    await cartManager.addCart(newCart);

    return newCart._id;
  } catch (error) {
    console.error(error);
    throw new Error("Error al crear carrito");
  }
}

module.exports = {
  Cart,
  createCart,
};
