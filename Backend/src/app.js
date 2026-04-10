

const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))
app.use(cookieParser())

// CORS Configuration
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://prep-genius-ai-kohl.vercel.app",
    "https://prepgenius-ai-wgok.onrender.com"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Type"],
  optionsSuccessStatus: 200,
  maxAge: 86400
}

app.use(cors(corsOptions))

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