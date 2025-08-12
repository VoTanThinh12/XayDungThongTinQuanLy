const databaseService = require("./database");

class OrderService {
  constructor() {
    this.prisma = databaseService.getClient();
  }

  async getEmployeeOrders(employeeId, filters = {}) {
    try {
      const { page = 1, limit = 20, tu_ngay, den_ngay, trang_thai } = filters;
      const skip = (page - 1) * limit;

      const where = {
        id_nhan_vien: employeeId,
        ...(tu_ngay &&
          den_ngay && {
            ngay_tao: {
              gte: new Date(tu_ngay),
              lte: new Date(den_ngay),
            },
          }),
        ...(trang_thai && { trang_thai }),
      };

      const [orders, total] = await Promise.all([
        this.prisma.hoa_don_ban.findMany({
          where,
          skip,
          take: limit,
          orderBy: { ngay_tao: "desc" },
          include: {
            chi_tiet_hoa_don_ban: {
              include: {
                san_pham: {
                  select: {
                    ten_san_pham: true,
                    don_vi_tinh: true,
                  },
                },
              },
            },
          },
        }),
        this.prisma.hoa_don_ban.count({ where }),
      ]);

      return {
        data: orders,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(`Lỗi lấy danh sách đơn hàng: ${error.message}`);
    }
  }

  async getOrderDetails(orderId, employeeId) {
    try {
      const order = await this.prisma.hoa_don_ban.findFirst({
        where: {
          id: parseInt(orderId),
          id_nhan_vien: employeeId,
        },
        include: {
          chi_tiet_hoa_don_ban: {
            include: {
              san_pham: {
                select: {
                  ten_san_pham: true,
                  ma_san_pham: true,
                  don_vi_tinh: true,
                },
              },
            },
          },
          nhan_vien: {
            select: {
              ho_ten: true,
              ca_lam_viec: true,
            },
          },
        },
      });

      if (!order) {
        throw new Error("Không tìm thấy đơn hàng hoặc không có quyền truy cập");
      }

      return order;
    } catch (error) {
      throw new Error(`Lỗi lấy chi tiết đơn hàng: ${error.message}`);
    }
  }

  async getShiftStats(employeeId, date) {
    try {
      const startDate = new Date(date || new Date());
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);

      const stats = await this.prisma.hoa_don_ban.aggregate({
        where: {
          id_nhan_vien: employeeId,
          ngay_tao: {
            gte: startDate,
            lt: endDate,
          },
          trang_thai: "HOAN_THANH",
        },
        _count: { id: true },
        _sum: { tong_tien: true },
      });

      return {
        so_don_ban: stats._count.id || 0,
        doanh_thu: stats._sum.tong_tien || 0,
        ngay: startDate.toISOString().split("T")[0],
      };
    } catch (error) {
      throw new Error(`Lỗi lấy thống kê ca làm việc: ${error.message}`);
    }
  }
}

module.exports = new OrderService();
