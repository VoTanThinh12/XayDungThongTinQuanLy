const { PrismaClient } = require("@prisma/client");

class DatabaseService {
  constructor() {
    this.prisma = null;
  }

  getClient() {
    if (!this.prisma) {
      this.prisma = new PrismaClient({
        log:
          process.env.NODE_ENV === "development"
            ? ["query", "error"]
            : ["error"],
      });

      // Graceful shutdown
      process.on("SIGINT", async () => {
        await this.prisma.$disconnect();
        process.exit(0);
      });

      process.on("SIGTERM", async () => {
        await this.prisma.$disconnect();
        process.exit(0);
      });
    }
    return this.prisma;
  }

  async testConnection() {
    try {
      const client = this.getClient();
      await client.$queryRaw`SELECT 1 as status`;
      console.log("✅ Database connection successful");
      return true;
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      throw error;
    }
  }

  async disconnect() {
    if (this.prisma) {
      await this.prisma.$disconnect();
      this.prisma = null;
    }
  }
}

module.exports = new DatabaseService();
