const databaseService = require("./database");

class ProductService {
  constructor() {
    this.prisma = databaseService.getClient();
  }

  // Tìm kiếm sản phẩm
  async searchProducts(query) {
    try {
      const products = await this.prisma.san_pham.findMany({
        where: {
          AND: [
            { trang_thai: true },
            { so_luong: { gt: 0 } },
            {
              OR: [
                { ten_san_pham: { contains: query, mode: "insensitive" } },
                { ma_san_pham: { contains: query, mode: "insensitive" } },
                { ma_vach: { contains: query } },
              ],
            },
          ],
        },
        select: {
          id: true,
          ten_san_pham: true,
          ma_san_pham: true,
          ma_vach: true,
          gia_ban: true,
          so_luong: true,
          don_vi_tinh: true,
          danh_muc: true,
        },
        take: 20,
      });

      return products;
    } catch (error) {
      throw new Error(`Lỗi tìm kiếm sản phẩm: ${error.message}`);
    }
  }

  // Quét mã vạch
  async getProductByBarcode(barcode) {
    try {
      const product = await this.prisma.san_pham.findUnique({
        where: {
          ma_vach: barcode,
          trang_thai: true,
        },
        select: {
          id: true,
          ten_san_pham: true,
          ma_san_pham: true,
          ma_vach: true,
          gia_ban: true,
          so_luong: true,
          don_vi_tinh: true,
          danh_muc: true,
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

  // Lấy sản phẩm bán chạy
  async getPopularProducts(limit = 10) {
    try {
      const popularProducts = await this.prisma.chi_tiet_hoa_don_ban.groupBy({
        by: ["id_san_pham"],
        _sum: {
          so_luong: true,
        },
        _count: {
          id: true,
        },
        orderBy: {
          _sum: {
            so_luong: "desc",
          },
        },
        take: parseInt(limit),
      });

      // Lấy thông tin chi tiết sản phẩm
      const productDetails = await Promise.all(
        popularProducts.map(async (item) => {
          const product = await this.prisma.san_pham.findUnique({
            where: { id: item.id_san_pham },
            select: {
              id: true,
              ten_san_pham: true,
              ma_san_pham: true,
              gia_ban: true,
              so_luong: true,
              don_vi_tinh: true,
              danh_muc: true,
            },
          });

          return {
            ...product,
            so_luong_ban: item._sum.so_luong,
            so_don_hang: item._count.id,
          };
        })
      );

      return productDetails.filter((p) => p.id !== null);
    } catch (error) {
      throw new Error(`Lỗi lấy sản phẩm bán chạy: ${error.message}`);
    }
  }

  // Lấy tất cả sản phẩm (có phân trang)
  async getAllProducts(filters = {}) {
    try {
      const { page = 1, limit = 20, danh_muc, trang_thai } = filters;
      const skip = (page - 1) * limit;

      const whereClause = {};
      if (danh_muc) whereClause.danh_muc = danh_muc;
      if (trang_thai !== undefined)
        whereClause.trang_thai = trang_thai === "true";

      const [products, total] = await Promise.all([
        this.prisma.san_pham.findMany({
          where: whereClause,
          select: {
            id: true,
            ten_san_pham: true,
            ma_san_pham: true,
            ma_vach: true,
            gia_ban: true,
            so_luong: true,
            don_vi_tinh: true,
            danh_muc: true,
            trang_thai: true,
          },
          orderBy: { ngay_tao: "desc" },
          skip,
          take: parseInt(limit),
        }),
        this.prisma.san_pham.count({ where: whereClause }),
      ]);

      return {
        products,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(`Lỗi lấy danh sách sản phẩm: ${error.message}`);
    }
  }
}

module.exports = new ProductService();
