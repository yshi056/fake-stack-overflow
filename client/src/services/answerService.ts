/**
 * This module defines the functions to interact with the REST APIs for the answers service.
 */

import { REACT_APP_API_URL, api } from "./config";
import { AnswerType, AnswerResponseType } from "../types/entityTypes";

// The base URL for the answers API
const ANSWER_API_URL = `${REACT_APP_API_URL}/answer`;

/**
 * The function calls the API to add a new answer for a question,
 * returns the response data if the status is 200, otherwise throws an error.
 * @param qid the id of the question for which the answer is being added.
 * @param ans the answer object to be added.
 * @returns the response data from the API, which contains the answer object added.
 */
const addAnswer = async (
  qid: string,
  ans: AnswerType
): Promise<AnswerResponseType> => {
  const data = { qid: qid, ans: ans };
  try {
    const res = await api.post(`${ANSWER_API_URL}/addAnswer`, data, { withCredentials: true});
    if (res.status !== 200) {
      throw new Error("Error while creating a new answer");
    }
    return res.data;
  } catch (error) {
    console.error("Error adding answer:", error);
    throw error;
  }
};

export { addAnswer };
