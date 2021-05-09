const express = require('express')
const { model } = require('mongoose')
const Tasks = require('../models/tasks')
const auth = require('../middlewares/auth')

const router = new express.Router()

router.post('/tasks', auth, async (req, res)=>{
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})



router.get('/tasks', auth, async (req, res)=>{
    try{
        const task = await Tasks.find({owner:req.user._id})
        res.status(200).send(task)
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
