// const express = require('express');
// const router = express.Router();
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
// const { authenticateToken, checkRole } = require('../middleware/auth');
// const Joi = require('joi');

// const hoaDonBanSchema = Joi.object({
//   id_nhan_vien: Joi.number().integer().required().messages({
//     'number.base': 'ID nhân viên phải là số nguyên',
//     'any.required': 'ID nhân viên là bắt buộc',
//   }),
//   danhSachSanPham: Joi.array()
//     .items(
//       Joi.object({
//         id_san_pham: Joi.number().integer().required().messages({
//           'number.base': 'ID sản phẩm phải là số nguyên',
//           'any.required': 'ID sản phẩm là bắt buộc',
//         }),
//         so_luong: Joi.number().integer().min(1).required().messages({
//           'number.base': 'Số lượng phải là số nguyên',
//           'number.min': 'Số lượng phải lớn hơn 0',
//           'any.required': 'Số lượng là bắt buộc',
//         }),
//         don_gia: Joi.number().positive().required().messages({
//           'number.base': 'Đơn giá phải là số',
//           'number.positive': 'Đơn giá phải lớn hơn 0',
//           'any.required': 'Đơn giá là bắt buộc',
//         }),
//       })
//     )
//     .min(1)
//     .required()
//     .messages({
//       'array.min': 'Danh sách sản phẩm phải có ít nhất 1 sản phẩm',
//       'any.required': 'Danh sách sản phẩm là bắt buộc',
//     }),
// });

// // Tạo hóa đơn bán — cho quản lý hoặc nhân viên
// router.post('/tao', authenticateToken, checkRole(['quan_ly', 'nhan_vien']), async (req, res) => {
//   const { error, value } = hoaDonBanSchema.validate(req.body, { abortEarly: false });
//   if (error) {
//     return res.status(400).json({ errors: error.details.map((e) => e.message) });
//   }
//   try {
//     // Kiểm tra tồn kho
//     for (const sp of value.danhSachSanPham) {
//       const sanPham = await prisma.san_pham.findUnique({ where: { id: sp.id_san_pham } });
//       if (!sanPham || sanPham.so_luong < sp.so_luong) {
//         return res.status(400).json({ error: `Sản phẩm ${sanPham?.ten_san_pham || ''} không đủ tồn kho` });
//       }
//     }

//     const newHoaDon = await prisma.hoa_don_ban.create({
//       data: {
//         id_nhan_vien: value.id_nhan_vien,
//         ngay_ban: new Date(),
//         tong_tien: value.danhSachSanPham.reduce((total, sp) => total + sp.so_luong * sp.don_gia, 0),
//         chi_tiet_hoa_don_ban: {
//           create: value.danhSachSanPham.map((sp) => ({
//             id_san_pham: sp.id_san_pham,
//             so_luong: sp.so_luong,
//             don_gia: parseFloat(sp.don_gia),
//           })),
//         },
//       },
//       include: { chi_tiet_hoa_don_ban: true },
//     });

//     // Cập nhật tồn kho song song
//     await Promise.all(
//       value.danhSachSanPham.map(sp =>
//         prisma.san_pham.update({
//           where: { id: sp.id_san_pham },
//           data: { so_luong: { decrement: sp.so_luong } },
//         })
//       )
//     );

//     res.json(newHoaDon);
//   } catch (error) {
//     console.error("Lỗi khi tạo hóa đơn bán:", error);
//     res.status(500).json({ error: 'Lỗi khi tạo hóa đơn bán: ' + error.message });
//   }
// });

// // Lấy danh sách hóa đơn — chỉ quản lý
// router.get('/', authenticateToken, checkRole('quan_ly'), async (req, res) => {
//   try {
//     const hoaDons = await prisma.hoa_don_ban.findMany({
//       include: { chi_tiet_hoa_don_ban: true, nhan_vien: true },
//     });
//     res.json(hoaDons);
//   } catch (error) {
//     console.error("Lỗi khi lấy danh sách hóa đơn:", error);
//     res.status(500).json({ error: 'Lỗi khi lấy danh sách hóa đơn: ' + error.message });
//   }
// });

