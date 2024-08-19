import ProductManager from "../dao/mongoDb/ProductManagerMongo.js";
import {
  validateNumberFields,
  validateStringFields,
  validateArrayOfStringsField,
} from "../utils/validator/index.js";
import logger from "../config/logger.js";
import nodemailer from 'nodemailer';  
import User from '../models/user.js'; 

const productManager = new ProductManager();

const createProduct = async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;

  const owner = req.user.role === "premium" ? req.user.email : "admin";

  const newProduct = {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
    owner,
  };

  try {
    await productManager.addProduct(newProduct);
    logger.info("Producto creado correctamente.");
    res.status(201).json({ message: "Producto creado correctamente :)" });
  } catch (error) {
    logger.error("Error al crear producto:", error);
    res.status(500).json({ error: "Error al crear producto" });
  }
};

const addReview = async (req, res) => {
  try {
    logger.info("Revisión creada correctamente.");
    res.status(201).json({ message: "Revisión creada correctamente :)" });
  } catch (error) {
    logger.error("Error al crear revisión:", error);
    res.status(500).json({ error: "Error al crear revisión" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const limit = req.query.limit;
    let products = await productManager.getProducts();

    if (limit) {
      const limitNum = parseInt(limit);
      products = products.slice(0, limitNum);
    }

    res.json(products);
  } catch (error) {
    logger.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productManager.getProductById(productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    logger.error("Error al obtener producto:", error);
    res.status(500).json({ error: "Error al obtener producto" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = req.body;

    const id = req.params.pid;
    const object = {};

    const product = await productManager.getProductById(id);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    if (req.user.role !== "admin" && product.owner !== req.user.email) {
      return res.status(403).json({ error: "No tienes permiso para actualizar este producto" });
    }

    if (title !== undefined && validateStringFields([title])) {
      object.title = title;
    }
    if (description !== undefined && validateStringFields([description])) {
      object.description = description;
    }
    if (code !== undefined && validateStringFields([code])) {
      object.code = code;
    }
    if (price !== undefined && validateNumberFields([price])) {
      object.price = price;
    }
    if (typeof status === "boolean") {
      object.status = status;
    }
    if (stock !== undefined && validateNumberFields([stock])) {
      object.stock = stock;
    }
    if (category !== undefined && validateStringFields([category])) {
      object.category = category;
    }
    if (thumbnails && validateArrayOfStringsField(thumbnails)) {
      object.thumbnails = thumbnails;
    }

    const productUpdated = await productManager.updateProduct(id, object);

    if (!productUpdated) {
      res.status(404).json({ error: "Error 404: producto no encontrado" });
      return;
    }
    logger.info("Producto editado correctamente.");
    res.status(200).json({ message: "Producto editado correctamente :)" });
  } catch (error) {
    logger.error("Error al actualizar producto:", error);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productManager.getProductById(productId);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    if (req.user.role !== "admin" && product.owner !== req.user.email) {
      return res.status(403).json({ error: "No tienes permiso para eliminar este producto" });
    }

    const owner = await User.findOne({ email: product.owner });
    if (owner && owner.role === 'premium') {
      await sendDeletionEmail(owner.email, product.title);
    }

    await productManager.deleteProduct(productId);
    logger.info("Producto eliminado correctamente.");
    res.json({ message: "Producto eliminado correctamente." });
  } catch (error) {
    logger.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};

const sendDeletionEmail = async (email, productName) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Producto eliminado',
    text: `Tu producto "${productName}" ha sido eliminado del catálogo.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info('Correo enviado:', info.response);
  } catch (error) {
    logger.error('Error al enviar correo:', error);
  }
};

const getProductDescription = async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productManager.getProductDescription(productId);

    if (product) {
      res.json({ description: product.description });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    logger.error("Error al obtener la descripción del producto:", error);
    res.status(500).json({ error: "Error al obtener la descripción del producto" });
  }
};

const getProductsWithPagination = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, category, availability } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }
    if (availability) {
      query.availability = availability;
    }

    const sortQuery = {};
    if (sort === "price") {
      sortQuery.price = 1;
    } else if (sort === "-price") {
      sortQuery.price = -1;
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortQuery,
    };

    const products = await productManager.getProducts(query, options);
    res.json(products);
  } catch (error) {
    logger.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

export {
  createProduct,
  addReview,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductDescription,
  getProductsWithPagination
};
