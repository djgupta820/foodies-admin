const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

router.get('/', (req,res)=>{
    res.redirect('/admin/login')
})

router.get('/login', (req,res)=>{
    res.render('admin/login')
})

router.get('/register', (req,res)=>{
    res.render('admin/register')
})

module.exports = router