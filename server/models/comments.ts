import mongoose from "mongoose";
import CommentSchema from "./schema/comment";
import { ICommentDocument, ICommentModel } from "../types/types";

export const Comment = mongoose.model<ICommentDocument, ICommentModel>("Comment", CommentSchema);

export default Comment;