const express = require('express')
const path = require('path')
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
// const MongoStore = require('connect-mongo')(session)
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

// Session configuration
const SessionConfig = {
    secret: 'secretcode',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},     // for one month
    // store: new MongoStore({
    //     url: 'mongodb://127.0.0.1:27017/foodies',
    //     ttl: 1000 * 60 * 60 * 24,
    //     autoRemove: 'native'
    // })
}

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public/uploads')))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(session(SessionConfig))
app.use(flash())

// middleware for flashing messages
app.use((req,res,next)=>{
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/user', userRoutes)
app.use('/admin', adminRoutes)

app.get('/', (req, res)=>{
    res.render('index')
})

app.listen(port, () => console.log(`Example app listening at http://localhost:3000`))