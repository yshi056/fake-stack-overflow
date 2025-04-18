import mongoose from "mongoose";
import { IAnswerDocument, IAnswerModel } from "../../types/types";
import { IAnswerDB } from "../../scripts/script_types";

/**
 * The schema for a document in the Answer collection.
 * 
 * text: String to store the text associated with an answer
 * ans_by: String to store the username of the answer provider
 * ans_date_time: Date to store the date and time the answer was posted.
 * 
 * The schema is created using the constructor in mongoose.Schema class.
 * The schema is defined with two generic parameters: IAnswerDocument and IAnswerModel.
 * IAnswerDocument is used to define the instance methods of the Answer document.
 * IAnswerModel is used to define the static methods of the Answer model.
 */
const AnswerSchema = new mongoose.Schema<IAnswerDocument, IAnswerModel> (
  {
    //user : {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    qid: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Question" },
    text : {type: String, required: true},
    ans_by : {type: String, required: true},
    ans_date_time : {type: Date, required: true},
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    upVotes:[{type: String, required: true}],
    downVotes:[{type: String, required: true}],
},
  { collection: "Answer",
    toJSON: { 
      virtuals: true,
      transform: (doc, ret) => {
        ret._id = ret._id.toString(); // convert ObjectId to string
        delete ret.__v;
        return ret;
      }
    }
   }
);

/**
 * Returns the most recent answers based on the answer date and time.
 * 
 * @param {Array<mongoose.Types.ObjectId>} answers - The array of answers to search through.
 * @returns {Promise<IAnswerDocument[]>} The most recent answers based on the `ans_date_time` property.
 */
AnswerSchema.statics.getMostRecent = async function (answers: mongoose.Types.ObjectId[]): Promise<IAnswerDocument[]> {
  return await this.find({ _id: { $in: answers } }).sort({ ans_date_time: -1 }).exec();
}

/**
   * Finds the latest answer from an array of answers based on the answer date and time.
   *
   * @param {Array<IAnswerDB | object>} answers - The array of answers to search through.
   * @returns {Date | undefined} The latest answer based on the `ans_date_time` property.
   */
AnswerSchema.statics.getLatestAnswerDate = async function(answers: Array<IAnswerDB | object>) : Promise<Date | undefined> {
  if (answers.length === 0) {
    return undefined;
  }
  const latestAnswer = answers.reduce((latest, current) => {
    return (latest as IAnswerDB).ans_date_time > (current as IAnswerDB).ans_date_time ? latest : current;
  });
  return (latestAnswer as IAnswerDB).ans_date_time;
}

AnswerSchema.statics.findByIdAndAddComment = async function(
  id: mongoose.Types.ObjectId,
  commentId: mongoose.Types.ObjectId
): Promise<IAnswerDocument | null> {
  return this.findByIdAndUpdate(
    id,
    { $push: { comments: commentId } },
    { new: true }
  );
};

AnswerSchema.statics.findByIdAndAddUpvote = async function(
  id: mongoose.Types.ObjectId,
  userId: string
): Promise<IAnswerDocument | null> {
  const answer = await this.findById(id);
  if (!answer) return null;

  const userStr = userId;
  const upSet = new Set(answer.upVotes);
  const downSet = new Set(answer.downVotes);

  if (upSet.has(userStr)) {
    upSet.delete(userStr);
  } else {
    downSet.delete(userStr);
    upSet.add(userStr);
  }

  answer.set('upVotes', Array.from(upSet));
  answer.set('downVotes', Array.from(downSet));

  await answer.save();
  return answer;
};

AnswerSchema.statics.findByIdAndAddDownvote = async function(
  id: mongoose.Types.ObjectId,
  userId: string
): Promise<IAnswerDocument | null> {
  const answer = await this.findById(id);
  if (!answer) return null;

  const userStr = userId;
  const upSet = new Set(answer.upVotes);
  const downSet = new Set(answer.downVotes);

  if (downSet.has(userStr)) {
    downSet.delete(userStr);
  } else {
    upSet.delete(userStr);
    downSet.add(userStr);
  }

  answer.set('upVotes', Array.from(upSet));
  answer.set('downVotes', Array.from(downSet));

  await answer.save();
  return answer;
};

export default AnswerSchema;
