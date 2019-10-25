const express = require('express')
const multer=require('multer')
const {welcomeMsgToUser,cancelMsgToUser}=require('../emails/account')
const sharp=require('sharp')
const auth=require('../middleware/auth')
const router = new express.Router()
const User = require('../models/users')
// creation of user in postman
router.post('/users', async (req, res) => {
      const user = new User(req.body)
      // using async/await
      try {
            await user.save()
            welcomeMsgToUser(user.mail,user.name)
            const token=await user.generateAuthToken()
            res.status(201).send({user,token})
      } catch (e) {
            res.status(400).send(e)
      }
      // using promises
      //    user.save().then((user)=>{
      //          res.send(user)
      //    }).catch((e)=>{
      //            res.status(400).send(e)
      //    })
})
//login user
router.post('/users/login', async (req, res) => {
      try {
            const user = await User.findByCredentials(req.body.mail, req.body.password)
            const token=await user.generateAuthToken()
           
            res.send({user,token})
      } catch (e) {
            res.status(400).send({
                  message:'Unable to login'
            })
      }
})
//user logout
router.post('/users/logout',auth,async(req,res)=>{
      try{
      req.user.tokens=req.user.tokens.filter((token)=>{
            
            return token.token!==req.token
      })
      await req.user.save()
      res.send()
      }catch(e){
           res.status(500).send()
      }
})
//task:logoutall
router.post('/users/logoutAll',auth,async(req,res)=>{
      try{
            req.user.tokens=[]
            await req.user.save()
            res.send()
      }catch(e){
               res.status(500).send()
      }
}) 

//post profile pic by auth user using multer
const upload=multer({
      // dest:'avatar',     //by this line the images stored in avatar directory,not in db.
      limits:{
            fileSize:1000000
      },
      fileFilter(req,file,cb){
            if(!file.originalname.match('\.(jpg|jpeg|png)$')){
                  return cb(new Error('Upload images'))
            }
            cb(undefined,true)
      }
})
router.post('/users/me/avatar',auth, upload.single('avatar'),async(req,res)=>{
      const buffer=await sharp(req.file.buffer).resize({width:300,height:300}).png().toBuffer()
       req.user.avatar=buffer
      await req.user.save()
      res.send()
},(error,req,res,next)=>{
      res.status(400).send({error:error.message})
})

//get user profile pic by user id
router.get('/users/:id/avatar',async(req,res)=>{
      try{
            const user=await User.findById(req.params.id)
            if(!user ||!user.avatar){
                  throw new Error()
            }
            res.set('Content-Type','image/jpg')
            res.send(user.avatar)
      }catch(e){
                 res.status(404).send()
      }

})

//delete profile pic of authenticated user
router.delete('/users/me/avatar',auth,async(req,res)=>{
      req.user.avatar=undefined
      await req.user.save()
      res.status(200).send()
})

// reading auth user
router.get('/users/me', auth,async (req, res) => {
        res.send(req.user)
      //using async/await
      // try {
      //       const users = await User.find()
      //       res.send(users)
      // } catch (e) {
      //       res.status(500).send(e)
      // }
      // using promises 
      //      User.find().then((users)=>{
      //            res.send(users)
      //      }).catch((e)=>{
      //            res.status(500).send(e)
      //      })
})


// reading single user by id
router.get('/users/:id', async (req, res) => {
      const _id = req.params.id
      //using async/await
      try {
            const user = await User.findById(_id)
            if (!user) {
                  return res.status(404).send()
            }
            res.send(user)
      } catch (e) {
            res.status(500).send()
      }
      // using promises
      // User.findById(_id).then((user)=>{
      //       if(!user){
      //            return res.status(404).send()
      //       }
      //       res.send(user)
      // }).catch((e)=>{
      //       res.status(500).send()
      // })
})


/************updating user ********/
router.patch('/users/me',auth, async (req, res) => {
      const updates = Object.keys(req.body)
      const allowedUpdates = ['name', 'email', 'password', 'age']
      const isValidOperation = updates.every((update) => {
            return allowedUpdates.includes(update)
      })
      if (!isValidOperation) {
            return res.status(400).send({
                  error: 'Invalid update operation'
            })
      }
      try {
            // const user = await User.findById(req.params.id)
            updates.forEach((update) => req.user[update] = req.body[update])
            await req.user.save()
            //     const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
            if (!req.user) {
                  res.status(404).send()
            }
            res.send(req.user)
      } catch (e) {
            res.status(400).send(e)
      }
})


/********deleting user **********/
router.delete('/users/me',auth, async (req, res) => {
      try {
            // const user = await User.findByIdAndDelete(req.params.id)
            // if (!user) {
            //       return res.status(404).send()
            // }
            await req.user.remove()
            cancelMsgToUser(req.user.mail,req.user.name)
            res.send(req.user)
      } catch (e) {
            res.status(500).send(e)
      }
})

module.exports = router;