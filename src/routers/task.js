const express = require('express')
const { model } = require('mongoose')
const Tasks = require('../models/tasks')
const auth = require('../middlewares/auth')

const router = new express.Router()

router.post('/tasks', auth, async (req, res)=>{
    if(req.body.completed){
        req.body.completed = true
    }
    console.log(req.body)
    //const tasks = new Tasks(req.body)
    const task = new Tasks({
        ...req.body,
        owner:req.user._id
    })

    try{
        const tasks = await task.save()
        // res.send(tasks)
        res.redirect('/tasks')
    }catch(err){
        res.status(500).send(err)
    }
})



router.get('/tasks', auth, async (req, res)=>{
    try{
        const task = await Tasks.find({owner:req.user._id})
        res.render('tasks', {
            task
        })
    }catch(err){
        res.status(500).send(err)
    }
})

router.get('/tasks/:id', auth, async (req, res)=>{
    const _id = req.params.id

    try{
        // const result = await Tasks.findById({_id})
        const result = await Tasks.findOne({
            _id,
            owner: req.user._id
        })
        if(!result){
            return res.status(404).send()
        }
        res.send(result)
    }catch(err){
        res.status(500).send()
    }
})

router.patch('/tasks/:id', async (req, res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ["description", "completed"]
    const isValidUpdate = updates.every((update)=>allowedUpdates.includes(update))

    // console.log(req.body)

    if(!isValidUpdate){
        return res.status(400).send("invalid update")
    }
    
    try{
        const task = await Tasks.findById(req.params.id)

        //const task = await Tasks.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators:true})
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update)=>task[update]=req.body[update])
        await task.save()
        res.send(task)

    }catch(e){
        res.status(500).send(e)
    }
})

router.delete('/tasks/:id', auth, async(req, res)=>{
    try{
        // const task = await User.findByIdAndDelete(req.params.id)
        const task = await Tasks.findOneAndDelete({_id:req.params.id, owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

module.exports = router
