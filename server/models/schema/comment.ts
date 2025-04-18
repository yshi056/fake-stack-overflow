import mongoose from "mongoose";
import { /*IComment,*/ ICommentDocument, ICommentModel } from "../../types/types";


/**
 * The schema for a document in the Tags collection.
 * 
 * The schema is created using the constructor in mongoose.Schema class.
 * The schema is defined with two generic parameters: ITagDocument and ITagModel.
 * ITagDocument is used to define the instance methods of the Tag document.
 * ITagModel is used to define the static methods of the Tag model.
 */

const CommentSchema = new mongoose.Schema<ICommentDocument, ICommentModel>(
  {
    text: {type: String, required: true},
    user: {type: String, required: true},
    comment_date_time: {type: Date, required: true},
  },
  { collection: "Comment" }
);

// CommentSchema.methods.convertToIComment = function (this: ICommentDocument): IComment {
//   return {
//     _id: this._id.toString(),
//     text: this.text,
//     user: this.user,
//     comment_date_time: this.comment_date_time.toString(),
//   };
// }

export default CommentSchema