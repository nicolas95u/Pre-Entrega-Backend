import ProductManager from "../dao/mongoDb/ProductManager.js";
const productManager = new ProductManager();

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("A client connected");

    socket.on("createProduct", async (productData) => {
      await productManager.addProduct(productData);
      io.emit("productCreated", {
        title: productData.title,
        id: productData.id,
      });
      console.log("Product added");
    });

    socket.on("deleteProduct", async (productData) => {
      await productManager.deleteProduct(productData);
      io.emit("productDeleted", {
        message: "Product deleted",
      });
      console.log("Product deleted");
    });

    socket.on("disconnect", () => {
      console.log("A client disconnected");
    });
  });
};

export default socketHandler;
