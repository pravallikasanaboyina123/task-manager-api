const express = require('express')
// const bcryptjs=require('bcryptjs')
const jwt = require('jsonwebtoken')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
require('./db/mongoose')
const app = express()
const port = process.env.PORT
// middleware before run routers
// app.use((req,res,next)=>{
//     // console.log(req.method,req.path)
//     if(req.method==='GET'){
//         return res.send('GET requests are disabled')
//     }
//     next()
// })

// middleware task
// app.use((req,res,next)=>{
//    res.status(503).send({
//        message:'The site is currently down. Please try back soon'
//    })
// })

//multer concept
// const multer = require('multer')
// const upload = multer({
//   dest: 'images/',
//   limits:{
//     fileSize:28000000
//   },
//   fileFilter(req,file,cb){
//    if(!file.originalname.match('\.(doc|docx)$')){
//      return cb(new Error('Upload a document file'))
//    }
//    cb(undefined,true)
//   }
    
  
// })

// app.post('/upload', upload.single('upload'), (req, res) => {
//   res.send()
// },(error,req,res,next)=>{
//           res.status(400).send({error:error.message})
// })



app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
app.listen(port, () => {
  console.log(`app running on port ${port}`)
})
/*******bcryptjs concept**********/
// const password=async()=>{
//     const userPassword='pravs1234'
//     const hashedPassword=await bcryptjs.hash(userPassword,8)
//     console.log(userPassword)
//     console.log(hashedPassword)
//     const isEqual=await bcryptjs.compare('Pravs1234',hashedPassword)
//     console.log(isEqual)
// }
// password();


// jsonwebtoken concept
// const myjwt=async()=>{
//     const token=jwt.sign({_id:'abcd123'},'thisismytoken',{expiresIn:'7 days'})
//     console.log(token)
//     const data=jwt.verify(token,'thisismytoken')
//     console.log(data)
// }
// myjwt();

//toJSON concept
// const dog={
//     name:'lucky',
//     color:'white'
// }
// dog.toJSON=function(){
//     // delete this.color          
//     console.log(this)        //when we write delete this.color then ouptput is { name: 'lucky', toJSON: [Function] }
//     return this
// }
// console.log(JSON.stringify(dog))      // when we write delete this.color {"name":"lucky"}


//task+user
// const Task=require('./models/tasks')
// const User=require('./models/users')
// const main=async ()=>{
//         // const task=await Task.findById('5daeaabf6540001452c6da24')
//         // await task.populate('owner').execPopulate()
//         // console.log(task.owner)
//         const user=await User.findById('5daeaa8b6540001452c6da21')
//         await user.populate('tasks').execPopulate()
//         // console.log(user.tasks)

// }
// main()