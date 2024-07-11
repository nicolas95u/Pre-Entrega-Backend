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

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - code
 *         - price
 *         - stock
 *         - category
 *       properties:
 *         id:
 *           type: string
 *           description: El ID del producto
 *         title:
 *           type: string
 *           description: El título del producto
 *         description:
 *           type: string
 *           description: La descripción del producto
 *         code:
 *           type: string
 *           description: El código del producto
 *         price:
 *           type: number
 *           description: El precio del producto
 *         stock:
 *           type: number
 *           description: El stock del producto
 *         category:
 *           type: string
 *           description: La categoría del producto
 *         thumbnails:
 *           type: array
 *           items:
 *             type: string
 *           description: Las imágenes del producto
 *         status:
 *           type: boolean
 *           description: El estado del producto
 *         owner:
 *           type: string
 *           description: El dueño del producto
 *       example:
 *         title: "Camiseta"
 *         description: "Camiseta de algodón 100%"
 *         code: "CAM123"
 *         price: 19.99
 *         stock: 100
 *         category: "Ropa"
 *         thumbnails: ["image1.jpg", "image2.jpg"]
 *         status: true
 *         owner: "admin@example.com"
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Devuelve una lista de productos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get("/", productController.getAllProducts);

/**
 * @swagger
 * /api/products/{pid}:
 *   get:
 *     summary: Obtiene un producto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado
 */
router.get("/:pid", productController.getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crea un nuevo producto
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Producto creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error al crear producto
 */
router.post(
  "/",
  validateStringFields(["title", "description", "code", "category"]),
  validateNumberFields(["price", "stock"]),
  validateTrueField("status"),
  validateArrayOfStringsField("thumbnails"),
  productController.createProduct
);

/**
 * @swagger
 * /api/products/{pid}/reviews:
 *   post:
 *     summary: Agrega una revisión a un producto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *             example:
 *               rating: 5
 *               comment: "Excelente producto"
 *     responses:
 *       201:
 *         description: Revisión creada
 *       500:
 *         description: Error al crear revisión
 */
router.post(
  "/:pid/reviews",
  validateNumberFields(["rating"]),
  validateStringFields(["comment"]),
  productController.addReview
);

/**
 * @swagger
 * /api/products/{pid}:
 *   put:
 *     summary: Actualiza un producto por su ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al actualizar producto
 */
router.put("/:pid", productController.updateProduct);

/**
 * @swagger
 * /api/products/{pid}:
 *   delete:
 *     summary: Elimina un producto por su ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al eliminar producto
 */
router.delete("/:pid", productController.deleteProduct);

/**
 * @swagger
 * /api/products/{pid}/description:
 *   get:
 *     summary: Obtiene la descripción completa de un producto por su ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del producto
 *     responses:
 *       200:
 *         description: Descripción del producto
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al obtener la descripción del producto
 */
router.get("/:pid/description", productController.getProductDescription);

/**
 * @swagger
 * /api/products/pagination:
 *   get:
 *     summary: Obtiene todos los productos con paginación, ordenamiento y filtrado
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Límite de productos por página
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Ordenamiento de los productos
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Categoría de los productos
 *       - in: query
 *         name: availability
 *         schema:
 *           type: string
 *         description: Disponibilidad de los productos
 *     responses:
 *       200:
 *         description: Lista de productos con paginación
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error al obtener productos
 */
router.get("/products/pagination", productController.getProductsWithPagination);

module.exports = router;
