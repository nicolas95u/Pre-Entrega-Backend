
const { Schema, model } = require("mongoose");
const messageSchema = new Schema({
    message : String,
    date : { type: Date, default: Date.now },
});
const Message = model("Message", messageSchema);
module.exports = Message;


