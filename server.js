const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const exphbs = require("express-handlebars");
const productRouter = require("./routes/product.router");
const cartRouter = require("./routes/cart.router");
const ProductManager = require("./ProductManager");
const mongoose = require('mongoose');


const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const productManager = new ProductManager("products.json");

const PORT = 8080;
app.use(express.json());
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

app.set("views", "./views");

app.get("/", (req, res) => {
  res.render("home", {
    products: productManager.getProducts(),
  });
});

app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

app.use("/products", productRouter);
app.use("/cart", cartRouter);

io.on("connection", (socket) => {
  console.log("A client connected");

  socket.on("createProduct", (productData) => {
    productManager.addProduct(productData);
    io.emit("productCreated", {
      title: productData.title,
      id: productData.id,
    });
    console.log("Product added");
  });
  socket.on("deleteProduct", (productData) => {
    console.log(productData);
    productManager.deleteProduct(productData);
    io.emit("productDeleted", {
      message: "Product deleted",
    });

    console.log("Product deleted");
  });

  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});

mongoose.connect('mongodb+srv://nicolas95u:<XRxK5mr9G9Q0OZxV>@cluster0.84npekh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
