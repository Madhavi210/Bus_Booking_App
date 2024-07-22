
// src/services/user.service.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ClientSession } from 'mongoose';
import { User } from '../model/user.model';
import IUser from '../interface/user.interface';
import AppError from '../utils/errorHandler';
import StatusConstants from '../constant/statusConstant';
import { SECRET_KEY } from '../config/config';
import { userRole } from '../enum/userRole';

export default class UserService {
    public static async createUser(
        name: string,
        email: string,
        password: string,
        role: string,
        profilePic: string,
        session: ClientSession
    ): Promise<IUser> {        
        const existingUser = await User.findOne({ email }).session(session);
        if (existingUser) {
            throw new AppError(
                StatusConstants.DUPLICATE_KEY_VALUE.body.message,
                StatusConstants.DUPLICATE_KEY_VALUE.httpStatusCode
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role ,
            profilePic
        });

        await newUser.save({ session });
        return newUser.toObject(); 
    }

    public static async getUserById(id: string): Promise<IUser | null> {
        return User.findById(id).exec();
    }

    public static async getAllUsers(): Promise<{ users: IUser[], totalUser: number }> {
        const users = await User.find().exec();
        const totalUser = await User.countDocuments().exec();
        return { users, totalUser };
    }

    public static async updateUser(
        id: string,
        updates: Partial<IUser>,
        session: ClientSession
    ): Promise<IUser | null> {
        const user = await User.findByIdAndUpdate(id, updates, { new: true, session }).exec();
        if (!user) {
            throw new AppError(
                StatusConstants.NOT_FOUND.body.message,
                StatusConstants.NOT_FOUND.httpStatusCode
            );
        }
        if (!updates.token) {
            updates.token = user.token;
        }
        return user.toObject();
    }

    public static async deleteUser(id: string, session: ClientSession): Promise<void> {
        const user = await User.findByIdAndDelete(id).session(session).exec();
        if (!user) {
            throw new AppError(
                StatusConstants.NOT_FOUND.body.message,
                StatusConstants.NOT_FOUND.httpStatusCode
            );
        }
    }

    public static async loginUser(
        email: string,
        password: string
    ): Promise<{ id: string, role:string, token: string }> {
        const user = await User.findOne({ email }).exec();
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new AppError(
                StatusConstants.UNAUTHORIZED.body.message,
                StatusConstants.UNAUTHORIZED.httpStatusCode
            );
        }
        if (!SECRET_KEY) {
            throw new AppError(
                StatusConstants.INTERNAL_SERVER_ERROR.body.message,
                StatusConstants.INTERNAL_SERVER_ERROR.httpStatusCode
            );
        }
        const token = jwt.sign({ userId: user._id , role:user.role}, SECRET_KEY, { expiresIn: '10h' });
        user.token = token;        
        await user.save();
        return { id: String(user._id), role: String(user.role), token };
    }
}