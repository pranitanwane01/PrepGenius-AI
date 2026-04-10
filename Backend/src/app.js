

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
    "https://prepgenius-ai-xogk.onrender.com"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))

const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err.message)
  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "production" ? "Error" : err.message
  })
})

module.exports = app