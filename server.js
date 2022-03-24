const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors")
const cookieParser = require('cookie-parser')

const userRoutes = require('./routes/userRoutes')
const authRoutes = require('./routes/authRoutes')

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true
}
// res.setHeader("Access-Control-Allow-Credentials", "true")

const app = express()
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())


mongoose.connect("mongodb+srv://ashish757:<pass>@cluster0.sx5d0.mongodb.net/UserProfilesMERN?retryWrites=true&w=majority")
    .then(() => app.listen(5000))
    .catch((err) => console.log(err))


app.use("/api", userRoutes)
app.use('/api/auth', authRoutes)

app.get("/secret", (req, _res) => {
    console.log(req)
})
