import { NextFunction, Request, Response } from 'express';
import User from '../models/User';
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')

export const login = async (req: Request, res: Response<any>) => {
    // Implement login functionality...
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: "Invalid credentials", errors: errors.array()
            })
        }

        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            return res.status(404).json({ message: "Invaild Credentails" })
        }

        const isEqual = await bcrypt.compare(req.body.password, user.password)
        if (!isEqual) {
            return res.status(401).
                json({
                    message: "Invaild Credentails"
                })
        }
        // Sign JSON Web Token    
        const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET as String, {
            expiresIn: "1d",
        })

        const cookieConfig = {
            httpOnly: true, // to disable accessing cookie via client side js
            secure: process.env.PROJECT_STATUS === 'production', // to force https (if you use it)
            maxAge: 86400000, // ttl in seconds (remove this option and cookie will die when browser is closed)
        };

        res.cookie('auth_token', token, cookieConfig)
        return res.status(200).json({ userId: user._id })
    } catch (error) {
        console.error('Error during Login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getToken = (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({ userId: req.userId });
}

export const invalidateToken = (req: Request, res: Response, next: NextFunction) => {
    res.cookie("auth_token", "", { expires: new Date(0) })
    res.status(200).send({ message: 'signout succes' });
}