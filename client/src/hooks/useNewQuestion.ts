import { useState } from "react";
import { addQuestion } from "../services/questionService";
import { VoidFunctionType } from "../types/functionTypes";
import { QuestionType } from "../types/entityTypes"; // Import the QuestionType interface

/**
 * A custom hook to handle the state and logic for adding a new question.
 * It creates a new question after validating the input fields and renders the new question on the home page.
 * Updated to work with JWT authentication - no longer requires username input.
 * @param handleQuestions the function to render the new question on the home page
 * @returns the state and logic required to add a new question
 */
export const useNewQuestion = (handleQuestions: VoidFunctionType) => {
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [titleErr, setTitleErr] = useState<string>("");
  const [textErr, setTextErr] = useState<string>("");
  const [tagErr, setTagErr] = useState<string>("");

  /**
   * Validates the title field
   * @returns true if the title is valid, false otherwise
   */
  const validateTitle = (): boolean => {
    if (!title) {
      setTitleErr("Title cannot be empty");
      return false;
    } else if (title.length > 100) {
      setTitleErr("Title cannot be more than 100 characters");
      return false;
    } else {
      setTitleErr("");
      return true;
    }
  };

  /**
   * Validates the text field
   * @returns true if the text is valid, false otherwise
   */
  const validateText = (): boolean => {
    if (!text) {
      setTextErr("Question text cannot be empty");
      return false;
    } else {
      setTextErr("");
      return true;
    }
  };

  /**
   * Validates the tag field
   * @returns true if the tags are valid, false otherwise
   */
  const validateTags = (): boolean => {
    const tags = tag.split(" ").filter((tag) => tag.trim() !== "");
    if (tags.length === 0) {
      setTagErr("Should have at least one tag");
      return false;
    } else if (tags.length > 5) {
      setTagErr("More than five tags is not allowed");
      return false;
    } else {
      for (const tag of tags) {
        if (tag.length > 20) {
          setTagErr("New tag length cannot be more than 20");
          return false;
        }
      }
      setTagErr("");
      return true;
    }
  };

  /**
   * Validates all the fields in the form
   * @returns true if all fields are valid, false otherwise
   */
  const validateFields = (): boolean => {
    const isTitleValid = validateTitle();
    const isTextValid = validateText();
    const isTagsValid = validateTags();
    return isTitleValid && isTextValid && isTagsValid;
  };

  /**
   * Posts a new question to the server
   * Uses JWT authentication - username is determined from the JWT token on the server
   */
  const postQuestion = async () => {
    if (!validateFields()) {
      return;
    }

    const tags = tag.split(" ").filter((tag) => tag.trim() !== "");
    const tagObjects = tags.map((tag) => ({ name: tag }));
    
    // Include a temporary asked_by value to satisfy TypeScript
    // This will be overridden by the server based on JWT token
    const question: QuestionType = {
      title: title,
      text: text,
      tags: tagObjects,
      asked_by: "JWT_USER", // This will be replaced by the server
      ask_date_time: new Date(),
    };

    try {
      // The addQuestion service function should be updated to include credentials
      const res = await addQuestion(question);
      if (res && res._id) {
        // Reset form fields on success
        setTitle("");
        setText("");
        setTag("");
        handleQuestions();
      }
    } catch (error) {
      console.error("Error posting question:", error);
      // You might want to handle errors more specifically here based on your app's needs
    }
  };

  return {
    title,
    setTitle,
    text,
    setText,
    tag,
    setTag,
    titleErr,
    textErr,
    tagErr,
    postQuestion,
  };
};