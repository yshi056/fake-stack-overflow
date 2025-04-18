import React, { ReactNode } from "react";
import "./formView.css";

// The type definition for the props of the Form component
interface FormProps {
  children: ReactNode;
}

// A higher order component for form elements
const Form: React.FC<FormProps> = ({ children }) => {
  return <div className="form">{children}</div>;
};

export default Form;
