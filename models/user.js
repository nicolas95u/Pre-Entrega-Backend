const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  cart: { type: Schema.Types.ObjectId, ref: "Cart" },
  role: { type: String, default: "user", enum: ["user", "admin", "premium"] }, 
  githubId: { type: String },
  githubAccessToken: { type: String }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
