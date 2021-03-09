const express = require('express')
const { model } = require('mongoose')
const multer = require('multer')
const User = require('../models/users')
const auth = require('../middlewares/auth')

const router = new express.Router()
const upload = multer({
    dest:'avatar',
    limits:{
        fileSize: 2000000
    },
    fileFilter(req, file, cb){
        // cb(new Error('file must be an image'))
        // cb(undefined, true)
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('provide a jpg file'))
        }

        cb(undefined, true)
    }
})

// router.get('/users', auth, async (req, res)=>{
//     res.send('auth')
// })

router.post('/users', async (req, res)=>{
    const user = new User(req.body)

    // user.save().then((result)=>{
    //     res.send(result)
    // }).catch((err)=>{
    //     res.status(400).send(err)
    // })
    try{
        const result = await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({result, token})
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res)=>{
    try{
        const user = await User.findbyCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }catch(e){
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.user.save()

        res.send()
    }catch{
        res.status(500).send()
    }
    res.send('ki')
})

router.post('/users/logoutall', auth, async (req, res)=>{
    try{
        req.user.tokens = []
        await req.user.save()

        res.send()
    }catch{
        res.status(500).send()
    }
    res.send('ki')
})

router.get('/users/me', auth, async (req, res)=>{
    // try{
    //     const result = await User.find({})
    //     res.send(result)
    // }catch(e){
    //     res.status(400).send(e)
    // }

    res.send(req.user)
})

router.post('/users/me/avatar', upload.single('upload'), async(req, res)=>{
    res.status(200).send()
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

router.patch('/users/me', auth, async (req, res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'age', 'password']
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))

    if(!isValidOperation){
        res.status(400).send('invalid updates property')
    }
    try{
        const user = await req.user
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators:true})
        // if(!user){
        //     return res.status(404).send("user not found")
        // }
        updates.forEach((update)=>user[update] = req.body[update])
        await user.save()
        res.send(user)
    }catch(e){
        res.status(500).send(e)
    }

})

router.delete('/users/me', auth, async(req, res)=>{
    try{
        // const user = await User.findByIdAndDelete(req.user._id)
        // if(!user){
        //     return res.status(404).send()

        await req.user.remove()

        res.send(req.user)
    }catch(e){
        res.status(500).send()
    }
})



module.exports = router