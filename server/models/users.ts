import mongoose from "mongoose";
import UserSchema from "./schema/user";
import { IUserDocument, IUserModel } from "../types/types";

const User = mongoose.model<IUserDocument, IUserModel>(
  "User",
  UserSchema
);

export default User;