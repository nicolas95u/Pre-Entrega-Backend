const { Schema, model } = require("mongoose");

const ticketSchema = new Schema({
  code: { type: String, required: true, unique: true },
  purchase_datetime: { type: Date, required: true },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true },
});

const Ticket = model("Ticket", ticketSchema);

module.exports = Ticket;
