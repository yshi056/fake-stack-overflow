import "./inputView.css";
import { StringFunctionType } from "../../../../types/functionTypes";

// The type of the props of the Input component
interface InputProps {
  title: string;
  hint?: string;
  id: string;
  mandatory?: boolean;
  val: string;
  setState: StringFunctionType;
  err?: string;
  type?: string;
}

// A generic reusble component for the input field of a form.
const Input = ({
  title,
  hint,
  id,
  mandatory = true,
  val,
  setState,
  err,
  type = "text",
}: InputProps) => {
  return (
    <>
      <div className="input_title">
        {title}
        {mandatory ? "*" : ""}
      </div>
      {hint && <div className="input_hint">{hint}</div>}
      <input
        id={id}
        className="input_input"
        type={type}
        value={val}
        onInput={(e) => {
          setState(e.currentTarget.value);
        }}
      />
      {err && <div className="input_error">{err}</div>}
    </>
  );
};

export default Input;
