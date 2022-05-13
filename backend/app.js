const ErrrorMiddleWare = require('./middleWare/error')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cookieParser = require('cookie-parser')
app.use(express.json())


app.use(cookieParser())
//routes
const product = require('./routes/productRoutes')
app.use('/api/v1',product)

const user = require('./routes/userRoutes')
app.use('/api/v1',user)

const order = require('./routes/orderRoutes')
app.use('/api/v1',order)

//middleWare 

app.use(ErrrorMiddleWare)

module.exports = app