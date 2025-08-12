const { PrismaClient } = require("@prisma/client");

async function testDatabase() {
  const prisma = new PrismaClient();

  try {
    console.log("🔗 Testing database connection...");

    // Test connection
    await prisma.$connect();
    console.log("✅ Database connected");

    // Test query
    const count = await prisma.nhan_vien.count();
    console.log(`✅ Found ${count} employees in database`);

    // Test specific employee
    const employee = await prisma.nhan_vien.findUnique({
      where: { tai_khoan: "cashier1" },
    });

    if (employee) {
      console.log("✅ Test employee found:", employee.ho_ten);
    } else {
      console.log("⚠️ Test employee not found");
    }
  } catch (error) {
    console.error("❌ Database error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
