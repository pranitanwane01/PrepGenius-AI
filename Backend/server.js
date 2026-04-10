

require("dotenv").config()

const app = require("./src/app")
const connectToDB = require("./src/config/database")

// Connect to database
connectToDB().catch(err => {
  console.error("❌ Database connection failed:", err.message)
  process.exit(1)
})

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason)
})

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error)
  process.exit(1)
})

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n📴 Server shutting down gracefully...")
  server.close(() => {
    console.log("✅ Server closed")
    process.exit(0)
  })
})