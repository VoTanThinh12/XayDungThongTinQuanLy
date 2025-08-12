const databaseService = require("./database");

class POSService {
  constructor() {
    this.prisma = databaseService.getClient();
  }

  async getProductByBarcode(barcode) {
    try {
      const product = await this.prisma.san_pham.findUnique({
        where: {
          ma_vach: barcode,
          trang_thai: true,
        },
        include: {
          danh_muc: {
            select: {
              ten_danh_muc: true,
            },
          },
        },
      });

      if (!product) {
        throw new Error("Không tìm thấy sản phẩm với mã vạch này");
      }

      if (product.so_luong <= 0) {
        throw new Error("Sản phẩm đã hết hàng");
      }

      return product;
    } catch (error) {
      throw new Error(`Lỗi quét mã vạch: ${error.message}`);
    }
  }

  async searchProducts(query, limit = 20) {
    try {
      if (!query || query.trim().length < 1) {
        return [];
      }

      const products = await this.prisma.san_pham.findMany({
        where: {
          AND: [
            { trang_thai: true },
            { so_luong: { gt: 0 } },
            {
              OR: [
                { ten_san_pham: { contains: query } }, // ✅ Bỏ mode
                { ma_san_pham: { contains: query } }, // ✅ Bỏ mode
                { ma_vach: { contains: query } },
              ],
            },
          ],
        },
        include: {
          danh_muc: {
            select: {
              ten_danh_muc: true,
            },
          },
        },
        take: limit,
        orderBy: [{ la_san_pham_noi_bat: "desc" }, { ten_san_pham: "asc" }],
      });

      return products;
    } catch (error) {
      throw new Error(`Lỗi tìm kiếm sản phẩm: ${error.message}`);
    }
  }

  async getPopularProducts(limit = 10) {
    try {
      const products = await this.prisma.san_pham.findMany({
        where: {
          trang_thai: true,
          so_luong: { gt: 0 },
        },
        include: {
          danh_muc: {
            select: {
              ten_danh_muc: true,
            },
          },
        },
        orderBy: [{ la_san_pham_noi_bat: "desc" }, { ten_san_pham: "asc" }],
        take: limit,
      });

      return products;
    } catch (error) {
      throw new Error(`Lỗi lấy sản phẩm nổi bật: ${error.message}`);
    }
  }

  async createOrder(orderData, cashierId) {
    try {
      const {
        items,
        tien_khach_dua,
        phuong_thuc_tt = "TIEN_MAT",
        ghi_chu,
      } = orderData;

      if (!items || !Array.isArray(items) || items.length === 0) {
        throw new Error("Đơn hàng phải có ít nhất 1 sản phẩm");
      }

      const result = await this.prisma.$transaction(async (prisma) => {
        let tong_tien = 0;
        const orderItems = [];

        for (const item of items) {
          const product = await prisma.san_pham.findUnique({
            where: {
              id: item.id_san_pham,
              trang_thai: true,
            },
          });

          if (!product) {
            throw new Error(`Sản phẩm ID ${item.id_san_pham} không tồn tại`);
          }

          if (product.so_luong < item.so_luong) {
            throw new Error(
              `Sản phẩm "${product.ten_san_pham}" không đủ số lượng. Còn lại: ${product.so_luong}`
            );
          }

          const thanh_tien = product.gia_ban * item.so_luong;
          tong_tien += thanh_tien;

          orderItems.push({
            id_san_pham: product.id,
            so_luong: item.so_luong,
            gia_ban: product.gia_ban,
            thanh_tien,
          });
        }

        if (tien_khach_dua < tong_tien) {
          throw new Error(`Tiền khách đưa không đủ thanh toán`);
        }

        const tien_thoi = tien_khach_dua - tong_tien;

        const order = await prisma.hoa_don_ban.create({
          data: {
            ma_hoa_don: `HD${Date.now()}`,
            id_nhan_vien: cashierId,
            tong_tien,
            tien_khach_dua,
            tien_thoi,
            phuong_thuc_tt,
            ghi_chu,
            chi_tiet_hoa_don_ban: {
              create: orderItems,
            },
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

        for (const item of items) {
          await prisma.san_pham.update({
            where: { id: item.id_san_pham },
            data: {
              so_luong: {
                decrement: item.so_luong,
              },
            },
          });
        }

        return order;
      });

      return result;
    } catch (error) {
      throw new Error(`Lỗi tạo đơn hàng: ${error.message}`);
    }
  }
}

module.exports = new POSService();
