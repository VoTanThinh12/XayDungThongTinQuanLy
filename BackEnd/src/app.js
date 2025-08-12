const express = require("express");
const cors = require("cors");
const databaseService = require("./services/database");

// Routes imports
const authRoutes = require("./routes/auth");
const posRoutes = require("./routes/pos");
const orderRoutes = require("./routes/orders");

// Middleware imports
const { handleValidationErrors } = require("./middleware/validation");

const app = express();

// ============ MIDDLEWARE CONFIGURATION ============
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} ${req.path} - ${req.ip}`
  );
  next();
});

// ============ HEALTH CHECK ============
app.get("/health", async (req, res) => {
  try {
    const health = await databaseService.getClient()
      .$queryRaw`SELECT 1 as status`;

    res.status(200).json({
      success: true,
      message: "POS Cashier System đang hoạt động bình thường",
      timestamp: new Date(),
      database: "connected",
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: "Hệ thống gặp sự cố",
      error: error.message,
    });
  }
});

// ============ API ROUTES - CHỈ CHO THU NGÂN ============
app.use("/api/auth", authRoutes); // Đăng nhập/xuất
app.use("/api/pos", posRoutes); // Point of Sale
app.use("/api/orders", orderRoutes); // Quản lý đơn hàng

// ============ 404 HANDLER ============
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} không tồn tại`,
    availableEndpoints: [
      "POST /api/auth/login - Đăng nhập thu ngân",
      "POST /api/auth/logout - Đăng xuất và kết thúc ca",
      "GET /api/pos/products/search - Tìm kiếm sản phẩm",
      "GET /api/pos/products/barcode/:barcode - Quét mã vạch",
      "POST /api/pos/orders - Tạo đơn hàng",
      "GET /api/orders/my-orders - Xem đơn hàng đã bán",
      "GET /api/orders/shift-stats - Thống kê ca làm việc",
    ],
  });
});

// ============ ERROR HANDLING ============
app.use(handleValidationErrors);

app.use((error, req, res, next) => {
  console.error("Global Error:", error);

  // Prisma errors
  if (error.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: "Dữ liệu bị trùng lặp",
    });
  }

  if (error.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "Dữ liệu không tồn tại",
    });
  }

  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Lỗi server không xác định",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});

// ============ APP INITIALIZATION ============
const initializeApp = async () => {
  try {
    await databaseService.testConnection();
    console.log("✅ POS Cashier System sẵn sàng phục vụ");
    console.log("💰 Chức năng: Tạo đơn hàng, Tìm đơn hàng, Quản lý ca");
    console.log(
      "🏪 Sản phẩm: Đồ uống, Bánh kẹo, Thức ăn nhanh, Đồ dùng cá nhân"
    );
  } catch (error) {
    console.error("❌ Lỗi khởi tạo hệ thống:", error);
    process.exit(1);
  }
};

initializeApp();

module.exports = app;
