import "./questionBodyView.css";

// The type definition for the props of the QuestionBody component
interface QuestionBodyProps {
  views: number;
  text: string;
  askby: string;
  meta: string;
}

/**
 * The component renders the meta data of the question displaying all answers of a question.
 * @param props containing the views, text, askby and meta data of the question 
 * @returns the question body component
 */
const QuestionBody = ({ views, text, askby, meta }: QuestionBodyProps) => {
  return (
    <div id="questionBody" className="questionBody right_padding">
      <div className="bold_title answer_question_view">{views} views</div>
      <div className="answer_question_text">{text}</div>
      <div className="answer_question_right">
        <div className="question_author">{askby}</div>
        <div className="answer_question_meta">asked {meta}</div>
      </div>
    </div>
  );
};

export default QuestionBody;
