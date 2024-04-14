const express = require("express");
const router = express.Router();
const ProductManager = require("../dao/mongoDb/ProductManager");
const productManager = new ProductManager();
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

// POST '/': Crea un nuevo producto
router.post(
  '/',
  validateStringFields(['title', 'description', 'code', 'category']),
  validateNumberFields(['price', 'stock']),
  validateTrueField('status'),
  validateArrayOfStringsField('thumbnails'),
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

    const newProduct = {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    };

    io.emit('createProduct', newProduct);

    productManager.addProduct(newProduct);

    res.status(201).json({ message: 'Producto creado correctamente :)' });
  }
);

// POST '/:pid/reviews': Agrega una revisión a un producto
router.post(
  '/:pid/reviews',
  validateNumberFields(['rating']),
  validateStringFields(['comment']),
  (req, res) => {
    const { pid } = req.params;
    const { rating, comment } = req.body;

    // Lógica para agregar la revisión al producto con ID pid

    res.status(201).json({ message: 'Revisión creada correctamente :)' });
  }
);

// GET '/': Obtiene todos los productos o los limita según el parámetro de consulta
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

// GET '/:pid': Obtiene un producto por su ID
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

// PUT '/:pid': Actualiza un producto por su ID
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

// DELETE '/:pid': Elimina un producto por su ID
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

// GET '/:pid/description': Obtiene la descripción completa de un producto por su ID
router.get("/:pid/description", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductDescription(productId);

    if (product) {
      res.json({ description: product.description });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la descripción del producto" });
  }
});


// GET '/products': Obtiene todos los productos con paginación, ordenamiento y filtrado
router.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, category, availability } = req.query;
    let query = {};

    // Agregar lógica de filtrado por categoría y disponibilidad
    if (category) {
      query.category = category;
    }
    if (availability) {
      query.availability = availability;
    }

    // Agregar lógica de ordenamiento por precio
    let sortQuery = {};
    if (sort === 'price') {
      sortQuery.price = 1; // Orden ascendente por precio
    } else if (sort === '-price') {
      sortQuery.price = -1; // Orden descendente por precio
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortQuery,
    };

    const products = await productManager.getProducts(query, options);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

module.exports = router;
