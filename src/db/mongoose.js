const mongooes = require('mongoose');
const validator = require('validator')

async function main() {
    await mongooes.connect(process.env.DBURL).then((res) => {
        console.log("Conected to db");
    }).catch((err) => {
        console.log('error: ', err)
    })

}

main()

// const Task = mongooes.model('Task', {
//     description: {
//         type: String,
//         required: true,
//         trim: true
//     }, completed: {
//         type: Boolean,
//         default: false
//     }
// })


// const task = new Task({
//     description: '  Learn Mongo DB4  ',
//     completed: false
// })


// task.save().then((result) => {
//     console.log("Task Saved Sucessfully : ", result);
// }).catch((error) => {
//     console.log("Error during Saving Task : ", error);
// })
