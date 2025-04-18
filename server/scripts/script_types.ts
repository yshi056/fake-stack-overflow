import mongoose from "mongoose";

/**
 * The types in this file are used to define the shape of the documents
 * in the database. These types are used to define the schema of a document
 * in the questions, answers, and tags collections.
 * 
 * They are similar to the types defined in types.ts, but the id field is
 * explicitly defined to have the type mongoose.Types.ObjectId, which is
 * the type of the _id field used by Mongoose in a MongoDB document.
 * 
 * These types are used only the scripts used to populate the database with
 * test data.
 */

export interface ICommentDB {
  _id?: mongoose.Types.ObjectId;
  text: string;
  user: string;
  comment_date_time: Date;
}

export interface IUserDB {
  _id?: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  questions: (IQuestionDB | mongoose.Types.ObjectId)[];
  answers: (IAnswerDB | mongoose.Types.ObjectId)[];
  comments: (ICommentDB | mongoose.Types.ObjectId)[];
}

export interface IAnswerDB {
  _id?: mongoose.Types.ObjectId;
  qid: mongoose.Types.ObjectId;
  text: string;
  ans_by: string;
  ans_date_time: Date;
  comments: (ICommentDB | mongoose.Types.ObjectId)[];
  upVotes: string[];
  downVotes: string[];
}

export interface IQuestionDB {
  _id?: mongoose.Types.ObjectId;
  title: string;
  text: string;
  tags: ITagDB[];
  answers: (IAnswerDB | mongoose.Types.ObjectId)[];
  asked_by?: string;
  ask_date_time: Date;
  views: number;
}

export interface ITagDB {
  _id?: mongoose.Types.ObjectId;
  name: string;
}
