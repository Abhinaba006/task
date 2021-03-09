const express = require('express')
const bcrypt = require('bcryptjs')
const path = require('path')
const bodyParser = require("body-parser");

require('./db/mongoose')
const User = require('./models/users')
const Tasks = require('./models/tasks')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const auth = require('./middlewares/auth')


/////////////////////////////////////
//for frontend
const hbs = require('hbs')
//define paths for express
const public = path.join(__dirname, '../public');
const view_path = path.join(__dirname, '../templates/views')
const partials_path = path.join(__dirname, '../templates/partials')

// init the app
const app = express()

//set hbs
app.set('view engine', 'hbs')
app.set('views', view_path)
hbs.registerPartials(partials_path)

app.use(express.static(public)) ;   //setup directory to serve css

////////////////////////////////



const port = process.env.PORT || 3000

// // app.use((req, res, next)=>{
// //     if(req.method ==='GET'){
// //         res.send('get are disabled')
// //     }else{
// //         next()
// //     }
// // })

// app.use((req, res, next)=>{
//     res.status(503).send('fuck you ')
// })  

app.use(express.json()) //automatically parse json file recived 
app.use(bodyParser.urlencoded({ extended: false })); // idk what it is doing

app.use(userRouter)
app.use(taskRouter)

app.get('/', auth, async (req, res)=>{
    res.send('LOGGED IN/ redirect to task page')
})

// without middleware new rwq -> run handler
// with middleware new req -> do something -> run route handler

app.listen(port, ()=>{
    console.log('Server is up at '+port)
})

// const jwt = require('jsonwebtoken')

// const myFunc = async ()=>{
//     const token = jwt.sign({_id:'1234'}, 'thisismycourse', {expiresIn:'1 sec'})
//     console.log(token)

//     const data = jwt.verify(token, 'thisismycourse')
//     console.log(data)
// }

// myFunc()

// const Task = require('./models/tasks')

// // const main = async ()=>{
// //     // const task = await Task.findById('603fa0156afc173f8c4b348b')
// //     // await task.populate('owner').execPopulate()
// //     // console.log(task.owner)

// //     const user = await User.findById('603e7cbbe234ea205c67c1c1')
// //     await user.populate('tasks').execPopulate()
// //     console.log(user.tasks)
// // }

// // main()

// // Task.deleteOne({owner:'603fb790f49f363ed0d62dd7'})

// const multer = require('multer')

// const upload = multer({
//     dest:'imgs'
// })

// app.post('/upload', upload.single('upload'), (req, res)=>{
//     res.send()
// })
