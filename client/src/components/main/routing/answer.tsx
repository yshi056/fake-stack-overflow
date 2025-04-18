import React from "react";
import PageClass, { PageClassProps } from ".";
import AnswerPage from "../answerPage/answerPageView";
import { VoidFunctionType } from "../../../types/functionTypes";

// The type definition for the constructor parameter.
interface AnswerPageClassProps
  extends Omit<PageClassProps, "handleNewQuestion" | "handleNewAnswer"> {
  qid: string;
  handleNewQuestion: VoidFunctionType;
  handleNewAnswer: VoidFunctionType;
}

/**
 * The class represents the answer page for a question.
 */
export default class AnswerPageClass extends PageClass {
  qid: string;
  handleNewQuestion: VoidFunctionType;
  handleNewAnswer: VoidFunctionType;

  /**
   * The constructor for the class set the question id, 
   * and the functions to render newly created questions and answers.
   * @param props The properties of the class.
   */
  constructor(props: AnswerPageClassProps) {
    super({
      search: props.search,
      title: props.title,
      setQuestionPage: props.setQuestionPage,
      questionOrder: props.questionOrder,
      setQuestionOrder: props.setQuestionOrder,
      qid: props.qid,
      handleQuestions: props.handleQuestions,
      handleTags: props.handleTags,
      handleAnswer: props.handleAnswer,
      clickTag: props.clickTag,
      handleNewQuestion: props.handleNewQuestion,
      handleNewAnswer: props.handleNewAnswer,
    });

    this.qid = props.qid;
    this.handleNewQuestion = props.handleNewQuestion;
    this.handleNewAnswer = props.handleNewAnswer;
  }

  getContent(): React.ReactNode {
    return (
      <AnswerPage
        qid={this.qid}
        handleNewQuestion={this.handleNewQuestion}
        handleNewAnswer={this.handleNewAnswer}
      />
    );
  }

  getSelected(): string {
    return "";
  }
}
