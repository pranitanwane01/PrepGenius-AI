const mongoose = require("mongoose")

async function connectToDB() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI environment variable is not set")
        }

        await mongoose.connect(process.env.MONGO_URI)
        console.log("✅ Connected to Database successfully")
        return true
    }
    catch (err) {
        console.error("❌ Database connection error:", err.message)
        throw err
    }
}

module.exports = connectToDB