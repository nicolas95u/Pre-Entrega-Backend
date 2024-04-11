const { Schema, model } = require("mongoose");
const productSchema = new Schema({
  title: String,
  description: String,
  code: String,
  price: Number,
  status: Boolean,
  stock: Number,
  category: String,
  thumbnails: [String],
});
const Product = model("Product", productSchema);
module.exports = Product;

