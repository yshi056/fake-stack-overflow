import { useState } from "react";
import { addAnswer } from "../services/answerService";
import { AnswerType } from "../types/entityTypes"; // Import your AnswerType interface
import { QuestionIdFunctionType } from "../types/functionTypes";

/**
 * A custom hook to handle the state and logic for adding a new answer.
 * It creates a new answer after validating the input fields and renders the new answer on the question page.
 * Updated to work with JWT authentication - no longer requires username input.
 * @param qid The ID of the question being answered
 * @param handleAnswer The function to render the new answer on the question page
 * @returns The state and logic required to add a new answer
 */
export const useNewAnswer = (
  qid: string,
  handleAnswer: QuestionIdFunctionType
) => {
  const [text, setText] = useState<string>("");
  const [textErr, setTextErr] = useState<string>("");

  /**
   * Validates the text field
   * @returns true if the text is valid, false otherwise
   */
  const validateText = (): boolean => {
    if (!text) {
      setTextErr("Answer text cannot be empty");
      return false;
    } else {
      setTextErr("");
      return true;
    }
  };

  /**
   * Validates all the fields in the form
   * @returns true if all fields are valid, false otherwise
   */
  const validateFields = (): boolean => {
    return validateText();
  };

  /**
   * Posts a new answer to the server
   * Uses JWT authentication - username is determined from the JWT token on the server
   */
  const postAnswer = async () => {
    if (!validateFields()) {
      return;
    }

    try {
      // Include a temporary answered_by value to satisfy TypeScript
      // This will be overridden by the server based on JWT token
      const answer: AnswerType = {
        text: text,
        ans_by: "JWT_USER", // This will be replaced by the server
        ans_date_time: new Date(),
      };

      // The addAnswer service function should be updated to include credentials
      const res = await addAnswer(qid, answer);
      
      if (res && res._id) {
        // Reset form field on success
        setText("");
        // Call handleAnswer to update the UI
        handleAnswer(qid);
      }
    } catch (error) {
      console.error("Error posting answer:", error);
      // You might want to handle errors more specifically here
    }
  };

  return {
    text,
    setText,
    textErr,
    postAnswer,
  };
};

export default useNewAnswer;