// // Xóa hóa đơn — chỉ quản lý
// router.delete('/:id', authenticateToken, checkRole('quan_ly'), async (req, res) => {
//   const { id } = req.params;
//   try {
//     await prisma.chi_tiet_hoa_don_ban.deleteMany({ where: { id_hoa_don: Number(id) } });
//     await prisma.hoa_don_ban.delete({ where: { id: Number(id) } });
//     res.json({ message: 'Đã xóa hóa đơn' });
//   } catch (error) {
//     console.error("Lỗi khi xóa hóa đơn:", error);
//     res.status(500).json({ error: 'Lỗi khi xóa hóa đơn: ' + error.message });
//   }
// });

// module.exports = router;
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
        // don_gia từ client sẽ bị bỏ qua; backend dùng giá DB để đảm bảo an toàn
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
    // Nếu là thu ngân → ép id_nhan_vien từ token
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

      // Tạo hóa đơn + chi tiết
      const newHoaDon = await prisma.hoa_don_ban.create({
        data: {
          id_nhan_vien: value.id_nhan_vien,
          tong_tien,
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
          chi_tiet_hoa_don_ban: { include: { san_pham: true } },
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
      include: { chi_tiet_hoa_don_ban: true, nhan_vien: true },
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
        include: { chi_tiet_hoa_don_ban: { include: { san_pham: true } } },
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

// In lại hóa đơn — HTML (FE mở tab mới & in)
// In lại hóa đơn — HTML rõ ràng + nhận token/cash/change qua query
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
          (ct, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${ct.san_pham?.ten_san_pham || ""}</td>
        <td class="right">${ct.so_luong}</td>
        <td class="right">${Number(ct.don_gia).toLocaleString()}</td>
        <td class="right">${(
          Number(ct.don_gia) * ct.so_luong
        ).toLocaleString()}</td>
      </tr>`
        )
        .join("");

      const cashHtml =
        cash > 0
          ? `<tr><td colspan="4" class="right"><b>Tiền khách đưa</b></td><td class="right">${cash.toLocaleString()} đ</td></tr>
         <tr><td colspan="4" class="right"><b>Tiền thối</b></td><td class="right">${change.toLocaleString()} đ</td></tr>`
          : "";

      const html = `
      <html><head><meta charset="utf-8"><title>Hóa đơn #${hd.id}</title>
      <style>
        *{box-sizing:border-box}
        body{font-family:Arial,Helvetica,sans-serif;padding:20px;color:#111}
        .header{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
        .brand{font-weight:700;font-size:18px}
        .muted{color:#666}
        table{width:100%;border-collapse:collapse;margin-top:10px}
        th,td{border:1px solid #ddd;padding:8px;font-size:14px}
        th{background:#f7f7f7}
        .right{text-align:right}
        .no-print{margin-top:12px}
        @media print {.no-print{display:none}}
      </style></head>
      <body>
        <div class="header">
          <div class="brand">CỬA HÀNG TIỆN LỢI</div>
          <div class="muted">Mã HĐ: #${hd.id}</div>
        </div>
        <div>Thu ngân: <b>${hd.nhan_vien?.ho_ten || ""}</b></div>
        <div class="muted">Ngày: ${new Date(hd.ngay_ban).toLocaleString()}</div>

        <table>
          <thead><tr><th>#</th><th>Sản phẩm</th><th>SL</th><th>Đơn giá</th><th>Thành tiền</th></tr></thead>
          <tbody>${rows}</tbody>
          <tfoot>
            <tr><td colspan="4" class="right"><b>Tổng</b></td><td class="right"><b>${Number(
              hd.tong_tien
            ).toLocaleString()} đ</b></td></tr>
            ${cashHtml}
          </tfoot>
        </table>

        <div class="no-print"><button onclick="window.print()">In hóa đơn</button></div>
        <script>window.onload=()=>{window.print()}</script>
      </body></html>`;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.send(html);
    } catch (error) {
      console.error("Lỗi in hóa đơn:", error);
      res.status(500).send("Lỗi in hóa đơn");
    }
  }
);

// Xóa hóa đơn — chỉ quản lý
router.delete(
  "/:id",
  authenticateToken,
  checkRole("quan_ly"),
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      await prisma.chi_tiet_hoa_don_ban.deleteMany({
        where: { id_hoa_don: id },
      });
      await prisma.hoa_don_ban.delete({ where: { id } });
      res.json({ message: "Đã xóa hóa đơn" });
    } catch (error) {
      console.error("Lỗi khi xóa hóa đơn:", error);
      res.status(500).json({ error: "Lỗi khi xóa hóa đơn: " + error.message });
    }
  }
);

module.exports = router;
