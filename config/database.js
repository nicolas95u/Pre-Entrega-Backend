const mongoose = require("mongoose");

const connectToDatabase = async (mongoUrl) => {
  try {
    await mongoose.connect(mongoUrl, {});
    console.log("Conectado a la base de datos");
  } catch (error) {
    console.error("Error al conectar a la base de datos", error);
  }
};

module.exports = { connectToDatabase };
