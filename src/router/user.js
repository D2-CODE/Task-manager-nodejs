const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const User = require('../model/user')
const multer = require('multer')
const sharp = require('sharp')
const { createAcountmail, deleteAcountmail } = require('../email/account')


router.post('/users', async (req, res) => {

    const user = new User(req.body);
    try {
        await user.save()
        const token = await user.generateAuthToken()
        await createAcountmail(user.email)
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => { return token.token !== req.token })

        await req.user.save()

        res.send()

    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send()

    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/users/me', auth, async (req, res) => {

    res.send(req.user)

    // no longer needed after auth
    // try {
    //     const user = await User.find()
    //     res.send(user)
    // } catch (error) {
    //     res.status(400).send(error)
    // }
})


////no need after /profile/ auth
// router.get('/users/:id', async (req, res) => {
//     let id = req.params.id

//     try {
//         const user = await User.findById({ _id: id })

//         if (!user) {
//             return res.status(404).send("No user found")
//         } else {
//             return res.send(user)
//         }
//     } catch (error) {
//         res.status(400).send(error)
//     }

// })


router.patch('/users/me', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const validUpdate = updates.every((update) => allowedUpdates.includes(update))


    if (!validUpdate) {
        return res.status(400).send({ error: 'invalid Updates!!' })
    }

    // let id = req.user._id
    try {

        ////no longger needed after auth bcz now we have to only update login or authorized user so now we can     
        ////find that in req.user

        // const user = await User.findByIdAndUpdate({ _id: id }, req.body, { new: true, runValidators: true })
        // const user = await User.findById({ _id: id })
        // if (!user) {
        //     return res.status(404).send('No user was found')
        // } else {
        //     return res.send(user)
        // }

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)

    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.deleteOne()
        await deleteAcountmail(req.user.email)
        res.send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }
})

const upload = multer({
    // dest: 'avtars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            return cb(new Error('plze upload images'))
        }

        cb(undefined, true)
    }
})

router.post('/users/me/avtar', auth, upload.single('avtar'), async (req, res) => {

    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 200 }).png().toBuffer();
    req.user.avtar = buffer
    req.user.avatarContentType = 'image/png';
    await req.user.save()

    res.send("received image")
}, (error, req, res, next) => {
    res.status(422).send({
        error: error.message
    })
})


router.delete('/users/me/avtar', auth, async (req, res) => {
    if (!req.user.avtar) {
        return res.status(404).send()
    }

    req.user.avtar = undefined;
    req.user.avatarContentType = undefined;
    await req.user.save();
    res.status(200).send()
})
// const path = require('path');
//competele this code can not get avtar as pic
router.get('/users/:id/avtar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avtar) {
            throw new Error()
        }
        res.set('Content-Type', user.avatarContentType);
        res.send(user.avtar)
    } catch (error) {
        res.status(404).send()
    }
})

module.exports = router