const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/users')
const Task = require('../../src/models/tasks')
const { urlencoded } = require('body-parser')
const userOneId = mongoose.Types.ObjectId()
const userTwoId = mongoose.Types.ObjectId()

const user1 = {
    _id: userOneId,
    name: "John",
    email: "mic@mic.com",
    password: "qwertyuiop",
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.SECRET_KEY)
    }]
}

const user2 = {
    _id: userTwoId,
    name: "Abhinaba",
    email: "msdsdic@mic.com",
    password: "qwertyuiop",
    tokens: [{
        token: jwt.sign({ _id: userTwoId}, process.env.SECRET_KEY)
    }]
}

const task1 = {
    _id: new mongoose.Types.ObjectId(),
    description:"testing 2.1",
    completed:false,
    owner:userOneId
}

const task2 = {
    _id: new mongoose.Types.ObjectId(),
    description:"testing 2.2",
    completed:true,
    owner:userOneId
}

const task3 = {
    _id: new mongoose.Types.ObjectId(),
    description:"testing 2.3",
    completed:false,
    owner:userTwoId
}

const setupDataBase = async () => {
    await User.deleteMany()
    await new User(user1).save()
    await new User(user2).save()
    await Task.deleteMany()
    await new Task(task1).save()
    await new Task(task2).save()
    await new Task(task3).save()
}

module.exports = {
    userOneId,
    user1,
    setupDataBase
}