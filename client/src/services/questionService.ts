/**
 * This module defines the functions to interact with the REST APIs for the questions service.
 */

import { REACT_APP_API_URL, api } from "./config";
import { QuestionType, QuestionResponseType } from "../types/entityTypes";

// The base URL for the questions API
const QUESTION_API_URL = `${REACT_APP_API_URL}/question`;

/**
 * The function calls the API to get questions based on the filter parameters.
 * returns the response data if the status is 200, otherwise throws an error.
 * @param order display order of the questions selected by the user. @default "newest"
 * @param search the search query entered by the user. @default ""
 * @returns the response data from the API, which contains the matched list of questions.
 */
const getQuestionsByFilter = async (
  order = "newest",
  search = ""
): Promise<QuestionResponseType[]> => {
  try {
    const res = await api.get(
      `${QUESTION_API_URL}/getQuestion?order=${order}&search=${search}`
    );
    if (res.status !== 200) {
      throw new Error("Error when fetching or filtering questions");
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

/**
 * The function calls the API to get a question by its id,
 * returns the response data if the status is 200, otherwise throws an error.
 * @param qid the id of the question to be fetched.
 * @returns the response data from the API, which contains the fetched question object.
 */
const getQuestionById = async (qid: string): Promise<QuestionResponseType> => {
  try {
    const res = await api.get(`${QUESTION_API_URL}/getQuestionById/${qid}`);
    if (res.status !== 200) {
      throw new Error("Error when fetching question by id");
    }
    return res.data;
  } catch (error) {
    console.error(`Error fetching question ${qid}:`, error);
    throw error;
  }
};

/**
 * The function calls the API to add a new question,
 * returns the response data if the status is 200, otherwise throws an error.
 * @param q the question object to be added.
 * @returns the response data from the API, which contains the question object added.
 */
const addQuestion = async (q: QuestionType): Promise<QuestionResponseType> => {
  try {
    const res = await api.post(`${QUESTION_API_URL}/addQuestion`, q, { withCredentials: true });
    if (res.status !== 200) {
      throw new Error("Error while creating a new question");
    }

    return res.data;
  } catch (error) {
    console.error("Error adding question:", error);
    throw error;
  }
};

export { getQuestionsByFilter, getQuestionById, addQuestion };
