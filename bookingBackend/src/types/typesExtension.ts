
import { Document } from 'mongoose'; 
import { Express,Request } from 'express';

declare module 'express' {
  interface Request {
    id?: string;
    role?: string;
  }
}