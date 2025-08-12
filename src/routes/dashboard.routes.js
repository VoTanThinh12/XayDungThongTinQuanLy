// routes/dashboard.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateToken } = require('../middleware/auth'); // middleware JWT

router.get('/summary', authenticateToken, async (req, res) => {
  try {
    // Tổng số sản phẩm
    const totalProducts = await prisma.san_pham.count();

    // Tổng số nhân viên
    const totalEmployees = await prisma.nhan_vien.count();

    // Tổng số hóa đơn bán
    const totalInvoices = await prisma.hoa_don_ban.count();

    // Tổng doanh thu
    const revenueResult = await prisma.hoa_don_ban.aggregate({
      _sum: { tong_tien: true }
    });
    const totalRevenue = revenueResult._sum.tong_tien || 0;

    // Doanh thu 7 ngày gần nhất
    const dailyRevenueRaw = await prisma.$queryRaw`
      SELECT DATE(ngay_ban) AS date, SUM(tong_tien) AS revenue
      FROM hoa_don_ban
      WHERE ngay_ban >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(ngay_ban)
      ORDER BY date ASC
    `;

    // Tồn kho theo đơn vị tính (don_vi_tinh trong schema)
    const stockByTypeRaw = await prisma.san_pham.groupBy({
      by: ['don_vi_tinh'],
      _sum: { so_luong: true }
    });

    const stockByType = stockByTypeRaw.map(item => ({
      type: item.don_vi_tinh || 'Không xác định',
      value: item._sum.so_luong || 0
    }));

    res.json({
      stats: {
        totalProducts,
        totalEmployees,
        totalInvoices,
        totalRevenue
      },
      charts: {
        dailyRevenue: dailyRevenueRaw,
        stockByType
      }
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    res.status(500).json({ error: 'Lỗi khi lấy dữ liệu dashboard' });
  }
});

module.exports = router;
