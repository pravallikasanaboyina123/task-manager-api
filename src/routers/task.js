const express = require('express')
const auth = require('../middleware/auth')
const Tasks = require('../models/tasks')
const router = new express.Router()
// creation of task in postman
router.post('/tasks', auth, async (req, res) => {
      //     const task = new Tasks(req.body)
      const task = new Tasks({
            ...req.body,
            owner: req.user._id
      })
      //using async/await
      try {
            await task.save()
            res.status(201).send(task)
      } catch (e) {
            res.status(400).send(e)
      }
      // using promises
      //     task.save().then((task)=>{
      //           res.send(task)
      //     }).catch((e)=>{
      //             res.status(400).send(e)
      //     })
})

// /tasks?completed=true or false 
// /tasks?limit=1&skip=2
// /tasks?sortBy=createdAt:asc or desc
router.get('/tasks', auth, async (req, res) => {
      const match = {}
      const sort = {}
      if (req.query.completed) {
            match.completed = req.query.completed === 'true'
      }
      if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
      }
      //using async/await
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
      // using promises
      // Tasks.find().then((tasks)=>{
      //       res.send(tasks)
      // }).catch((e)=>{
      //       res.status(500).send()
      // })
})
// reading task by id
router.get('/tasks/:id', auth, async (req, res) => {
      const _id = req.params.id
      //using async/await
      try {
            //     const task = await Tasks.findById(_id)
            const task = await Tasks.findOne({
                  _id,
                  owner: req.user._id
            })
            if (!task) {
                  return res.status(404).send()
            }
            res.send(task)

      } catch (e) {
            res.status(500).send()
      }
      // using promises
      // Tasks.findById(_id).then((task)=>{
      //       if(!task){
      //             return res.status(404).send()
      //       }
      //       res.send(task)
      // }).catch((e)=>{
      //       res.status(500).send()
      // })
})
/*******updating tasks data by id ***********/
router.patch('/tasks/:id', auth, async (req, res) => {
      const updates = Object.keys(req.body)
      const allowedUpdates = ['description', 'completed']
      const isValidOperation = updates.every((update) => {
            return allowedUpdates.includes(update)
      })
      if (!isValidOperation) {
            return res.status(400).send({
                  error: 'Invalid update operation'
            })
      }
      try {
            const task = await Tasks.findOne({
                  _id: req.params.id,
                  owner: req.user._id
            })
            if (!task) {
                  return res.status(404).send({
                        message: 'Task not found'
                  })
            }
            // const task = await Tasks.findById(req.params.id)
            updates.forEach((update) => task[update] = req.body[update])
            await task.save()
            res.send(task)
      } catch (e) {
            res.status(400).send(e)
      }
})
/********deleting task data by id **********/
router.delete('/tasks/:id', auth, async (req, res) => {
      try {
            const task = await Tasks.findOneAndDelete({
                  _id: req.params.id,
                  owner: req.user._id
            })
            if (!task) {
                  return res.status(404).send({
                        message: 'Task not found'
                  })
            }
            res.send(task)
      } catch (e) {
            res.status(500).send(e)
      }
})
module.exports = router