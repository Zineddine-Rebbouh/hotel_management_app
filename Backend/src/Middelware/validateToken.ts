import { Request, Response, NextFunction } from "express";
const jwt = require('jsonwebtoken')

declare global {
    namespace Express {
        interface Request {
            userId: string
        }
    }
}
export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies['auth_token']

    if (!token) {
        return res.status(401).json({ message: 'unathourized' });
    }

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'unathourized' });
    }

}