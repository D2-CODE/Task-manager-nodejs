const mongooes = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./tasks');


const userSchema = new mongooes.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email Id")
            }
        }
    }, age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Age can not be Negative")
            }
        }
    },
    password: {
        type: String,
        required: true,
        // minlength: 6,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error("Password can not be password")
                // return ({
                //     warning: "password can not contain password"
                // })
            } else if (value.length <= 6) {
                throw new Error("Password must be 7 character long")
                // return ({
                //     warning: "Password should be 7"
                // })
            }
        }
    },
    avtar: {
        type: Buffer
    },
    avatarContentType: {
        type: String
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})


userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})


userSchema.methods.toJSON = function () {
    const user = this

    const userobject = user.toObject()

    delete userobject.password
    delete userobject.tokens
    delete userobject.avtar
    delete userobject.avatarContentType

    return userobject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET,)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}


userSchema.statics.findByCredentials = async function (email, password) {
    const user = await User.findOne({ email })
    // console.log(user);

    if (!user) {
        throw new Error('unable to login..')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('unable to login...')
    }

    return user;
}


userSchema.pre('save', async function (next) {
    const user = this

    // console.log('somthing before save');
    if (user.isModified('password')) {
        // console.log('somthing before save');
        user.password = await bcrypt.hash(user.password, 8);
    }

    next()
})

userSchema.pre('deleteOne', { document: true }, async function (next) {
    const user = this
    // delete the user's posts
    await Task.deleteMany({ owner: user._id })
    next()
})

const User = mongooes.model('User', userSchema)

module.exports = User