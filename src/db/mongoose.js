const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config({path:".env"})
console.log(process.env.URL)
mongoose.connect(process.env.URL, {
    useNewUrlParser: true,
    useCreateIndex:true
})
