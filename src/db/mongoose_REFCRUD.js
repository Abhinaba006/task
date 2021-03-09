const mongoose = require('mongoose')
const validator = require('validator')
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex:true
})

const User = mongoose.model('User', {
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is not valid') 
            }
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('Age cant be negative')
            }
        }
    }
})

const me = new User({
    name:"                                        Bbhi  ",
    email:"Bbhinaba006@gmail.com",
    age:9
})

const Tasks = mongoose.model('Tasks', {
    description:{
        type:String,
        required: true
    },
    completed:{
        type:Boolean
    }
})

const firstTask = new Tasks({
    description:'ghor mocha',
    completed:false
})

firstTask.save().then((result)=>{
    console.log(result)
}).catch((err)=>{
    console.log(err)
})

me.save().then((result)=>{
    console.log(result)
}).catch((err)=>{
    console.log(err)
})