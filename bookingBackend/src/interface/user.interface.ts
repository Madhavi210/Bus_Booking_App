import { Schema, model, Document } from 'mongoose';

export default interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    token: string;
    profilePic: string;
    gender: 'Male' | 'Female' | 'Other';
    age : number;
    createdAt?: Date;
    updatedAt?: Date;
}