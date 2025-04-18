import "./tagView.css";
import { ClickTagFunctionType } from "../../../../types/functionTypes";

// The type definition for the props of the Tag component
interface TagProps {
  t: {
    name: string;
    qcnt: number;
  };
  clickTag: ClickTagFunctionType;
}

/**
 * The component that renders a single tag in the tags page.
 * Each tag has a name and the number of questions associated with it.
 * Each tag is clickable and will render the questions associated with it.
 * @param props containing the tag and the function to render the questions of a tag 
 * @returns the Tag component
 */
const Tag = ({ t, clickTag }: TagProps) => {
  return (
    <div
      className="tagNode"
      onClick={() => {
        clickTag(t.name);
      }}
    >
      <div className="tagName">{t.name}</div>
      <div>{t.qcnt} questions</div>
    </div>
  );
};

export default Tag;
