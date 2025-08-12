const jwt = require("jsonwebtoken");
const databaseService = require("../services/database");

class AuthMiddleware {
  constructor() {
    this.prisma = databaseService.getClient();
  }

  // Xác thực token
  async authenticateToken(req, res, next) {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Access token không được cung cấp",
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Kiểm tra nhân viên có tồn tại và active không
      const employee = await this.prisma.nhan_vien.findUnique({
        where: {
          id: decoded.id,
          trang_thai: true,
        },
      });

      if (!employee) {
        return res.status(401).json({
          success: false,
          message: "Token không hợp lệ hoặc tài khoản đã bị khóa",
        });
      }

      // Chỉ cho phép nhân viên bán hàng
      if (employee.vai_tro !== "thu_ngan") {
        return res.status(403).json({
          success: false,
          message: "Không có quyền truy cập",
        });
      }

      req.user = {
        id: employee.id,
        tai_khoan: employee.tai_khoan,
        vai_tro: employee.vai_tro,
        ho_ten: employee.ho_ten,
      };

      next();
    } catch (error) {
      console.error("Lỗi xác thực token:", error);

      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Token không hợp lệ",
        });
      }

      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token đã hết hạn",
        });
      }

      res.status(500).json({
        success: false,
        message: "Lỗi server khi xác thực token",
      });
    }
  }
}

const authMiddleware = new AuthMiddleware();

module.exports = {
  authenticateToken: authMiddleware.authenticateToken.bind(authMiddleware),
};
