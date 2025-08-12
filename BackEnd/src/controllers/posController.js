const posService = require("../services/posService");
const { validationResult } = require("express-validator");

class POSController {
  // Tìm kiếm sản phẩm
  async searchProducts(req, res) {
    try {
      const { q: query } = req.query;

      if (!query || query.trim().length < 1) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập từ khóa tìm kiếm",
        });
      }

      const products = await posService.searchProducts(query.trim());

      res.status(200).json({
        success: true,
        message: "Tìm kiếm sản phẩm thành công",
        data: products,
        total: products.length,
      });
    } catch (error) {
      console.error("Lỗi tìm kiếm sản phẩm:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi server khi tìm kiếm sản phẩm",
        error: error.message,
      });
    }
  }

  // Quét mã vạch
  async scanBarcode(req, res) {
    try {
      const { barcode } = req.params;

      if (!barcode) {
        return res.status(400).json({
          success: false,
          message: "Mã vạch không hợp lệ",
        });
      }

      const product = await posService.getProductByBarcode(barcode);

      res.status(200).json({
        success: true,
        message: "Quét mã vạch thành công",
        data: product,
      });
    } catch (error) {
      console.error("Lỗi quét mã vạch:", error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Tạo đơn hàng
  async createOrder(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Dữ liệu không hợp lệ",
          errors: errors.array(),
        });
      }

      const order = await posService.createOrder(req.body, req.user.id);

      res.status(201).json({
        success: true,
        message: "Tạo đơn hàng thành công",
        data: order,
      });
    } catch (error) {
      console.error("Lỗi tạo đơn hàng:", error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Lấy sản phẩm bán chạy
  async getPopularProducts(req, res) {
    try {
      const { limit = 10 } = req.query;
      const products = await posService.getPopularProducts(parseInt(limit));

      res.status(200).json({
        success: true,
        message: "Lấy sản phẩm bán chạy thành công",
        data: products,
      });
    } catch (error) {
      console.error("Lỗi lấy sản phẩm bán chạy:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy sản phẩm bán chạy",
        error: error.message,
      });
    }
  }
}

module.exports = new POSController();
