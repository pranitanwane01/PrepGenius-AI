// const express = require("express")
// const cookieParser = require("cookie-parser")
// const cors = require("cors")

// const app = express()

// app.use(express.json())
// app.use(cookieParser())
// app.use(cors({
//     origin: "http://localhost:5173",
//     credentials: true
// }))

// /* require all the routes here */
// const authRouter = require("./routes/auth.routes")
// const interviewRouter = require("./routes/interview.routes")


// /* using all the routes here */
// app.use("/api/auth", authRouter)
// app.use("/api/interview", interviewRouter)



// module.exports = app


const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();


// ─────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────

app.use(express.json());
app.use(cookieParser());


// ─────────────────────────────────────────────
// CORS
// ─────────────────────────────────────────────

const allowedOrigins = [
    "http://localhost:5173",

    // Production frontend
    process.env.FRONTEND_URL,
];

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests without an Origin header
            // (Postman, server-to-server requests, etc.)
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(
                new Error("Not allowed by CORS")
            );
        },

        credentials: true,
    })
);


// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────

const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);


module.exports = app;