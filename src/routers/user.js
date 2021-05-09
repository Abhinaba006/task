const express = require('express')
const { model } = require('mongoose')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeMail, sendCancelationMail} = require('../emails/account')
const User = require('../models/users')
const auth = require('../middlewares/auth')

const router = new express.Router()
const upload = multer({
    limits: {
        fileSize: 2000000
    },
    fileFilter(req, file, cb) {
        // cb(new Error('file must be an image'))
        // cb(undefined, true)
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) { // this function runs when new file is uploded   
            return cb(new Error('provide a img file'))
        }

        cb(undefined, true) //cb is callback and is called if ll is ok // true means it will accept it
    }
})

// router.get('/users', auth, async (req, res)=>{
//     res.send('auth')
// })

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    // user.save().then((result)=>{
    //     res.send(result)
    // }).catch((err)=>{
    //     res.status(400).send(err)
    // })
    try {
        const result = await user.save()
        sendWelcomeMail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ result, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findbyCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch {
        res.status(500).send()
    }
    res.send('ki')
})

router.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send()
    } catch {
        res.status(500).send()
    }
    res.send('ki')
})

router.get('/users/me', auth, async (req, res) => {
    // try{
    //     const result = await User.find({})
    //     res.send(result)
    // }catch(e){
    //     res.status(400).send(e)
    // }

    res.send(req.user)
})

router.post('/users/me/avatar', auth, upload.single('upload'), async (req, res) => {
    // console.log(req.file)
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    // req.user.avatar = req.file.buffer
    req.user.avatar = buffer
    //going to use sharp
    await req.user.save()
    res.status(200).send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

//router to delete avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.status(200).send()
    }catch(e){
        res.status(400).send(e)
    }
})
//router to fetch user img
router.get('/users/:id/avatar', async (req, res)=>{
    try{
        const user = await User.findById(req.params.id)
        console.log(user.avatar)
        if(!user|| !user.avatar){
            throw new Error('Fuck')
        }
        res.set('Content-Type', 'image/png') // bydefault set to json
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})
// router.get('/users/:id', async (req, res)=>{
//    const _id = req.params.id
//    try{
//         const user = await User.findById({_id})
//         if(!user){
//             return res.status(404).send()
//         }
//         res.send(user)
//    }catch(e){
//         res.status(500).send()
//    }
// })

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'age', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        res.status(400).send('invalid updates property')
    }
    try {
        const user = await req.user
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators:true})
        // if(!user){
        //     return res.status(404).send("user not found")
        // }
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }

})

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        // if(!user){
        //     return res.status(404).send()

        await req.user.remove()

        sendCancelationMail(req.user.email, req.user.name)

        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})



module.exports = router