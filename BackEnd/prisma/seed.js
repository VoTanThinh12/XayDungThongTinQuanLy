const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Bắt đầu seed database cho POS Cashier System...");

  // 1. Tạo nhân viên thu ngân
  const hashedPassword = await bcrypt.hash("123456", 12);

  const employees = await Promise.all([
    prisma.nhan_vien.upsert({
      where: { tai_khoan: "cashier1" },
      update: {},
      create: {
        ho_ten: "Nguyễn Thu Ngân",
        tai_khoan: "cashier1",
        mat_khau: hashedPassword,
        vai_tro: "thu_ngan",
        ca_lam_viec: "CA_SANG",
        so_dien_thoai: "0901234567",
      },
    }),

    prisma.nhan_vien.upsert({
      where: { tai_khoan: "cashier2" },
      update: {},
      create: {
        ho_ten: "Trần Thu Ngân 2",
        tai_khoan: "cashier2",
        mat_khau: hashedPassword,
        vai_tro: "thu_ngan",
        ca_lam_viec: "CA_CHIEU",
        so_dien_thoai: "0901234568",
      },
    }),

    prisma.nhan_vien.upsert({
      where: { tai_khoan: "cashier3" },
      update: {},
      create: {
        ho_ten: "Lê Thu Ngân 3",
        tai_khoan: "cashier3",
        mat_khau: hashedPassword,
        vai_tro: "thu_ngan",
        ca_lam_viec: "CA_TOI",
        so_dien_thoai: "0901234569",
      },
    }),
  ]);

  console.log("✅ Tạo nhân viên thu ngân thành công");

  // 2. Tạo danh mục sản phẩm
  const categories = await Promise.all([
    prisma.danh_muc.upsert({
      where: { id: 1 },
      update: {},
      create: {
        ten_danh_muc: "Đồ uống",
        mo_ta: "Nước ngọt, nước suối, trà, cà phê",
      },
    }),

    prisma.danh_muc.upsert({
      where: { id: 2 },
      update: {},
      create: {
        ten_danh_muc: "Bánh kẹo",
        mo_ta: "Bánh quy, kẹo, chocolate, snack",
      },
    }),

    prisma.danh_muc.upsert({
      where: { id: 3 },
      update: {},
      create: {
        ten_danh_muc: "Thức ăn nhanh",
        mo_ta: "Bánh mì, mì tôm, cơm hộp",
      },
    }),

    prisma.danh_muc.upsert({
      where: { id: 4 },
      update: {},
      create: {
        ten_danh_muc: "Đồ dùng cá nhân",
        mo_ta: "Dầu gội, xà phòng, giấy vệ sinh",
      },
    }),
  ]);

  console.log("✅ Tạo danh mục sản phẩm thành công");

  // 3. Tạo sản phẩm phong phú
  const products = [
    // DANH MỤC 1: ĐỒ UỐNG
    {
      ma_san_pham: "COCA001",
      ten_san_pham: "Coca Cola 330ml",
      ma_vach: "8935049001001",
      id_danh_muc: 1,
      gia_ban: 12000,
      so_luong: 150,
      don_vi_tinh: "Lon",
      mo_ta: "Nước ngọt có ga Coca Cola 330ml",
      la_san_pham_noi_bat: true,
    },
    {
      ma_san_pham: "PEPSI001",
      ten_san_pham: "Pepsi Cola 330ml",
      ma_vach: "8935049001002",
      id_danh_muc: 1,
      gia_ban: 12000,
      so_luong: 120,
      don_vi_tinh: "Lon",
      mo_ta: "Nước ngọt có ga Pepsi 330ml",
    },
    {
      ma_san_pham: "SPRITE001",
      ten_san_pham: "Sprite 330ml",
      ma_vach: "8935049001003",
      id_danh_muc: 1,
      gia_ban: 12000,
      so_luong: 100,
      don_vi_tinh: "Lon",
      mo_ta: "Nước ngọt có ga vị chanh Sprite 330ml",
    },
    {
      ma_san_pham: "AQUA001",
      ten_san_pham: "Nước suối Aquafina 500ml",
      ma_vach: "8935049001004",
      id_danh_muc: 1,
      gia_ban: 8000,
      so_luong: 200,
      don_vi_tinh: "Chai",
      mo_ta: "Nước suối tinh khiết Aquafina 500ml",
      la_san_pham_noi_bat: true,
    },
    {
      ma_san_pham: "REDBULL001",
      ten_san_pham: "Red Bull 250ml",
      ma_vach: "8935049001005",
      id_danh_muc: 1,
      gia_ban: 35000,
      so_luong: 80,
      don_vi_tinh: "Lon",
      mo_ta: "Nước tăng lực Red Bull 250ml",
    },
    {
      ma_san_pham: "COFFEE001",
      ten_san_pham: "Cà phê Highlands đen đá",
      ma_vach: "8935049001006",
      id_danh_muc: 1,
      gia_ban: 25000,
      so_luong: 50,
      don_vi_tinh: "Ly",
      mo_ta: "Cà phê đen đá Highlands Coffee",
      la_san_pham_noi_bat: true,
    },

    // DANH MỤC 2: BÁNH KẸO
    {
      ma_san_pham: "CHOCO001",
      ten_san_pham: "Chocopie Orion",
      ma_vach: "8935049002001",
      id_danh_muc: 2,
      gia_ban: 15000,
      so_luong: 80,
      don_vi_tinh: "Hộp",
      mo_ta: "Bánh chocopie Orion hộp 6 cái",
    },
    {
      ma_san_pham: "KITKAT001",
      ten_san_pham: "KitKat 4 Fingers",
      ma_vach: "8935049002002",
      id_danh_muc: 2,
      gia_ban: 18000,
      so_luong: 60,
      don_vi_tinh: "Thanh",
      mo_ta: "Chocolate KitKat 4 thanh",
    },
    {
      ma_san_pham: "LAYS001",
      ten_san_pham: "Snack khoai tây Lay's",
      ma_vach: "8935049002003",
      id_danh_muc: 2,
      gia_ban: 22000,
      so_luong: 90,
      don_vi_tinh: "Túi",
      mo_ta: "Snack khoai tây vị tự nhiên 60g",
      la_san_pham_noi_bat: true,
    },
    {
      ma_san_pham: "POCA001",
      ten_san_pham: "Snack Poca vị ngô ngọt",
      ma_vach: "8935049002004",
      id_danh_muc: 2,
      gia_ban: 8000,
      so_luong: 120,
      don_vi_tinh: "Túi",
      mo_ta: "Snack ngô Poca vị ngọt 54g",
    },
    {
      ma_san_pham: "CANDYNO1",
      ten_san_pham: "Kẹo Mentos trái cây",
      ma_vach: "8935049002005",
      id_danh_muc: 2,
      gia_ban: 12000,
      so_luong: 70,
      don_vi_tinh: "Cuộn",
      mo_ta: "Kẹo Mentos vị trái cây 37.5g",
    },

    // DANH MỤC 3: THỨC ĂN NHANH
    {
      ma_san_pham: "BANHMI001",
      ten_san_pham: "Bánh mì thịt nguội",
      ma_vach: "8935049003001",
      id_danh_muc: 3,
      gia_ban: 25000,
      so_luong: 40,
      don_vi_tinh: "Cái",
      mo_ta: "Bánh mì kẹp thịt nguội và rau",
      la_san_pham_noi_bat: true,
    },
    {
      ma_san_pham: "HAOHAO001",
      ten_san_pham: "Mì tôm Hảo Hảo",
      ma_vach: "8935049003002",
      id_danh_muc: 3,
      gia_ban: 4500,
      so_luong: 300,
      don_vi_tinh: "Gói",
      mo_ta: "Mì ăn liền Hảo Hảo tôm chua cay",
    },
    {
      ma_san_pham: "OMACHI001",
      ten_san_pham: "Mì Omachi tôm chua cay",
      ma_vach: "8935049003003",
      id_danh_muc: 3,
      gia_ban: 6000,
      so_luong: 200,
      don_vi_tinh: "Gói",
      mo_ta: "Mì gói Omachi tôm chua cay 80g",
    },
    {
      ma_san_pham: "SANDWICH001",
      ten_san_pham: "Sandwich trứng",
      ma_vach: "8935049003004",
      id_danh_muc: 3,
      gia_ban: 20000,
      so_luong: 30,
      don_vi_tinh: "Cái",
      mo_ta: "Bánh sandwich trứng và rau",
    },

    // DANH MỤC 4: ĐỒ DÙNG CÁ NHÂN
    {
      ma_san_pham: "LIFEBUOY001",
      ten_san_pham: "Xà phòng Lifebuoy",
      ma_vach: "8935049004001",
      id_danh_muc: 4,
      gia_ban: 12000,
      so_luong: 60,
      don_vi_tinh: "Bánh",
      mo_ta: "Xà phòng diệt khuẩn Lifebuoy 90g",
    },
    {
      ma_san_pham: "TISSUE001",
      ten_san_pham: "Giấy vệ sinh Lency",
      ma_vach: "8935049004002",
      id_danh_muc: 4,
      gia_ban: 15000,
      so_luong: 50,
      don_vi_tinh: "Cuộn",
      mo_ta: "Giấy vệ sinh Lency 2 lớp",
    },
    {
      ma_san_pham: "SHAMPOO001",
      ten_san_pham: "Dầu gội Head & Shoulders",
      ma_vach: "8935049004003",
      id_danh_muc: 4,
      gia_ban: 85000,
      so_luong: 25,
      don_vi_tinh: "Chai",
      mo_ta: "Dầu gội Head & Shoulders 400ml",
    },
  ];

  for (const product of products) {
    await prisma.san_pham.upsert({
      where: { ma_vach: product.ma_vach },
      update: {},
      create: product,
    });
  }

  console.log("✅ Tạo sản phẩm phong phú thành công");

  // 4. Tạo đơn hàng mẫu
  const sampleOrder = await prisma.hoa_don_ban.create({
    data: {
      ma_hoa_don: "HD" + Date.now(),
      id_nhan_vien: employees[0].id, // cashier1
      tong_tien: 59000,
      tien_khach_dua: 60000,
      tien_thoi: 1000,
      phuong_thuc_tt: "TIEN_MAT",
      chi_tiet_hoa_don_ban: {
        create: [
          {
            id_san_pham: 1, // Coca Cola
            so_luong: 2,
            gia_ban: 12000,
            thanh_tien: 24000,
          },
          {
            id_san_pham: 4, // Aquafina
            so_luong: 1,
            gia_ban: 8000,
            thanh_tien: 8000,
          },
          {
            id_san_pham: 11, // Bánh mì
            so_luong: 1,
            gia_ban: 25000,
            thanh_tien: 25000,
          },
        ],
      },
    },
  });

  console.log("✅ Tạo đơn hàng mẫu thành công");

  console.log("\n🎉 Seed POS Cashier System hoàn thành!");
  console.log("\n📋 Tài khoản thu ngân:");
  console.log("💰 Ca sáng: cashier1 / 123456");
  console.log("💰 Ca chiều: cashier2 / 123456");
  console.log("💰 Ca tối: cashier3 / 123456");
  console.log("\n📦 Sẵn có " + products.length + " sản phẩm đa dạng");
  console.log(
    "🏪 4 danh mục: Đồ uống, Bánh kẹo, Thức ăn nhanh, Đồ dùng cá nhân"
  );
}

main()
  .catch((e) => {
    console.error("❌ Lỗi seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
