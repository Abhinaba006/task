const jwt = require("jsonwebtoken")
const User = require("../models/users")
const auth = async(req, res, next) => {

    try {
        // const token = req.header('Authorization').replace('Bearer ', '')
        // const decode = jwt.verify(token, 'MyNameIsAbhinaba')
        // const user = await User.findOne({ _id: decode._id, 'tokens.token':token})
        const user = '6040f36c10fb0008e0f335d8'
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDQwZjM2YzEwZmIwMDA4ZTBmMzM1ZDgiLCJpYXQiOjE2MTQ4NzA4MjV9.fleO4J8IBZibZwJgwYF00Ra7Dzv-c6qIDQIdmMpEZPE'
            // const user = await User.findOne({ _id: '604461106a15343fdc377e1c', 'tokens.token':token})
        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
            //console.log(user)
        next()
    } catch (e) {
        res.status(401).render('register', {
            signup: 'signup',
            login: 'login'
        })
    }
}

module.exports = auth