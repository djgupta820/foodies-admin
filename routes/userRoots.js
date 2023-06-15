const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const router = express.Router()


router.get('/login', (req, res)=>{
    res.render('users/login')
})

router.post('/login', async (req,res)=>{
    let {email, password} = req.body
    const salt = await bcrypt.genSalt(13)
    const hash = await bcrypt.hash(password, salt)
    password = hash
    const user = await User.find({email})
    if(user){
        res.redirect('/')
    }else{
        res.redirect('/user/login')
    }
})

router.get('/register', (req,res)=>{
    res.render('users/register')
})

router.post('/register', async (req,res)=>{
    let {name, email, phone, address, password} = req.body
    const salt = await bcrypt.genSalt(13)
    const hash = await bcrypt.hash(password, salt)
    password = hash
    await User.create({name, email, phone, address, password})
    res.redirect('/user/login')
})

module.exports = router