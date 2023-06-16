const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
    user: String,
    reating: Number,
    comment: String
})

const Review = new mongoose.model('Review', ReviewSchema)
module.exports = Review