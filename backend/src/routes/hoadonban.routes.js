const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { authenticateToken, checkRole } = require("../middleware/auth");
const Joi = require("joi");

const hoaDonBanSchema = Joi.object({
  id_nhan_vien: Joi.number().integer().required().messages({
    "number.base": "ID nhân viên phải là số nguyên",
    "any.required": "ID nhân viên là bắt buộc",
  }),
  tien_khach_dua: Joi.number().min(0).optional(),
  danhSachSanPham: Joi.array()
    .items(
      Joi.object({
        id_san_pham: Joi.number().integer().required().messages({
          "number.base": "ID sản phẩm phải là số nguyên",
          "any.required": "ID sản phẩm là bắt buộc",
        }),
        so_luong: Joi.number().integer().positive().required().messages({
          "number.base": "Số lượng phải là số nguyên",
          "number.positive": "Số lượng phải lớn hơn 0",
          "any.required": "Số lượng là bắt buộc",
        }),
        don_gia: Joi.number().positive().required(),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "Danh sách sản phẩm phải có ít nhất 1 sản phẩm",
      "any.required": "Danh sách sản phẩm là bắt buộc",
    }),
});

// Tạo hóa đơn bán — quản lý hoặc thu ngân
router.post(
  "/tao",
  authenticateToken,
  checkRole(["quan_ly", "nhan_vien", "thu_ngan"]),
  async (req, res) => {
    const body = { ...req.body };
    if (req.user?.vai_tro === "thu_ngan") body.id_nhan_vien = req.user.id;

    const { error, value } = hoaDonBanSchema.validate(body, {
      abortEarly: false,
    });

    if (error)
      return res
        .status(400)
        .json({ errors: error.details.map((e) => e.message) });

    try {
      // Kiểm tra tồn kho
      for (const sp of value.danhSachSanPham) {
        const sanPham = await prisma.san_pham.findUnique({
          where: { id: sp.id_san_pham },
        });
        if (!sanPham || sanPham.so_luong < sp.so_luong) {
          return res.status(400).json({
            error: `Sản phẩm ${sanPham?.ten_san_pham || ""} không đủ tồn kho`,
          });
        }
      }

      // Lấy giá bán từ DB để tính tổng tiền (không tin client)
      const ids = value.danhSachSanPham.map((x) => x.id_san_pham);
      const giaMap = Object.fromEntries(
        (
          await prisma.san_pham.findMany({
            where: { id: { in: ids } },
            select: { id: true, gia_ban: true },
          })
        ).map((x) => [x.id, Number(x.gia_ban)])
      );

      const tong_tien = value.danhSachSanPham.reduce(
        (s, x) => s + giaMap[x.id_san_pham] * x.so_luong,
        0
      );

      const tienKhachDua = Number(value.tien_khach_dua || 0);
      const tien_thoi = Math.max(0, tienKhachDua - tong_tien);

      // Tạo hóa đơn + chi tiết (SỬA LỖI Ở ĐÂY)
      const newHoaDon = await prisma.hoa_don_ban.create({
        data: {
          id_nhan_vien: value.id_nhan_vien, // ← SỬA: Dùng id_nhan_vien thay vì nhan_vien: { connect: ... }
          tong_tien,
          tien_khach_dua: tienKhachDua,
          tien_thoi: tien_thoi,
          chi_tiet_hoa_don_ban: {
            create: value.danhSachSanPham.map((sp) => ({
              id_san_pham: sp.id_san_pham,
              so_luong: sp.so_luong,
              don_gia: giaMap[sp.id_san_pham],
            })),
          },
        },
        include: {
          nhan_vien: true,
          chi_tiet_hoa_don_ban: {
            include: { san_pham: true },
          },
        },
      });

      // Cập nhật tồn kho song song
      await Promise.all(
        value.danhSachSanPham.map((sp) =>
          prisma.san_pham.update({
            where: { id: sp.id_san_pham },
            data: { so_luong: { decrement: sp.so_luong } },
          })
        )
      );

      res.json(newHoaDon);
    } catch (error) {
      console.error("Lỗi khi tạo hóa đơn bán:", error);
      res
        .status(500)
        .json({ error: "Lỗi khi tạo hóa đơn bán: " + error.message });
    }
  }
);

// Lấy danh sách hóa đơn — chỉ quản lý
router.get("/", authenticateToken, checkRole("quan_ly"), async (req, res) => {
  try {
    const hoaDons = await prisma.hoa_don_ban.findMany({
      include: {
        chi_tiet_hoa_don_ban: true,
        nhan_vien: true,
      },
      orderBy: { ngay_ban: "desc" },
    });
    res.json(hoaDons);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách hóa đơn:", error);
    res
      .status(500)
      .json({ error: "Lỗi khi lấy danh sách hóa đơn: " + error.message });
  }
});

// Lấy hóa đơn "của tôi" theo ngày — nhân viên / thu ngân
router.get(
  "/cua-toi",
  authenticateToken,
  checkRole(["nhan_vien", "thu_ngan"]),
  async (req, res) => {
    const { date } = req.query; // YYYY-MM-DD
    if (!date)
      return res.status(400).json({ error: "Thiếu tham số date (YYYY-MM-DD)" });

    const start = new Date(date + " 00:00:00");
    const end = new Date(date + " 23:59:59");

    try {
      const list = await prisma.hoa_don_ban.findMany({
        where: {
          id_nhan_vien: req.user.id,
          ngay_ban: { gte: start, lte: end },
        },
        orderBy: { ngay_ban: "desc" },
        include: {
          chi_tiet_hoa_don_ban: { include: { san_pham: true } },
        },
      });
      res.json(list);
    } catch (error) {
      console.error("Lỗi khi lấy hóa đơn của tôi:", error);
      res
        .status(500)
        .json({ error: "Lỗi khi lấy hóa đơn của tôi: " + error.message });
    }
  }
);

// In lại hóa đơn — HTML
router.get(
  "/:id/receipt",
  authenticateToken,
  checkRole(["quan_ly", "nhan_vien", "thu_ngan"]),
  async (req, res) => {
    const id = Number(req.params.id);
    const cash = Number(req.query.cash || 0);
    const change = Number(req.query.change || 0);

    try {
      const hd = await prisma.hoa_don_ban.findUnique({
        where: { id },
        include: {
          chi_tiet_hoa_don_ban: { include: { san_pham: true } },
          nhan_vien: true,
        },
      });

      if (!hd) return res.status(404).send("Không tìm thấy hóa đơn");

      // Thu ngân/nhân viên chỉ xem được hóa đơn của mình
      if (
        ["nhan_vien", "thu_ngan"].includes(
          (req.user?.vai_tro || "").toLowerCase()
        ) &&
        hd.id_nhan_vien !== req.user.id
      ) {
        return res.status(403).send("Không có quyền");
      }

      const rows = hd.chi_tiet_hoa_don_ban
        .map(
          (ct, i) =>
            `<tr>
              <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${
                i + 1
              }</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${
                ct.san_pham.ten_san_pham
              }</td>
              <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${
                ct.so_luong
              }</td>
              <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${Number(
                ct.don_gia
              ).toLocaleString()}đ</td>
              <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${(
                Number(ct.don_gia) * ct.so_luong
              ).toLocaleString()}đ</td>
            </tr>`
        )
        .join("");

      const usedCash = cash || Number(hd.tien_khach_dua) || 0;
      const usedChange = change || Number(hd.tien_thoi) || 0;

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Hóa Đơn Bán Hàng #${hd.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .info { margin: 10px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .total { font-weight: bold; font-size: 16px; }
            .footer { margin-top: 30px; text-align: center; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>HÓA ĐƠN BÁN HÀNG</h2>
            <p>Mã hóa đơn: <strong>#${hd.id}</strong></p>
          </div>
          
          <div class="info">
            <p><strong>Ngày bán:</strong> ${new Date(
              hd.ngay_ban
            ).toLocaleString("vi-VN")}</p>
            <p><strong>Thu ngân:</strong> ${hd.nhan_vien?.ho_ten || "N/A"}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 50px;">#</th>
                <th>Sản phẩm</th>
                <th style="width: 80px;">SL</th>
                <th style="width: 120px;">Đơn giá</th>
                <th style="width: 130px;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
              <tr class="total">
                <td colspan="4" style="text-align: right; padding: 12px; border: 1px solid #ddd;">
                  <strong>Tổng cộng:</strong>
                </td>
                <td style="text-align: right; padding: 12px; border: 1px solid #ddd; font-size: 18px;">
                  <strong>${Number(hd.tong_tien).toLocaleString()}đ</strong>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="info">
            <p><strong>Tiền khách đưa:</strong> ${usedCash.toLocaleString()}đ</p>
            <p><strong>Tiền thối:</strong> ${usedChange.toLocaleString()}đ</p>
          </div>

          <div class="footer">
            <p>Cảm ơn quý khách và hẹn gặp lại!</p>
            <button class="no-print" onclick="window.print()" style="
              background: #1890ff; color: white; border: none; 
              padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 16px;
            ">
              In hóa đơn
            </button>
          </div>

          <script>
            // Auto print when page loads
            window.onload = function() {
              setTimeout(() => window.print(), 500);
            }
          </script>
        </body>
        </html>
      `;

      res.send(html);
    } catch (error) {
      console.error("Lỗi khi lấy hóa đơn:", error);
      res.status(500).send("Lỗi khi lấy hóa đơn: " + error.message);
    }
  }
);

// Lấy chi tiết hóa đơn theo ID
router.get(
  "/:id",
  authenticateToken,
  checkRole(["quan_ly", "nhan_vien", "thu_ngan"]),
  async (req, res) => {
    const id = Number(req.params.id);

    try {
      const hoaDon = await prisma.hoa_don_ban.findUnique({
        where: { id },
        include: {
          chi_tiet_hoa_don_ban: { include: { san_pham: true } },
          nhan_vien: true,
        },
      });

      if (!hoaDon) {
        return res.status(404).json({ error: "Không tìm thấy hóa đơn" });
      }

      // Thu ngân/nhân viên chỉ xem được hóa đơn của mình
      if (
        ["nhan_vien", "thu_ngan"].includes(
          (req.user?.vai_tro || "").toLowerCase()
        ) &&
        hoaDon.id_nhan_vien !== req.user.id
      ) {
        return res.status(403).json({ error: "Không có quyền truy cập" });
      }

      res.json(hoaDon);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết hóa đơn:", error);
      res.status(500).json({
        error: "Lỗi khi lấy chi tiết hóa đơn: " + error.message,
      });
    }
  }
);

module.exports = router;
