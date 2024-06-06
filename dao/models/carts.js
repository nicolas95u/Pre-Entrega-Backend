const { Schema, model } = require("mongoose");

const cartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    },
  ],
});

const Cart = model("Cart", cartSchema);

module.exports = Cart;
