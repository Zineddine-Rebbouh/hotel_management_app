import { Request, Response } from 'express';
import User from '../models/User';
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')


export const register = async (req: Request, res: Response<any>) => {
    try {
        const errors = validationResult(req)
        // Check if req.body exists and is not null

        if (!errors.isEmpty()) {
            return res.status(400).
                json({
                    success: false, error: errors
                        .array()
                })
        }

        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = new User(req.body);
        await user.save();

        // creating token 
        const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET as String, {
            expiresIn: "1d",
        })

        const cookieConfig = {
            httpOnly: true, // to disable accessing cookie via client side js
            secure: process.env.PROJECT_STATUS === 'production', // to force https (if you use it)
            maxAge: 86400000, // ttl in seconds (remove this option and cookie will die when browser is closed)
        };

        res.cookie('auth_token', token, cookieConfig)
        return res.status(201).send({ message: 'registration success ' })
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


export const ConfirmPayment = async (req: Request, res: Response) => {
    const userId = req.userId;
    try {
        const user = await User.findById(userId).select("-password")
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }
        return res.json(user)
    } catch (error) {
        console.log(error);
        return res.status(500)
    }
}
// export const login = async (req: Request, res: Response<any>) => {
//     // Implement login functionality...
// };
