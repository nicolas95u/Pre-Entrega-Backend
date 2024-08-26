import ProductManager from "../dao/mongoDb/ProductManagerMongo.js";
import logger from '../config/logger.js';
const productManager = new ProductManager();

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    logger.info("A client connected");

    socket.on("createProduct", async (productData) => {
      await productManager.addProduct(productData);
      io.emit("productCreated", {
        title: productData.title,
        id: productData.id,
      });
      logger.info("Product added");
    });

    socket.on("deleteProduct", async (productData) => {
      await productManager.deleteProduct(productData);
      io.emit("productDeleted", {
        message: "Product deleted",
      });
      logger.info("Product deleted");
    });

    socket.on("disconnect", () => {
      logger.info("A client disconnected");
    });
  });
};

export default socketHandler;
