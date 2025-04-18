import React from "react";
import PageClass from ".";
import NewQuestion from "../newQuestion/newQuestionView";

/**
 * Class for the New Question Page
 * The New Question Page is a page where the user can create a new question
 */
export default class NewQuestionPageClass extends PageClass {
  getContent(): React.ReactNode {
    return <NewQuestion handleQuestions={this.handleQuestions} />;
  }

  getSelected(): string {
    return "";
  }
}
