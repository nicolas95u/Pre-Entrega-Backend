
const { Schema, model } = require("mongoose");
const Product = require("./products");
const cartSchema = new Schema({
  products: [
    {
      product: { type: Product.schema, ref: "Product" },
      quantity: Number,
    },
  ],
});
const Cart = model("Cart", cartSchema);
module.exports = Cart;