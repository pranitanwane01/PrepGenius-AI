

require("dotenv").config()

const app = require("./src/app")
const connectToDB = require("./src/config/database")

connectToDB().catch(err => {
  console.error("❌ Database connection failed:", err.message)
  process.exit(1)
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`)
})

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n📴 Server shutting down...")
  process.exit(0)
})