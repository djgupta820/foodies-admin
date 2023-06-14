const express = require('express')
const path = require('path')
const ejsMate = require('ejs-mate')
const app = express()
const port = 3000

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

app.get('/login', (req, res)=>{
    res.render('login')
})

app.get('/register', (req, res)=>{
    res.render('register')
})

app.get('/', (req, res)=>{
    res.render('index')
})

app.listen(port, () => console.log(`Example app listening at http://localhost:3000`))