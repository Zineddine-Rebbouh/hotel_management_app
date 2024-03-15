const express = require('express')
import 'dotenv/config';
import { NextFunction } from 'express';
import path from 'path';
const cors = require('cors')
const mongoose = require('mongoose')
const port = process.env.PORT || 8000;
const app = express();
const userRoutes = require('./routes/userRoutes')
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser')
// auto convert body data endpoints to json format
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.static(path.join(__dirname, "../../Frontend/dist")));
app.use(express.json());
//  the middleware parses this URL-encoded data and exposes it on the req.body object, 
// making it easier to access and work with in the subsequent route handlers.
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
});

mongoose.connect(process.env.MONGO_DB_CONNECTION as string)
    .then(() => console.log('MongoDB connected : ' + process.env.MONGO_DB_CONNECTION))
    .then(() => {
        app.listen(port, () => {
            console.log(`server is running on ${port}`);
        })
    })
    .catch((err: Error | any) => {
        console.error(err);
    });
