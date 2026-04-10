

const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://prep-genius-ai-kohl.vercel.app",
    "https://prepgenius-ai-wgok.onrender.com"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))

const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Endpoint not found"
  })
})

// Global error handler (must be last)
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err.message)
  console.error("Stack:", err.stack)
  res.status(err.status || 500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "production" ? "Error" : err.message
  })
})

module.exports = app