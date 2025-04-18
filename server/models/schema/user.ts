import mongoose from "mongoose";
import { IAnswer, IComment, IQuestion, IUser, IQuestionDocument, IUserDocument, ICommentDocument, IAnswerDocument, IUserModel } from "../../types/types";
import { convertToIQuestion, convertToIAnswer, convertToIComment } from "./question";
//import Answer from "../answers";
//import Question from "../questions";

/**
 * The schema for a document in the Tags collection.
 * 
 * The schema is created using the constructor in mongoose.Schema class.
 * The schema is defined with two generic parameters: ITagDocument and ITagModel.
 * ITagDocument is used to define the instance methods of the Tag document.
 * ITagModel is used to define the static methods of the Tag model.
 */

const UserSchema = new mongoose.Schema<IUserDocument, IUserModel>(
  {
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }]
  },
  { collection: "User" }
);

UserSchema.methods.addQuestion = async function (
  this: IUserDocument,
  questionId: mongoose.Types.ObjectId
): Promise<IUserDocument> {
  this.questions.push(questionId);
  await this.save();
  return this;
};

UserSchema.methods.addAnswer = async function (
  this: IUserDocument,
  answerId: mongoose.Types.ObjectId
): Promise<IUserDocument> {
  this.answers.push(answerId);
  await this.save();
  return this;
};

UserSchema.methods.addComment = async function (
  this: IUserDocument,
  commentId: mongoose.Types.ObjectId
): Promise<IUserDocument> {
  this.comments.push(commentId);
  await this.save();
  return this;
};


UserSchema.statics.getProfileById = async function (userId: mongoose.Types.ObjectId): Promise<IUser | null> {
  const user = await this.findById(userId).populate("questions").populate("answers").populate("comments");
  if (!user) {
    return null;
  }

  return {
    _id: user._id.toString(),
    username: user.username,
    email: user.email,
    password: user.password,
    questions: user.questions.map(question => {
      if (question instanceof mongoose.Types.ObjectId) {
        //const answerDoc = Answer.findById(answer).exec();
        return { _id: question.toString() } as IQuestion; // Assuming minimal IAnswer structure
      } else {
        return convertToIQuestion(question as IQuestionDocument);
      }
    }),
    answers: user.answers.map(answer => {
          if (answer instanceof mongoose.Types.ObjectId) {
            //const answerDoc = Answer.findById(answer).exec();
            return { _id: answer.toString() } as IAnswer; // Assuming minimal IAnswer structure
          } else {
            return convertToIAnswer(answer as IAnswerDocument);
          }
        }),
    comments: user.comments.map(comment => {
        if (comment instanceof mongoose.Types.ObjectId) {
          //const answerDoc = Answer.findById(answer).exec();
          return { _id: comment.toString() } as IComment; // Assuming minimal IAnswer structure
        } else {
          return convertToIComment(comment as ICommentDocument);
        }}),
  };
};

UserSchema.methods.getQuestions = async function (
): Promise<IQuestion[]> {
  await this.populate("questions");
  return this.questions.map(convertToIQuestion);
};

UserSchema.methods.getAnswers = async function (
): Promise<IAnswer[]> {
  await this.populate("answers");
  return this.answers.map(convertToIAnswer);
};

UserSchema.methods.getComments = async function (
): Promise<IComment[]> {
  await this.populate("comments");
  return this.comments as IComment[];
};

//static method implementations for IUserModel
UserSchema.statics.findByUsername = async function (
  username: string
): Promise<IUserDocument | null> {
  return this.findOne({ username });
};

UserSchema.statics.findByEmail = async function (
  email: string
): Promise<IUserDocument | null> {
  return this.findOne({ email });
};

UserSchema.statics.findByIdAndAddQuestion = async function (
  id: mongoose.Types.ObjectId,
  questionId: mongoose.Types.ObjectId
): Promise<IUserDocument | null> {
  const user = await this.findById(id);
  if (!user) return null;
  await user.addQuestion(questionId);
  return user;
};

UserSchema.statics.findByIdAndAddAnswer = async function (
  id: mongoose.Types.ObjectId,
  answerId: mongoose.Types.ObjectId
): Promise<IUserDocument | null> {
  const user = await this.findById(id);
  if (!user) return null;
  await user.addAnswer(answerId);
  return user;
};

UserSchema.statics.findByIdAndAddComment = async function (
  id: mongoose.Types.ObjectId,
  commentId: mongoose.Types.ObjectId
): Promise<IUserDocument | null> {
  const user = await this.findById(id);
  if (!user) return null;
  await user.addComment(commentId);
  return user;
};

export default UserSchema;