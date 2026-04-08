// require("dotenv").config()
// const app = require("./src/app")
// const connectToDB = require("./src/config/database")

// connectToDB()


// app.listen(3000, () => {
//     console.log("Server is running on port 3000")
// })

require("dotenv").config()

const app = require("./src/app")
const connectToDB = require("./src/config/database")

connectToDB()

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})