import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";


const Q1_TITLE = "Programmatically navigate using React router";
const Q2_TITLE = "android studio save string shared preference, start activity and load the saved string";
const Q3_TITLE = "Quick question about storage on android";
const Q4_TITLE = "Object storage for a web application";
const Q5_TITLE = "Test Question A";
const Q6_TITLE = "Test Question B";

function verifyUnansweredOrder() {
    // should get no title
    cy.get(".postTitle").should('not.exist');
}

function verifyUnansweredOrderNew() {
    const qTitleByActivity = [
        Q6_TITLE,
        Q5_TITLE
    ];
    cy.get(".postTitle").each(($el, index, $list) => {
        cy.wrap($el).should("contain", qTitleByActivity[index]);
    });
}

function createQuestion(title, text, tag, username) {
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type(title);
    cy.get("#formTextInput").type(text);
    cy.get("#formTagInput").type(tag);
    cy.get("#formUsernameInput").type(username);
    cy.contains("Post Question").click();
}

function createAnswer(qtitle, username, text) {
    cy.contains(qtitle).click();
    cy.contains("Answer Question").click();
    cy.get("#answerUsernameInput").type(username);
    cy.get("#answerTextInput").type(text);
    cy.contains("Post Answer").click();
}

// Scenario: Show all unanswered questions in newest order on user request
// Given The user can access the homepage "http://localhost:3000"
// And can see the homepage "All Questions"
// When The user clicks on the "Unanswered" tab
// Then The user should see all unanswered questions in the database in newest order

Given('The user can access the homepage {string}', (url) => {
    cy.visit(url);
}
); 

And('can see the homepage {string}', (pageName) => {
    cy.contains(pageName);
}  
);

When('The user clicks on the {string} tab', (orderName) => {
    cy.contains(orderName).click();
}
);

Then('The user should see all unanswered questions in the database in newest order', () => {
    verifyUnansweredOrder();
}
);



// Scenario Outline: Return to the Unanswered tab after viewing questions in another order
// Given The user is viewing questions in "<currentOrder>"
// When The user clicks on the "Unanswered" order
// Then The user should see all unanswered questions in the database in newest order

Given('The user is viewing questions in {string}', (currentOrder) => {
    cy.visit("http://localhost:3000");
    cy.contains(currentOrder).click();
}
);

When('The user clicks on the {string} order', (orderName) => {
    cy.contains(orderName).click();
}
);

Then('The user should see all unanswered questions in the database in newest order', () => {
    verifyUnansweredOrder();
}
);

// Scenario: Return to Unanswered after viewing Tags
// Given The user is viewing the homepage "http://localhost:3000"
// When The user clicks on the "Tags" menu item
// And clicks on the "Questions" menu item
// And clicks on the "Unanswered" tab
// Then The user should see all unanswered questions in the database in newest order

Given('The user is viewing the homepage {string}', (url) => {
    cy.visit(url);
}
);

When('The user clicks on the {string} menu item', (menuItem) => {
    cy.contains(menuItem).click();
}
); 

And('clicks on the {string} menu item', (menuItem) => {
    cy.contains(menuItem).click();
}
);

And('clicks on the {string} tab', (tabName) => {
    cy.contains(tabName).click();
}
);

Then('The user should see all unanswered questions in the database in newest order', () => {
    verifyUnansweredOrder();
}
);

// Scenario: View questions in Unanswered order after posting questions
// Given The user is viewing the homepage "http://localhost:3000"
// And The user has created a new question
// And has created another new question
// When The user clicks on the "Unanswered" tab in the "Questions" page
// Then The user should see the new questions in the database in newest order

Given('The user is viewing the homepage {string}', (url) => {
    cy.visit(url);
});

And('The user has created a new question', () => {
    createQuestion(Q5_TITLE, "Test Question A Text", "javascript", "mks1");
}); 

And('has created another new question', () => {
    createQuestion(Q6_TITLE, "Test Question B Text", "javascript", "mks1");
}
);

When('The user clicks on the {string} tab in the {string} page', (tabName, pageName) => {
    cy.contains(pageName).click();
    cy.contains(tabName).click();
});

Then('The user should see the new questions in the database in newest order', () => {
    verifyUnansweredOrderNew();
});

// Scenario: View questions in Unanswered order after answering questions
// Given The user is viewing the homepage "http://localhost:3000"
// And The user has created a new question
// And answers the new question
// When The user clicks on the "Unanswered" tab in the "Questions" page
// Then The user should not see the new question

Given('The user is viewing the homepage {string}', (url) => {
    cy.visit(url);
}
);

And('The user has created a new question', () => {
    createQuestion(Q5_TITLE, "Test Question A Text", "javascript", "mks1");
}
);

And('answers the new question', () => {
    createAnswer(Q5_TITLE, "abc3", "Answer Question A");
}
);

When('The user clicks on the {string} tab in the {string} page', (tabName, pageName) => {
    cy.contains(pageName).click();
    cy.contains(tabName).click();
}
);

Then('The user should not see the new question', () => {
    cy.get(".postTitle").should('not.exist');
}
);