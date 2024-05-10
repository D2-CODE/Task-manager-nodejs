const mongooes = require('mongoose')
const validator = require('validator')


const TaskSchema = new mongooes.Schema({

    description: {
        type: String,
        required: true,
        trim: true
    }, completed: {
        type: Boolean,
        default: false
    }, owner: {
        type: mongooes.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }

}, {
    timestamps: true
})

const Task = mongooes.model('Task', TaskSchema)


module.exports = Task
