// Run this script to test your schema
// Start the mongoDB service as a background process before running the script
// Pass URL of your mongoDB instance as first argument(e.g., mongodb://127.0.0.1:27017/fake_so)

import mongoose from "mongoose";

import Answer from "../models/answers";
import Question from "../models/questions";
import Tag from "../models/tags";
import { ITagDB, IAnswerDB, IQuestionDB, ICommentDB } from "./script_types";
import {
  Q1_DESC,
  Q1_TXT,
  Q2_DESC,
  Q2_TXT,
  Q3_DESC,
  Q3_TXT,
  Q4_DESC,
  Q4_TXT,
  A1_TXT,
  A2_TXT,
  A3_TXT,
  A4_TXT,
  A5_TXT,
  A6_TXT,
  A7_TXT,
  A8_TXT,
} from "../data/posts_strings";

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

// Check if user has passed a valid MongoDB URL
if (!userArgs[0].startsWith("mongodb")) {
  console.log(
    "ERROR: You need to specify a valid MongoDB URL as the first argument"
  );
  process.exit(1);
}

// Connect to the MongoDB instance with the URL passed as argument
const mongoDB = userArgs[0];

mongoose.connect(mongoDB);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

/**
 * an asynchronous function to create a tag in the Tags collection of the database
 * @param name tag name
 * @returns a promise that resolves to the tag object created in the database
 */
async function tagCreate(name: string): Promise<ITagDB> {
   const tagDoc = await new Tag({ name }).save();
  
   const tagDB: ITagDB = {
     _id: new mongoose.Types.ObjectId(tagDoc._id),
     name: tagDoc.name
   };
   
   return tagDB;
}

/**
 * an asynchronous function to create an answer in the Answers collection of the database
 * @param text answer text
 * @param ans_by username of the user who answered the question
 * @param ans_date_time date and time when the answer was posted
 * @returns a promise that resolves to the answer object created in the database
 */
function answerCreate(
  text: string,
  ans_by: string,
  ans_date_time: Date
): Promise<IAnswerDB> {
  const answerDetail: IAnswerDB = {
    text,
    ans_by,
    ans_date_time,
    comments: [],
    upVotes: [],
    downVotes: []
  };

  const answer = new Answer(answerDetail);
  return answer.save();
}

/**
 * an asynchronous function to create a question in the Questions collection of the database
 * @param title question title
 * @param text question text
 * @param tags an array of tag objects
 * @param answers an array of answer objects
 * @param asked_by username of the user who asked the question
 * @param ask_date_time date and time when the question was posted
 * @param views number of views on the question
 * @returns a promise that resolves to the question object created in the database
 */
function questionCreate(
  title: string,
  text: string,
  tags: ITagDB[],
  answers: IAnswerDB[],
  asked_by: string,
  ask_date_time: Date,
  views: number
): Promise<IQuestionDB> {
  const qstnDetail: IQuestionDB = {
    title,
    text,
    tags,
    answers,
    asked_by,
    ask_date_time,
    views,
  };
  if (ask_date_time) qstnDetail.ask_date_time = ask_date_time;
  if (views) qstnDetail.views = views;

  const qstn = new Question(qstnDetail);
  return qstn.save();
}

/**
 * an asynchronous function to populate the database with tags, answers, and questions
 */
const populate = async () => {
  try {
    const t1 = await tagCreate("react");
    const t2 = await tagCreate("javascript");
    const t3 = await tagCreate("android-studio");
    const t4 = await tagCreate("shared-preferences");
    const t5 = await tagCreate("storage");
    const t6 = await tagCreate("website");

    const a1 = await answerCreate(
      A1_TXT,
      "hamkalo",
      new Date("2023-11-20T03:24:42")
    );
    const a2 = await answerCreate(
      A2_TXT,
      "azad",
      new Date("2023-11-23T08:24:00")
    );
    const a3 = await answerCreate(
      A3_TXT,
      "abaya",
      new Date("2023-11-18T09:24:00")
    );
    const a4 = await answerCreate(
      A4_TXT,
      "alia",
      new Date("2023-11-12T03:30:00")
    );
    const a5 = await answerCreate(
      A5_TXT,
      "sana",
      new Date("2023-11-01T15:24:19")
    );
    const a6 = await answerCreate(
      A6_TXT,
      "abhi3241",
      new Date("2023-02-19T18:20:59")
    );
    const a7 = await answerCreate(
      A7_TXT,
      "mackson3332",
      new Date("2023-02-22T17:19:00")
    );
    const a8 = await answerCreate(
      A8_TXT,
      "ihba001",
      new Date("2023-03-22T21:17:53")
    );

    await questionCreate(
      Q1_DESC,
      Q1_TXT,
      [t1, t2],
      [a1, a2],
      "Joji John",
      new Date("2022-01-20T03:00:00"),
      10
    );
    await questionCreate(
      Q2_DESC,
      Q2_TXT,
      [t3, t4, t2],
      [a3, a4, a5],
      "saltyPeter",
      new Date("2023-01-10T11:24:30"),
      121
    );
    await questionCreate(
      Q3_DESC,
      Q3_TXT,
      [t5, t6],
      [a6, a7],
      "monkeyABC",
      new Date("2023-02-18T01:02:15"),
      200
    );
    await questionCreate(
      Q4_DESC,
      Q4_TXT,
      [t3, t4, t5],
      [a8],
      "elephantCDE",
      new Date("2023-03-10T14:28:01"),
      103
    );

    console.log("done");
  } catch (err) {
    console.error("ERROR:", err);
  } finally {
    db.close();
  }
};

populate();

console.log("processing ...");
