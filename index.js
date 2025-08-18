require('dotenv').config()
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const path = require('path')
const cors = require('cors')
const connectDB = require("./config/connectDB")
const authRoutes = require('./routes/auth-routes')
const userRoutes = require('./routes/user-routes')
const productRoutes = require('./routes/product-routes')
const orderRoutes = require('./routes/order-routes')
const postRoutes = require('./routes/post-routes')

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))
app.use(express.static(path.join(__dirname, "public")))
connectDB()

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/posts', postRoutes)

app.listen(process.env.PORT, () => {
    console.log(`App is Listening to PORT ${process.env.PORT}`)
})


