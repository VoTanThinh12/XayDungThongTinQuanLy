const { body, validationResult } = require("express-validator");

const validateCreateOrder = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Đơn hàng phải có ít nhất 1 sản phẩm"),

  body("items.*.id_san_pham")
    .isInt({ min: 1 })
    .withMessage("ID sản phẩm không hợp lệ"),

  body("items.*.so_luong")
    .isInt({ min: 1, max: 999 })
    .withMessage("Số lượng phải từ 1-999"),

  body("tien_khach_dua")
    .isFloat({ min: 0 })
    .withMessage("Số tiền khách đưa không hợp lệ"),

  body("phuong_thuc_tt")
    .optional()
    .isIn(["TIEN_MAT", "THE_NGAN_HANG", "CHUYEN_KHOAN"])
    .withMessage("Phương thức thanh toán không hợp lệ"),

  body("ghi_chu")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Ghi chú không được quá 500 ký tự"),
];

// ✅ THÊM FUNCTION NÀY
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Dữ liệu không hợp lệ",
      errors: errors.array(),
    });
  }
  next();
};

module.exports = {
  validateCreateOrder,
  validateOrder: validateCreateOrder,
  handleValidationErrors, // ✅ EXPORT FUNCTION NÀY
};
