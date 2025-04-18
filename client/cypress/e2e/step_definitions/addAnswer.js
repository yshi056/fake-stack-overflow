import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";

const Q1_TITLE = "Programmatically navigate using React router";

const newAnswer = {
    text: "Try refer to the documentation for the database you are using. It should have instructions on how to add a question.",
    user: "AmazingOn"
}

function fillForm(a) {
    if(a.text)
        cy.get("#answerTextInput").type(a.text);
    if(a.user)
        cy.get("#answerUsernameInput").type(a.user);
}
function verifyNewAnswer() {
    cy.contains(Q1_TITLE);
    cy.get(".answerText").first().should("contain", newAnswer.text);
    cy.get(".answer_author").first().should("contain", newAnswer.user);
    cy.get(".answer_question_meta").eq(1).should("contain", "0 seconds");
}

// Scenario: Add a new answer successfully
// Given The user has write access to the application "http://localhost:3000"
// When the user is viewing an answer page
// And clicks the "Answer Question" button
// And fills out the necessary fields
// And clicks the "Post Answer" button
// Then The user should see the new answer at the top of the question page with the metadata information

Given('The user has write access to the application {string}', (url) => {
    cy.visit(url);
}
);
When('the user is viewing an answer page', () => {
    cy.contains("All Questions").click();
    cy.contains(Q1_TITLE).click();
}
);
When('the user clicks the {string} button', (buttonName) => {
    cy.contains(buttonName).click();
}
);
And('fills out the necessary fields', () => {
    fillForm(newAnswer);
}
);
And('clicks the {string} button', (buttonName) => { 
    cy.contains(buttonName).click();
}
);
Then('The user should see the new answer at the top of the question page with the metadata information', () => {
    verifyNewAnswer();
}
);

// Scenario Outline: Add a new answer with a missing field
// Given The user has write access to the application "http://localhost:3000"
// When the user is viewing an answer page
// And clicks the "Answer Question" button
// And fills out the necessary fields except "<missingField>"
// And clicks the "Post Answer" button
// Then The user should see an error message "<errorMessage>"
// And The user should see the "Post Answer" button

Given('The user has write access to the application {string}', (url) => {
    cy.visit(url);
}
);
When('the user is viewing an answer page', () => {
    cy.contains("All Questions").click();
    cy.contains(Q1_TITLE).click();
}
);
And('fills out the necessary fields except {string}', (missingField) => {
    let a = {...newAnswer, [missingField]: ""};
    fillForm(a);
}
);
And('clicks the {string} button', (buttonName) => {
    cy.contains(buttonName).click();
}
);
Then('The user should see an error message {string}', (errorMessage) => {
    cy.contains(errorMessage);
}
);
And('The user should see the {string} button', (buttonName) => {
    cy.contains(buttonName);
}
);