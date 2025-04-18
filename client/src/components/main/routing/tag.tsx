import React from "react";
import PageClass from ".";
import TagPage from "../tagPage/tagPageView";

/**
 * TagPageClass is a class that extends PageClass and returns the TagPage component.
 */
export default class TagPageClass extends PageClass {
  getContent(): React.ReactNode {
    return (
      <TagPage
        clickTag={this.clickTag}
        handleNewQuestion={this.handleNewQuestion}
      />
    );
  }

  getSelected(): string {
    return "t";
  }
}
