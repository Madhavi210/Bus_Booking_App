import mongoose from "mongoose";
import { MONGODB_URI } from "../config/config";
import { logger } from "../utils/logger";
export default class Database {
  constructor() {
    this.connect();
  }

  private async connect() {
    try {
      if (!MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined");
      }
      await mongoose.connect(MONGODB_URI);
      logger.info(`Connected to MongoDB`);
    } catch (error: any) {
      console.error("Error connecting to MongoDB:", error.message);
    }
  }
}
