const express = require("express");
const ProductManager = require("../ProductManager");
const productManager = new ProductManager("products.json");
const { validateNumber } = require("../utils/validator/number.utils");
const { validateString } = require("../utils/validator/string.utils");
const { validateArrayOfStrings } = require("../utils/validator/array.utils");
const { validateTrue } = require("../utils/validator/boolean.utils");

const {
  validateStringFields,
} = require("../middlewares/validation/string.middleware");

const {
  validateNumberFields,
} = require("../middlewares/validation/number.middleware");
const {
  validateTrueField,
} = require("../middlewares/validation/boolean.middleware");
const {
  validateArrayOfStringsField,
} = require("../middlewares/validation/array.middleware");

const router = express.Router();

router.post(
  "/",
  validateStringFields(["title", "description", "code", "category"]),
  validateNumberFields(["price", "stock"]),
  validateTrueField("status"),
  validateArrayOfStringsField("thumbnails"),
  (req, res) => {
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

    productManager.addProduct({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    });
    res.status(201).json({ message: "Producto creado correctamente :)" });
    return;
  }
);

router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit;
    let products = await productManager.getProducts();

    if (limit) {
      const limitNum = parseInt(limit);
      products = products.slice(0, limitNum);
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener producto" });
  }
});

router.put("/:pid", async (req, res) => {
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

    if (title !== undefined && validateString([title])) {
      object.title = title;
    }
    if (description !== undefined && validateString([description])) {
      object.description = description;
    }
    if (code !== undefined && validateString([code])) {
      object.code = code;
    }
    if (price !== undefined && validateNumber([price])) {
      object.price = price;
    }
    if (typeof status == "boolean") {
      object.status = status;
    }
    if (stock !== undefined && validateNumber([stock])) {
      object.stock = stock;
    }
    if (category !== undefined && validateString([category])) {
      object.category = category;
    }
    if (thumbnails && validateArrayOfStrings(thumbnails)) {
      object.thumbnails = thumbnails;
    }

    const productUpdated = productManager.updateProduct(parseInt(id), object);

    if (!productUpdated) {
      res.status(404).json({ error: "Error 404: producto no encontrado" });
      return;
    }
    res.status(200).json({ message: "Producto editado correctamente :)" });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener producto" });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = productManager.deleteProduct(productId);

    if (product) {
      res.json({ message: "Producto eliminado correctamente." });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener producto" });
  }
});

module.exports = router;
