const express = require("express");
const productController = require("../controllers/productController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Tất cả routes cần authentication
router.use(authenticateToken);

// Route tìm kiếm sản phẩm
router.get("/search", productController.searchProducts);

// Route quét mã vạch
router.get("/barcode/:barcode", productController.scanBarcode);

// Route sản phẩm bán chạy
router.get("/popular", productController.getPopularProducts);

// Route lấy tất cả sản phẩm
router.get("/", productController.getAllProducts);

module.exports = router;
