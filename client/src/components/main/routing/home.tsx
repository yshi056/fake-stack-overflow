import React from "react";
import PageClass from ".";
import QuestionPage from "../questionPage/questionPageView";

/**
 * The class renders the QuestionPage component.
 * The component is used to display the questions in the application
 * based on a specific order and the search query.
 */
export default class HomePageClass extends PageClass {
  getContent(): React.ReactNode {
    return (
      <QuestionPage
        title_text={this.title}
        order={this.questionOrder.toLowerCase()}
        search={this.search}
        setQuestionOrder={this.setQuestionOrder}
        clickTag={this.clickTag}
        handleAnswer={this.handleAnswer}
        handleNewQuestion={this.handleNewQuestion}
      />
    );
  }

  // The tab questions tab in the sidebar must be selected
  getSelected(): string {
    return "q";
  }
}
