const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const databaseService = require("../services/database");

class AuthController {
  constructor() {
    // ✅ Khởi tạo prisma trong constructor
    this.prisma = databaseService.getClient();

    // ✅ Bind methods để không mất context
    this.login = this.login.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.logout = this.logout.bind(this);
  }

  async login(req, res) {
    try {
      console.log("🔍 DEBUG: this.prisma =", !!this.prisma); // Debug log

      const { tai_khoan, mat_khau } = req.body;

      // Validate input
      if (!tai_khoan || !mat_khau) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập đầy đủ tài khoản và mật khẩu",
        });
      }

      // ✅ Kiểm tra prisma trước khi sử dụng
      if (!this.prisma) {
        console.error("❌ Prisma client is undefined");
        return res.status(500).json({
          success: false,
          message: "Lỗi kết nối database",
        });
      }

      // Tìm nhân viên
      const employee = await this.prisma.nhan_vien.findUnique({
        where: { tai_khoan },
      });

      if (!employee) {
        return res.status(401).json({
          success: false,
          message: "Tài khoản không tồn tại",
        });
      }

      // Kiểm tra trạng thái active
      if (!employee.trang_thai) {
        return res.status(401).json({
          success: false,
          message: "Tài khoản đã bị khóa",
        });
      }

      // Chỉ cho phép thu ngân đăng nhập
      if (employee.vai_tro !== "thu_ngan") {
        return res.status(403).json({
          success: false,
          message: "Chỉ thu ngân mới được truy cập hệ thống POS",
        });
      }

      // Kiểm tra mật khẩu
      const isValidPassword = await bcrypt.compare(mat_khau, employee.mat_khau);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Mật khẩu không đúng",
        });
      }

      // Tạo JWT token
      const token = jwt.sign(
        {
          id: employee.id,
          tai_khoan: employee.tai_khoan,
          vai_tro: employee.vai_tro,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || "8h" }
      );

      // Response thành công
      res.status(200).json({
        success: true,
        message: "Đăng nhập thành công",
        data: {
          token,
          employee: {
            id: employee.id,
            ho_ten: employee.ho_ten,
            tai_khoan: employee.tai_khoan,
            vai_tro: employee.vai_tro,
            ca_lam_viec: employee.ca_lam_viec,
          },
        },
      });
    } catch (error) {
      console.error("❌ Login error:", error);
      res.status(500).json({
        success: false,
        message: `Lỗi đăng nhập: ${error.message}`,
      });
    }
  }

  async getProfile(req, res) {
    try {
      if (!this.prisma) {
        return res.status(500).json({
          success: false,
          message: "Lỗi kết nối database",
        });
      }

      const employee = await this.prisma.nhan_vien.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          ho_ten: true,
          tai_khoan: true,
          vai_tro: true,
          ca_lam_viec: true,
          so_dien_thoai: true,
          created_at: true,
        },
      });

      res.status(200).json({
        success: true,
        data: employee,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Lỗi lấy thông tin: ${error.message}`,
      });
    }
  }

  async logout(req, res) {
    try {
      res.status(200).json({
        success: true,
        message: "Đăng xuất thành công",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Lỗi đăng xuất: ${error.message}`,
      });
    }
  }
}

module.exports = new AuthController();
