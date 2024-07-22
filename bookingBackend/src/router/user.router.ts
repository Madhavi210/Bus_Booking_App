
import express from 'express';
import UserController from '../controller/user.controller';
import upload from '../utils/fileUploads';

export default class UserRouter {
  private router: express.Router;

  constructor() {
    this.router = express.Router();
    this.routes();
  }

  private routes() {
    this.router.post('/',  upload.single('profilePic'), UserController.createUser);

    this.router.get('/:id', UserController.getUserById);

    this.router.delete('/:id', UserController.deleteUser);

    this.router.put('/:id',upload.single('profilePic'), UserController.updateUser);

    this.router.get('/', UserController.getAllUsers);

    this.router.post('/login', UserController.loginUser);

  }

  public getRouter() {
    return this.router;
  }
}