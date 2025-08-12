const productService = require("../services/productService");

class ProductController {
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

      const products = await productService.searchProducts(query.trim());

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

      const product = await productService.getProductByBarcode(barcode);

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

  // Lấy sản phẩm bán chạy
  async getPopularProducts(req, res) {
    try {
      const { limit = 10 } = req.query;

      const products = await productService.getPopularProducts(parseInt(limit));

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

  // Lấy tất cả sản phẩm
  async getAllProducts(req, res) {
    try {
      const filters = {
        page: req.query.page,
        limit: req.query.limit,
        danh_muc: req.query.danh_muc,
        trang_thai: req.query.trang_thai,
      };

      const result = await productService.getAllProducts(filters);

      res.status(200).json({
        success: true,
        message: "Lấy danh sách sản phẩm thành công",
        data: result.products,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error("Lỗi lấy danh sách sản phẩm:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy danh sách sản phẩm",
        error: error.message,
      });
    }
  }
}

module.exports = new ProductController();
