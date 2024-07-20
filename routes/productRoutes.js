import express from "express";
import {
  createProduct,
  addReview,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductDescription,
  getProductsWithPagination
} from "../controllers/productController.js";
import generateMockProducts from "../utils/validator/mocking.js";
import {
  validateStringFields,
  validateNumberFields,
  validateTrueField,
  validateArrayOfStringsField
} from "../middlewares/validation/index.js";

const router = express.Router();

router.get("/mockingproducts", (req, res) => {
  const mockProducts = generateMockProducts();
  res.status(200).json(mockProducts);
});

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
router.get("/", getAllProducts);

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
router.get("/:pid", getProductById);

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
  (req, res, next) => {
    if (!validateTrueField([req.body.status])) {
      return res.status(400).json({ error: "Invalid status field" });
    }
    next();
  },
  validateArrayOfStringsField("thumbnails"),
  createProduct
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
  addReview
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
router.put("/:pid", updateProduct);

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
router.delete("/:pid", deleteProduct);

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
router.get("/:pid/description", getProductDescription);

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
router.get("/products/pagination", getProductsWithPagination);

export default router;
