const express = require("express");
const productRouter = require("./routes/product.router");
const cartRouter = require("./routes/cart.router");

const app = express();
const PORT = 8080;
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

app.use("/products", productRouter);
app.use("/cart", cartRouter);
