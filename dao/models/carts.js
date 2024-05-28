const { Schema, model } = require("mongoose");
const Product = require("./products");

const cartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" }, // Referencia al modelo 'User'
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product" }, // Referencia al modelo 'Product'
      quantity: Number,
    },
  ],
});

const Cart = model("Cart", cartSchema);

module.exports = {
  Cart,
};
