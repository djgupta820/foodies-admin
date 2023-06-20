const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const Food = require('../models/Food')
const Review = require('../models/Review')
const router = express.Router()

// middleware to check authenticated user
const userCheck = (req,res,next)=>{
    if(req.session.user){
        next()
    }else{
        res.redirect('/user/login-error')
    }
}

router.get('/login', (req, res)=>{
    res.render('users/login')
})

router.post('/login', async (req,res)=>{
    let {email, password} = req.body
    const user = await User.findOne({email})
    if(!user){
        req.flash('error', 'user not found')
        res.redirect('/user/login')
    }else{
        const validUser = bcrypt.compare(password, user.password) 
        if(!validUser){
            req.flash('error', 'password did not match')
            res.redirect('/user/login')
        }
        else{
            req.session.user = user.id
            res.redirect('/user/dashboard')
        }
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
    req.flash('success', 'registration successfull')
    res.redirect('/user/login')
})

router.get('/dashboard', async (req,res)=>{
    const items = await Food.find({})
    console.log(req.session)
    res.render('users/dashboard', {items})
})

router.get('/:itemId/view', async (req,res)=>{
    const {itemId} = req.params
    const item = await Food.findById(itemId).populate('reviews')
    res.render('users/view', {item})
})

router.post('/:itemId/add-review', async (req,res)=>{
    const {itemId} = req.params
    const {rating, comment} = req.body
    const user = 'dummyUser'
    const item = await Food.findById(itemId)
    const review = await Review.create({user, rating, comment})
    item.reviews.push(review)
    await item.save()
    req.flash('success', 'review added successfully')
    res.redirect(`/user/${itemId}/view`)
})

router.get('/:itemId/order', async (req,res)=>{
    const {itemId} = req.params
    const item = await Food.findById(itemId)
    res.render('users/order', {item})
})

router.post('/:itemId/order', (req,res)=>{
    const {itemId} = req.body
    req.flash('success', 'Your order has been placed')
    res.redirect(`/user/dashboard`)
})

router.get('/login-error', (req,res)=>{
    res.render('users/login-error')
})

module.exports = router