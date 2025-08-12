const express = require("express");
const orderController = require("../controllers/orderController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Tất cả routes cần authentication
router.use(authenticateToken);

// Lấy danh sách đơn hàng của nhân viên
router.get("/my-orders", orderController.getMyOrders);

// Thống kê ca làm việc
router.get("/shift-stats", orderController.getShiftStats);

// Lấy chi tiết đơn hàng
router.get("/:id", orderController.getOrderDetails);

// Hủy đơn hàng
router.put("/:id/cancel", orderController.cancelOrder);

module.exports = router;
