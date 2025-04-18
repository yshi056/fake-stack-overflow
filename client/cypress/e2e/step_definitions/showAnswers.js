import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";


const Q1_TITLE = "Programmatically navigate using React router";
const Q2_TITLE = "android studio save string shared preference, start activity and load the saved string";
const Q3_TITLE = "Quick question about storage on android";
const Q4_TITLE = "Object storage for a web application";
const Q5_TITLE = "Test Question A";

const A3_TXT =
  "Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.";
const A4_TXT =
  "YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);";
const A5_TXT =
  "I just found all the above examples just too confusing, so I wrote my own.";
const A6_TXT = "This is a test answer.";

function createAnswer(username, text) {
    cy.contains("Answer Question").click();
    cy.get("#answerUsernameInput").type(username);
    cy.get("#answerTextInput").type(text);
    cy.contains("Post Answer").click();
}

function verifyAnswerOrder() {
    const answerOrder = [
        A3_TXT,
        A4_TXT,
        A5_TXT
    ];
    cy.get(".answerText").each(($el, index, $list) => {
        cy.wrap($el).should("contain", answerOrder[index]);
    });
}  

function verifyNewAnswerOrder() {
    const answerOrderNew = [
        A6_TXT,
        A3_TXT,
        A4_TXT,
        A5_TXT
    ];
    cy.get(".answerText").each(($el, index, $list) => {
        cy.wrap($el).should("contain", answerOrderNew[index]);
    });
}  

// Scenario: Show answers in most recent order
// Given The user can access the homepage "http://localhost:3000"
// And can see the homepage "All Questions"
// When the user clicks on a question title
// Then the user should see the answers in the most recent order

Given('The user can access the homepage {string}', (url) => {
    cy.visit(url);
}
);

And('can see the homepage {string}', (pageName) => {
    cy.contains(pageName);
}
);  

When('the user clicks on a question title', () => {
    cy.contains(Q2_TITLE).click();
}
);

Then('the user should see the answers in the most recent order', () => {
    cy.contains(Q2_TITLE);
    verifyAnswerOrder();
}
);


// Scenario: Show answers in most recent order after posting a new answer
// Given The user can access the homepage "http://localhost:3000"
// And can see the homepage "All Questions"
// When the user clicks on a question title
// And the user posts a new answer
// Then the user should see the answers in the most recent order

Given('The user can access the homepage {string}', (url) => {
    cy.visit(url);
}
);

And('can see the homepage {string}', (pageName) => {
    cy.contains(pageName);
}
);  

When('the user clicks on a question title', () => {
    cy.contains(Q2_TITLE).click();
}
);

And('the user posts a new answer', () => {
    createAnswer("TestUser", A6_TXT);
}
);

Then('the user should see the answers with the new answer in the most recent order', () => {
    cy.contains(Q2_TITLE);
    verifyNewAnswerOrder();
}
);
