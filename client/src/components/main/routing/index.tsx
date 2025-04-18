import {
  PageSetterFunctionType,
  ClickTagFunctionType,
  IdFunctionType,
  VoidFunctionType,
  OrderFunctionType,
} from "../../../types/functionTypes";

// The type definitions for the input object of the PageClass constructor
export interface PageClassProps {
  search: string;
  title: string;
  setQuestionPage: PageSetterFunctionType;
  questionOrder: string;
  setQuestionOrder: OrderFunctionType;
  qid: string;
  handleQuestions: VoidFunctionType;
  handleTags: VoidFunctionType;
  handleAnswer: IdFunctionType;
  clickTag: ClickTagFunctionType;
  handleNewQuestion: VoidFunctionType;
  handleNewAnswer: VoidFunctionType;
}

/**
 * The base class for all pages that will be rendered in Main component.
 * This class is extended by all other page classes.
 * 
 * All child classes must implement the getContent() method.
 * Pages that need to control the selected tab must implement the getSelected() method.
 * 
 */
class PageClass {
  search: string; // The search query string
  title: string;  // The title of the page
  setQuestionPage: PageSetterFunctionType; // The function to set current page with list of questions based on a filter
  questionOrder: string;  // the order of the questions
  setQuestionOrder: OrderFunctionType;  // the function to set the order of the questions
  qid: string;  // the id of a question
  handleQuestions: VoidFunctionType;  // the function to render the list of questions
  handleTags: VoidFunctionType; // the function to render the list of tags
  handleAnswer: IdFunctionType; // the function to render the answers page of a question
  clickTag: ClickTagFunctionType; // the function to handle the click event on a tag
  handleNewQuestion: VoidFunctionType;  // the function to handle the creation of a new question
  handleNewAnswer: VoidFunctionType;  // the function to handle the creation of a new answer

  constructor(props: PageClassProps) {
    this.search = props.search;
    this.title = props.title;
    this.setQuestionPage = props.setQuestionPage;
    this.questionOrder = props.questionOrder;
    this.setQuestionOrder = props.setQuestionOrder;
    this.qid = props.qid;
    this.handleQuestions = props.handleQuestions;
    this.handleTags = props.handleTags;
    this.handleAnswer = props.handleAnswer;
    this.clickTag = props.clickTag;
    this.handleNewQuestion = props.handleNewQuestion;
    this.handleNewAnswer = props.handleNewAnswer;
  }

  getContent(): React.ReactNode {
    return null;
  }

  getSelected(): string {
    return "";
  }
}

export default PageClass;
