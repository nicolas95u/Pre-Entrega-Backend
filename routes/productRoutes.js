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

router.get("/", getAllProducts);

router.get("/:pid", getProductById);

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

router.post(
  "/:pid/reviews",
  validateNumberFields(["rating"]),
  validateStringFields(["comment"]),
  addReview
);

router.put("/:pid", updateProduct);

router.delete("/:pid", deleteProduct);

router.get("/:pid/description", getProductDescription);

router.get("/products/pagination", getProductsWithPagination);

export default router;
