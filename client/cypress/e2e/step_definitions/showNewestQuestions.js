import { Given, When, Then, And} from "cypress-cucumber-preprocessor/steps";


const Q1_TITLE = "Programmatically navigate using React router";
const Q2_TITLE = "android studio save string shared preference, start activity and load the saved string";
const Q3_TITLE = "Quick question about storage on android";
const Q4_TITLE = "Object storage for a web application";
const Q5_TITLE = "Test Question A";
const Q6_TITLE = "Test Question B";

function verifyNewestOrder() {
    const qTitleByRecent = [
        Q3_TITLE,
        Q4_TITLE,
        Q2_TITLE,
        Q1_TITLE,
    ];
    cy.get(".postTitle").each(($el, index, $list) => {
        cy.wrap($el).should("contain", qTitleByRecent[index]);
    });
}

function verifyNewestOrder1() {
    const qTitleByRecent = [
        Q6_TITLE,
        Q5_TITLE,
        Q3_TITLE,
        Q4_TITLE,
        Q2_TITLE,
        Q1_TITLE,
    ];
    cy.get(".postTitle").each(($el, index, $list) => {
        cy.wrap($el).should("contain", qTitleByRecent[index]);
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


// Scenario: Show all questions in most recent order on user request
//     Given The user can access the homepage "http://localhost:3000"
//     And can see the homepage "All Questions"
//     When The user clicks on the "Newest" tab
//     Then The user should see all questions in the database with the most recently posted questions first

Given('The user can access the homepage {string}', (url) => {
    cy.visit(url);
});

And('can see the homepage {string}', (pageName) => {
    cy.contains(pageName);
});

When('The user clicks on the {string} tab', (orderName) => {
    cy.contains(orderName).click();
});

Then('The user should see all questions in the database with the most recently posted questions first', () => {
    verifyNewestOrder();
});

//   Scenario Outline: Return to the Newest tab after viewing questions in another order
//     Given The user is viewing questions in "<currentOrder>"
//     When The user clicks on the "Newest" order
//     Then The user should see all questions in the database with the most recently posted questions first

Given('The user is viewing questions in {string}', (currentOrder) => {
    cy.visit("http://localhost:3000");
    cy.contains(currentOrder).click();
});

When('The user clicks on the {string} order', (orderName) => {
    cy.contains(orderName).click();
});

Then('The user should see all questions in the database with the most recently posted questions first', () => {
    verifyNewestOrder();
});


//   Scenario: Return to Newest after viewing Tags
//     Given The user is viewing the homepage "http://localhost:3000"
//     When The user clicks on the "Tags" menu item
//     And clicks on the "Questions" menu item
//     And clicks on the "Newest" tab
//     Then The user should see all questions in the database with the most recently posted questions first

Given('The user is viewing the homepage {string}', (url) => {
    cy.visit(url);
});

When('The user clicks on the {string} menu item', (menuItem) => {
    cy.contains(menuItem).click();
});

And('clicks on the {string} menu item', (menuItem) => {
    cy.contains(menuItem).click();
});

And('clicks on the {string} tab', (tabName) => {
    cy.contains(tabName).click();
});

Then('The user should see all questions in the database with the most recently posted questions first', () => {
    verifyNewestOrder();
});

//   Scenario: View questions in most recent order after answering questions
//     Given The user is viewing the homepage "http://localhost:3000"
//     And The user creates a new question
//     And creates another new question
//     When The user clicks on the "Newest" tab in the "Questions" page
//     Then The user should see all questions in the database in most recent order

Given('The user is viewing the homepage {string}', (url) => {
    cy.visit(url);
});

And('The user creates a new question', () => {
    createQuestion(Q5_TITLE, "Test Question A", "test", "TestUser");
});

And('creates another new question', () => {
    createQuestion(Q6_TITLE, "Test Question B", "test1", "TestUser1");
});

When('The user clicks on the {string} tab in the {string} page', (orderName, pageName) => {
    cy.contains(pageName).click();
    cy.contains(orderName).click();
});

Then('The user should see all questions in the database in most recent order', () => {
    verifyNewestOrder1()
});