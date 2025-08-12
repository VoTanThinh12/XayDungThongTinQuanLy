const jwt = require('jsonwebtoken');

/**
 * Middleware xác thực JWT
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Không có token, vui lòng đăng nhập lại' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Chuẩn hóa vai_tro về chữ thường
    if (decoded.vai_tro) {
      decoded.vai_tro = decoded.vai_tro.toLowerCase();
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT Verify Error:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token đã hết hạn, vui lòng đăng nhập lại' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token không hợp lệ' });
    }

    return res.status(401).json({ error: 'Lỗi xác thực token' });
  }
}

/**
 * Middleware kiểm tra quyền
 * @param {string|string[]} roles - Vai trò hoặc mảng vai trò được phép
 */
function checkRole(roles) {
  const allowedRoles = Array.isArray(roles)
    ? roles.map(r => r.toLowerCase())
    : [roles.toLowerCase()];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Chưa xác thực' });
    }
    if (!req.user.vai_tro) {
      return res.status(403).json({ error: 'Tài khoản không có thông tin vai trò' });
    }
    if (!allowedRoles.includes(req.user.vai_tro)) {
      console.warn(`Quyền bị từ chối: yêu cầu [${allowedRoles.join(', ')}], nhưng user có '${req.user.vai_tro}'`);
      return res.status(403).json({ error: 'Không có quyền truy cập' });
    }
    next();
  };
}

module.exports = { authenticateToken, checkRole };
