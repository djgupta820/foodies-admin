const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const Food = require('../models/Food')
const Review = require('../models/Review')
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

router.get('/dashboard', async (req,res)=>{
    const items = await Food.find({})
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
    res.redirect(`/user/${itemId}/view`)
})

module.exports = router