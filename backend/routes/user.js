const express = require('express');
const zod = require('zod');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const { User, Account } = require('../db');
const { authMiddleware } = require('../middleware')
const userRouter = express.Router();

const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string(),
})

userRouter.post('/signup', async (req,res) => {
    const { success } = signupBody.safeParse(req.body);

    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs",
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username,
    })
    
    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs",
        })
    }

    const user = await User.create({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
    })

    const userId = user.id;

    await Account.create({
        userId,
        balance: 1 + Math.random()*10000,
    })

    const token = jwt.sign({
        userId: userId,
    }, JWT_SECRET);

    res.status(200).json({
        message: "User created successfully",
        token: token
    })
})

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string(),
})

userRouter.post('/signin', async (req,res) => {
    const parsedUser = signinBody.safeParse(req.body);

    if (!parsedUser.success) {
        return res.status(411).json({
            message: "Error while logging in",
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password,
    });

    const userId = user.id;

    if (user) {
        const token = jwt.sign({
            userId: userId
        }, JWT_SECRET)

        return res.json({
            token: token,
        })
    }

    res.status(411).json({
        message: "Error while logging in",
    })
})

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

userRouter.put('/', authMiddleware, async (req,res) => {
    const { success } = updateBody.safeParse(req.body);

    if (!success) {
        return res.status(411).json({
            message: "Error while updating information",
        })
    }

    await User.updateOne({ id: req.userId }, req.body)

    res.json({
        message: "Updated successfully",
    })
})

userRouter.get('/bulk', authMiddleware, async (req, res) => {
    const filter = req.query.filter || "";

    const userId = req.userId;

    const users = await User.find({ $or: [
        {
            firstName: {
                "$regex": filter
            }
        },
        {
            lastName: {
                "$regex": filter
            }
        }
    ]})

    if (users.findIndex((user) => user._id == userId) > -1) {
        users.splice(users.findIndex((user) => user._id == userId),1)
    }

    res.json({
        users: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            id: user.id,
        }))
    })
})

userRouter.get('/user', async (req, res) => {
    const filter = req.query.filter;

    const user = await User.find({
        _id: filter
    })

    res.json({
        user: user[0],
    })
})

module.exports = {userRouter};