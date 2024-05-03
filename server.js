const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const exphbs = require("express-handlebars");
const productRouter = require("./routes/product.router");
const cartRouter = require("./routes/cart.router");
const sessionRouter = require("./routes/session.router"); // Corrección en la importación
const ProductManager = require("./dao/mongoDb/ProductManager");
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { initializePassport } = require("./config/passport.config");
const passport = require("passport");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const productManager = new ProductManager();

const PORT = 8080;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(session({
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://nicolas95u:coder1234@cluster0.84npekh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', // Completa URL de conexión

    ttl: 30
  }),
  secret: 'asdasdasdasd',
  resave: false,
  saveUninitialized: false
}))

initializePassport();
app.use(passport.initialize());
app.use(passport.session());
// Cambios en la ruta '/' para implementar paginación y ordenamiento
app.get("/", async (req, res) => {
  try {
    const limit = req.query.limit || 10; // Valor por defecto si no se proporciona limit
    const page = req.query.page || 1; // Valor por defecto si no se proporciona page
    const sort = req.query.sort || ''; // Valor por defecto si no se proporciona sort

    // Lógica para obtener productos según los parámetros de consulta
    let products = await productManager.getProducts();
    // Aplicar ordenamiento por precio si se proporciona sort
    if (sort === 'asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'desc') {
      products.sort((a, b) => b.price - a.price);
    }

    // Calcular índices de inicio y fin para la paginación
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Obtener los productos de la página actual
    const paginatedProducts = products.slice(startIndex, endIndex);

    // Calcular el total de páginas
    const totalPages = Math.ceil(products.length / limit);

    res.render("home", {
      products,
      totalPages,
      page,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/products?page=${page - 1}&limit=${limit}&sort=${sort}` : null,
      nextLink: page < totalPages ? `/products?page=${page + 1}&limit=${limit}&sort=${sort}` : null,
      user: req.session.user // Pasar el usuario a la vista
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// Ruta '/realtimeproducts' (si es necesario)
app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

app.use("/products", productRouter);
app.use("/cart", cartRouter);
app.use("/session", sessionRouter);

// Ruta para iniciar sesión con GitHub
app.get("/github", (req, res) => {
  res.send({
    status: 'success',
    message: 'Success'
  });
});

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

app.get("/login", async (req, res) => {
  res.render("login");
});

app.get("/register", async (req, res) => {
  res.render("register");
});

app.get("/profile", async (req, res) => {
  res.render("profile");
});

mongoose.connect('mongodb+srv://nicolas95u:coder1234@cluster0.84npekh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
