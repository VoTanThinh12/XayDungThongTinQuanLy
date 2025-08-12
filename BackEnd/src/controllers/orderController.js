const orderService = require("../services/orderService");

class OrderController {
  // Lấy danh sách đơn hàng của nhân viên
  async getMyOrders(req, res) {
    try {
      const filters = {
        page: req.query.page,
        limit: req.query.limit,
        tu_ngay: req.query.tu_ngay,
        den_ngay: req.query.den_ngay,
        trang_thai: req.query.trang_thai,
      };

      const result = await orderService.getEmployeeOrders(req.user.id, filters);

      res.status(200).json({
        success: true,
        message: "Lấy danh sách đơn hàng thành công",
        data: result.orders,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error("Lỗi lấy danh sách đơn hàng:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy danh sách đơn hàng",
        error: error.message,
      });
    }
  }

  // Lấy chi tiết đơn hàng
  async getOrderDetails(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "ID đơn hàng không hợp lệ",
        });
      }

      const order = await orderService.getOrderDetails(id, req.user.id);

      res.status(200).json({
        success: true,
        message: "Lấy chi tiết đơn hàng thành công",
        data: order,
      });
    } catch (error) {
      console.error("Lỗi lấy chi tiết đơn hàng:", error);

      if (error.message.includes("Không tìm thấy")) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy chi tiết đơn hàng",
        error: error.message,
      });
    }
  }

  // Thống kê ca làm việc
  async getShiftStats(req, res) {
    try {
      const { date } = req.query;

      const stats = await orderService.getShiftStats(req.user.id, date);

      res.status(200).json({
        success: true,
        message: "Lấy thống kê ca làm việc thành công",
        data: stats,
      });
    } catch (error) {
      console.error("Lỗi thống kê ca làm việc:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy thống kê",
        error: error.message,
      });
    }
  }

  // Hủy đơn hàng
  async cancelOrder(req, res) {
    try {
      const { id } = req.params;
      const { ly_do } = req.body;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "ID đơn hàng không hợp lệ",
        });
      }

      if (!ly_do || ly_do.trim().length < 5) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập lý do hủy đơn (ít nhất 5 ký tự)",
        });
      }

      const result = await orderService.cancelOrder(
        id,
        req.user.id,
        ly_do.trim()
      );

      res.status(200).json({
        success: true,
        message: "Hủy đơn hàng thành công",
        data: result,
      });
    } catch (error) {
      console.error("Lỗi hủy đơn hàng:", error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new OrderController();
