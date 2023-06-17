const express = require('express')
const bcrypt = require('bcrypt')
const multer = require('multer')
const Admin = require('../models/Admin')
const Food = require('../models/Food')
const router = express.Router()

// middleware for authenticating admin
const adminCheck = (req,res,next)=>{
    if(req.session.admin){
        next()
    }else{
        res.redirect('/admin/login-error')
    }
}

// Home route
router.get('/', (req,res)=>{
    res.redirect('/admin/login')
})

// Login route
router.get('/login', (req,res)=>{
    res.render('admin/login')
})

// Login logic
router.post('/login', async (req,res)=>{
    let {email, password} = req.body
    
    // validating user
    const admin = await Admin.findOne({email})
    if(!admin){
        req.flash('error', 'user does not exist!')
        res.redirect('/admin/login')
    }else{
        // valildation user password
        const validUser = bcrypt.compare(password, admin.password)
        if(!validUser){
            req.flash('error', 'password did not match')
            res.redirect('/admin/login')
        }
        else{
            req.session.admin = admin.id
            res.redirect('/admin/dashboard')
        }
    }
})

// rendering admin registration page
// **extra for dev. only
router.get('/register', (req,res)=>{
    res.render('admin/register')
})

// admin register logic 
// **extra for dev. only
router.post('/register', async (req,res)=>{
    let {name, email, phone, password} = req.body
    const salt = await bcrypt.genSalt(13)
    const hash = await bcrypt.hash(password, salt)
    password = hash
    await Admin.create({name, email, phone, password})
    res.redirect('/admin/login')
})

// Rendering admin to dashboard
router.get('/dashboard', adminCheck, async (req,res)=>{
    const items = await Food.find({})
    res.render('admin/dashboard', {items})
})

// rendering Add new item (food)
router.get('/new', adminCheck, (req,res)=>{
    res.render('admin/new')
})

// Object for info. of file on server
const storage = multer.diskStorage({
    destination: function(req, file, callback){
        return callback(null, './public/uploads')
    },
    filename: function(req, file, callback){
        return callback(null, `${Date.now()}-${file.originalname}`)
    }
})
// function for uploading file on server (used as middleware)
const upload = multer({storage})

// add new product logic
router.post('/new', [adminCheck, upload.single('image')], async (req,res)=>{
    const {name, category, price, description} = req.body
    const image = '/uploads/' + req.file.filename
    await Food.create({name, category, price, image, description})
    req.flash('success', 'Item added Successfully')
    res.redirect('/admin/dashboard')
})

// rendering view item
router.get('/:itemId/view', adminCheck, async (req,res)=>{
    const {itemId} = req.params
    const item = await Food.findById(itemId)
    res.render('admin/view', {item})
})

// rendering update item
router.get('/:itemId/edit', adminCheck, async (req,res)=>{
    const {itemId} = req.params
    const item = await Food.findById(itemId)
    res.render('admin/edit', {item})
})

// logic for updating item
router.patch('/:itemId/edit', adminCheck, async (req,res)=>{
    const {itemId} = req.params
    let {name, category, price, image, description} = req.body
    await Food.findByIdAndUpdate(itemId, {name, category, price, image, description})
    req.flash('success', `${name} updated successfully`)
    res.redirect(`/admin/${itemId}/view`)
})

// deleting product from db
router.delete('/:itemId/delete', adminCheck, async (req, res)=>{
    const {itemId} = req.params
    await Food.findByIdAndDelete(itemId)
    req.flash('success', 'item deleted successdully')
    res.redirect('/admin/dashboard')
})

// rendering login error for unauthenticated
router.get('/login-error', (req,res)=>{
    res.render('admin/loginError')
})

// rendering logout and destroying session
router.get('/logout', (req,res)=>{
    req.session.destroy(()=>{
        res.render('admin/logout')
    })
})

// rendering error for unwanted routes
router.get('*', (req,res)=>{
    res.status(404).render('admin/notFound')
})

module.exports = router
