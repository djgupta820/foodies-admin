const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        minlength: 10,
        maxlength: 10,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const Admin = new mongoose.model('Admin', AdminSchema)

module.exports = Admin