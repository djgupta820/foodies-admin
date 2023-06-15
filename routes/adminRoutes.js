const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Admin = require('../models/Admin')
const router = express.Router()

router.get('/', (req,res)=>{
    res.redirect('/admin/login')
})

router.get('/login', (req,res)=>{
    res.render('admin/login')
})

router.post('/login', async (req,res)=>{
    let {email, password} = req.body
    const salt = await bcrypt.genSalt(13)
    const hash = await bcrypt.hash(password, salt)
    password = hash
    const admin = await Admin.findOne({email})
    if(admin){
        console.log('admin found!')
        res.redirect('/admin')
    }else{
        console.log('admin not found!')
        res.redirect('/admin')
    }
})

router.get('/register', (req,res)=>{
    res.render('admin/register')
})

router.post('/register', async (req,res)=>{
    let {name, email, phone, password} = req.body
    const salt = await bcrypt.genSalt(13)
    const hash = await bcrypt.hash(password, salt)
    password = hash
    await Admin.create({name, email, phone, password})
    res.redirect('/admin/login')
})

module.exports = router