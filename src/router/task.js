const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Task = require('../model/tasks')
const User = require('../model/user')
const { matches } = require('validator')


router.post('/tasks', auth, async (req, res) => {

    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try {
        await task.save()
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})


router.get('/tasks', auth, async (req, res) => {

    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    if (req.query.sortby) {
        const parts = req.query.sortby.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    try {
        // const task = await Task.find({ owner: req.user._id })

        //alternative of above
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.send(req.user.tasks);
    } catch (error) {
        res.status(401).send(err)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    let id = req.params.id

    try {
        // const task = await Task.findById({ _id: id })
        const task = await Task.findOne({ _id: id, owner: req.user._id })
        if (!task) {
            return res.status(404).send('The task with the given ID was not found.')
        } else {
            return res.send(task)
        }
    } catch (error) {
        res.status(400).send(error)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isvalidUpdate = updates.every((update) => allowedUpdates.includes(update))



    if (!isvalidUpdate) {
        return res.status(400).send({ error: 'invalid Updates!!' })
    }

    let id = req.params.id

    try {

        const task = await Task.findOne({ _id: id, owner: req.user._id })
        // const task = await Task.findById({ _id: id })

        if (!task) {
            return res.status(404).send("No Task with that Id exists.")
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        await task.deleteOne()
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})


module.exports = router