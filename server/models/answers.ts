import mongoose from "mongoose";
import { IAnswerModel, IAnswerDocument } from "../types/types";
import AnswerSchema from "./schema/answer";

const Answer = mongoose.model<IAnswerDocument, IAnswerModel>(
  "Answer",
  AnswerSchema
);

export default Answer;
