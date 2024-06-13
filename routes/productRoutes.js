const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const generateMockProducts = require("../utils/validator/mocking");
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

// Endpoint de Mocking
router.get("/mockingproducts", (req, res) => {
  const mockProducts = generateMockProducts();
  res.status(200).json(mockProducts);
});

// POST '/': Crea un nuevo producto
router.post(
  "/",
  validateStringFields(["title", "description", "code", "category"]),
  validateNumberFields(["price", "stock"]),
  validateTrueField("status"),
  validateArrayOfStringsField("thumbnails"),
  productController.createProduct
);

// POST '/:pid/reviews': Agrega una revisión a un producto
router.post(
  "/:pid/reviews",
  validateNumberFields(["rating"]),
  validateStringFields(["comment"]),
  productController.addReview
);

// GET '/': Obtiene todos los productos o los limita según el parámetro de consulta
router.get("/", productController.getAllProducts);

// GET '/:pid': Obtiene un producto por su ID
router.get("/:pid", productController.getProductById);

// PUT '/:pid': Actualiza un producto por su ID
router.put("/:pid", productController.updateProduct);

// DELETE '/:pid': Elimina un producto por su ID
router.delete("/:pid", productController.deleteProduct);

// GET '/:pid/description': Obtiene la descripción completa de un producto por su ID
router.get("/:pid/description", productController.getProductDescription);

// GET '/products': Obtiene todos los productos con paginación, ordenamiento y filtrado
router.get("/products", productController.getProductsWithPagination);

module.exports = router;
