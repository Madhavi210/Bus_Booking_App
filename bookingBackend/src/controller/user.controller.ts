import Express, { Request, Response, NextFunction } from "express";
import mongoose, { ClientSession } from "mongoose";
import UserService from "../service/user.service";
import AppError from "../utils/errorHandler";
import StatusConstants from "../constant/statusConstant";
import { StatusCode } from "../enum/statusCode";
import { User } from "../model/user.model";
import IUser from "../interface/user.interface";
import { userRole } from "../enum/userRole";
import multer from "multer";
import path from "path";
import upload from "../utils/fileUploads";
import bcrypt from "bcrypt";
import fs from "fs";

export default class UserController {
  public static async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { name, email, password, role } = req.body;
    const profilePic = req.file?.path;
    if (!profilePic) {
      throw new AppError("File not uploaded", StatusCode.BAD_REQUEST);
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const newUser = await UserService.createUser(
        name,
        email,
        password,
        role,
        profilePic,
        session
      );
      await session.commitTransaction();
      session.endSession();
      res.status(StatusCode.CREATED).json(newUser);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  }

  public static async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userId = req.params.id;
    try {
      const user = await UserService.getUserById(userId);
      if (!user) {
        throw new AppError(
          StatusConstants.NOT_FOUND.body.message,
          StatusConstants.NOT_FOUND.httpStatusCode
        );
      }
      res.status(StatusCode.OK).json(user);
    } catch (error) {
      next(error);
    }
  }

  public static async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { users, totalUser } = await UserService.getAllUsers();
      res.status(StatusCode.OK).json({ users, totalUser });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userId = req.params.id;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await UserService.deleteUser(userId, session);
      const user = await User.findById(userId);
      const filepath = user?.profilePic;

      if (!filepath) {
        throw new AppError(
          "File path not found",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      const fullPath = path.join(__dirname, "..", "..", filepath);

      if (!fs.existsSync(fullPath)) {
        throw new AppError("File not found for deletion", StatusCode.NOT_FOUND);
      }

      fs.unlink(fullPath, async (err) => {
        if (err) {
          await session.abortTransaction();
          session.endSession();
          return next(
            new AppError(
              `Error deleting file ${userId}: ${err.message} `,
              StatusCode.INTERNAL_SERVER_ERROR
            )
          );
        }
        await session.commitTransaction();
        session.endSession();
        res.status(StatusCode.NO_CONTENT).send();
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  }

  public static async loginUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { email, password } = req.body;
    try {
      const { id, role, token } = await UserService.loginUser(email, password);
      res.status(StatusCode.OK).json({ id, role, token });
    } catch (error) {
      next(error);
    }
  }

  public static async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userId = req.params.id;
    const updates = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const existingUser = await User.findById(userId).session(session);

      if (!existingUser) {
        throw new AppError("User not found", StatusCode.NOT_FOUND);
      }

      let oldProfilePicPath: string | undefined;
      if (
        updates.profilePic &&
        updates.profilePic !== existingUser.profilePic
      ) {
        oldProfilePicPath = existingUser.profilePic;
      }

      if (oldProfilePicPath) {
        await UserController.deleteProfilePicture(oldProfilePicPath);
      }

      if (req.file) {
        updates.profilePic = req.file.path;
      }

      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }

      const updatedUser = await UserService.updateUser(
        userId,
        updates,
        session
      );

      await session.commitTransaction();
      session.endSession();
      res.status(StatusCode.OK).json(updatedUser);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  }

  private static async deleteProfilePicture(filepath: string): Promise<void> {
    const fullPath = path.join(__dirname, "..", "..", filepath);

    try {
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (err) {
      throw new AppError(
        `Error deleting file `,
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
