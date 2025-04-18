/**
 * The module defines the functions to interact with the REST APIs for the tags service.
 */

import { REACT_APP_API_URL, api } from "./config";
import { TagResponseType } from "../types/entityTypes";

// The base URL for the tags API
const TAG_API_URL = `${REACT_APP_API_URL}/tag`;

/**
 * The function calls the API to get tags with the number of questions associated with each tag,
 * returns the response data if the status is 200, otherwise throws an error.
 * @returns the response data from the API, which contains the list of tags with the number of questions.
 */
const getTagsWithQuestionNumber = async (): Promise<TagResponseType[]> => {
  try {
    const res = await api.get(`${TAG_API_URL}/getTagsWithQuestionNumber`);
    if (res.status !== 200) {
      throw new Error("Error when fetching tags with question number");
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw error;
  }
};

export { getTagsWithQuestionNumber };
