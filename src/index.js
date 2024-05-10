const express = require('express')
require('dotenv').config()
require('./db/mongoose')
const app = express()
const port = process.env.PORT



//middleware function
// app.use((req, res, next) => {
//     if (req.method === "GET") {
//         res.status(500).send("Cant be Acesse")
//     } else {
//         next()
//     }
// })

//server Maintanace Middleware
// app.use((req, res, next) => {
//     res.status(503).send('Server is ShutDown')
// })


app.use(express.json())

//Routers 

const UserRouter = require('./router/user')
app.use(UserRouter)

const TaskRouter = require('./router/task')
app.use(TaskRouter)



//prot listing
app.listen(port, () => {
    console.log(`server listing on ${port}`);
})




// const bcrypt = require('bcryptjs')

// const myFun = async () => {

//     const password = 'Dharmesh123@'
//     const hasedpassword = await bcrypt.hash(password, 8);

//     console.log(password);
//     console.log(hasedpassword);

//     const isvalid = await bcrypt.compare('Dharmesh123!', hasedpassword)
//     console.log(isvalid);
// }

// myFun()



// const jwt = require('jsonwebtoken')

// const myfunction = async () => {
//     const token = jwt.sign({ _id: 'abc123' }, 'mynameisdharmesh', { expiresIn: '1 day' })
//     console.log(token);


//     const data = jwt.verify(token, 'mynameisdharmesh')
//     console.log(data)
// }

// myfunction()


//relationship get antire data of reference id of user/owner

// const Task = require('./model/tasks')
// const User = require('./model/user')

// const fun = async () => {
//     // const task = await Task.findById('663b464022cf9b10e7215b8d')
//     // //now use populate method using owenr fild and expand

//     // await task.populate('owner')//no need old execPopulate()

//     // console.log(task);

//     const user = await User.findById('663b42f8a7854dad04cda4a1')
//     await user.populate('tasks')
//     console.log(user.tasks);
// }

// fun()


//multer use for file upload

const multer = require('multer')

const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(doc|docx)$/)) {
            return cb(new Error('Please provide a word file'))
        }

        cb(null, true)
    }
})


app.post('/upload', upload.single('upload'), (req, res) => {
    res.send()
}, (error, req, res, next) => {//to send error meassage in jason formate
    res.status(400).send({ error: error.message })
})