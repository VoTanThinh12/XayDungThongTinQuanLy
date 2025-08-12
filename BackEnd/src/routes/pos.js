const express = require("express");
const posController = require("../controllers/posController");
const { authenticateToken } = require("../middleware/auth");
const { validateOrder } = require("../middleware/validation");

const router = express.Router();

// Tất cả routes cần authentication
router.use(authenticateToken);

// ============ SẢN PHẨM ============
router.get("/products/search", posController.searchProducts);
router.get("/products/barcode/:barcode", posController.scanBarcode);
router.get("/products/popular", posController.getPopularProducts);
// router.get("/categories", posController.getCategories);

// ============ ĐỚN HÀNG ============
router.post("/orders", validateOrder, posController.createOrder);
// router.post("/orders/:orderId/print", posController.printInvoice);

module.exports = router;
