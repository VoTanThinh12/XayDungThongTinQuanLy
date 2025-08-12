const app = require("./src/app");
const databaseService = require("./src/services/database");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Test database connection trước khi start server
    await databaseService.testConnection();
    console.log("✅ Database connected successfully");

    const server = app.listen(PORT, () => {
      console.log(`🚀 POS Cashier System running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`💰 POS Endpoints: http://localhost:${PORT}/api/pos`);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        await databaseService.getClient().$disconnect();
        console.log("✅ Server closed successfully");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
