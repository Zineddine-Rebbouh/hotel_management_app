import mongoose, { Schema, Model, Document } from 'mongoose';
const bcrypt = require('bcrypt')
export type UserType = {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}

const userSchema = new Schema<UserType>({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// midelware for mongodb
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password as string, 10);
    }
    next();
})
const User: Model<UserType> = mongoose.model<UserType>('User', userSchema);

export default User;
