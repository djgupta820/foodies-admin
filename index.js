const express = require('express')
const path = require('path')
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const userRoutes = require('./routes/userRoots')
const adminRoutes = require('./routes/adminRoutes')
const app = express()
const port = 3000

mongoose.connect('mongodb://127.0.0.1:27017/foodies')
.then((msg)=>{
    console.log('connected to foodies')
}).catch((err)=>{
    console.log(err)
})

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public/uploads')))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(methodOverride('_method'))

app.use('/user', userRoutes)
app.use('/admin', adminRoutes)

app.get('/', (req, res)=>{
    res.render('index')
})

app.listen(port, () => console.log(`Example app listening at http://localhost:3000`))