const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const multer = require('multer')
const path = require('path')
const Admin = require('../models/Admin')
const Food = require('../models/Food')
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
        res.redirect('/admin/dashboard')
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

router.get('/dashboard', async (req,res)=>{
    const items = await Food.find({})
    res.render('admin/dashboard', {items})
})

router.get('/new', (req,res)=>{
    res.render('admin/new')
})

const storage = multer.diskStorage({
    destination: function(req, file, callback){
        return callback(null, './public/uploads')
    },
    filename: function(req, file, callback){
        return callback(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({storage})

router.post('/new', upload.single('image'), async (req,res)=>{
    const {name, category, price, description} = req.body
    const image = '/uploads/' + req.file.filename
    await Food.create({name, category, price, image, description})
    res.redirect('/admin/dashboard')
})

router.get('/:itemId/view', async (req,res)=>{
    const {itemId} = req.params
    const item = await Food.findById(itemId)
    res.render('admin/view', {item})
})

router.get('/:itemId/edit', async (req,res)=>{
    const {itemId} = req.params
    const item = await Food.findById(itemId)
    res.render('admin/edit', {item})
})

router.patch('/:itemId/edit', async (req,res)=>{
    const {itemId} = req.params
    let {name, category, price, image, description} = req.body
    await Food.findByIdAndUpdate(itemId, {name, category, price, image, description})
    res.redirect(`/admin/${itemId}/view`)
})

router.delete('/:itemId/delete', async (req, res)=>{
    const {itemId} = req.params
    await Food.findByIdAndDelete(itemId)
    res.redirect('/admin/dashboard')
})

module.exports = router