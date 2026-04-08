const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())
// app.use(cors({
//     origin: "http://localhost:5173",
//     credentials: true
// }))
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://prep-genius-ai.vercel.app" // later update
  ],
  credentials: true
}))

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true")
  next()
})

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)



module.exports = app