const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Tas = require('../models/tasks')
const Tasks = require('../models/tasks')
const dotenv = require('dotenv')

require('dotenv').config({path:'.env'})

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        unique: true,
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is not valid')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age cant be negative')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password'))
                throw new Error("password cant be smaller than 6 or common")
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

//virtual data is not stored in the databasse but it is used to define relationship
userSchema.virtual('tasks', {
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'owner'
})

// userSchema.methods.toJSON = function() {
//     const user = this
//     const userObj = user.toObject()
//     delete userObj.password
//     delete userObj.tokens
//     return userObj
// }

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user.id.toString() }, process.env.SECRET_KEY)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findbyCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

// delete user task when removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Tasks.deleteMany({ owner: user._id })
    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User