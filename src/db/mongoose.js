const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config({path:".env"})

mongoose.connect(process.env.URL, {
    useNewUrlParser: true,
    useCreateIndex:true
})
