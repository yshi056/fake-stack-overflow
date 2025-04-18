import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps';


const newQuestion = {
    title: "How to add a question to the database?",
    text: "I am trying to add a question to the database using JavaScript, but I am not sure how to do it. Can someone help me?",
    tags: "database javascript",
    user: "elephantCDE"
}

function fillForm(q) {
    if(q.title)
        cy.get("#formTitleInput").type(q.title);
    if(q.text)
        cy.get("#formTextInput").type(q.text);
    if(q.tags)
        cy.get("#formTagInput").type(q.tags);
    if(q.user)
        cy.get("#formUsernameInput").type(q.user);
}

function verifyNewQuestion(newQuestion) {
    cy.contains("All Questions");
    cy.get(".postTitle").first().should("contain", newQuestion.title);
    cy.get(".question_author").first().should("contain", newQuestion.user);
    cy.get(".question_meta").first().should("contain", "0 seconds");
}
// Scenario: Add a new question successfully
//     Given The user has write access to the application "http://localhost:3000"
//     When The user clicks the "Ask a Question" button
//     And fills out the necessary question fields
//     And clicks the "Post Question" button
//     Then The user should see the new question in the All Questions page with the metadata information

Given('The user has write access to the application {string}', (url) => {
    cy.visit(url);
});

When('The user clicks the {string} button', (buttonName) => {
    cy.contains(buttonName).click();
});

And('fills out the necessary question fields', () => {
    fillForm(newQuestion);
});

And('clicks the {string} button', (buttonName) => {
    cy.contains(buttonName).click();
});

Then('The user should see the new question in the All Questions page with the metadata information', () => {
    verifyNewQuestion(newQuestion);
});

// Scenario: Add a new question with a missing field
// Given The user has write access to the application "http://localhost:3000"
// When The user clicks the "Ask a Question" button
// And fills all necessary question fields except "<missingField>"
// And clicks the "Post Question" button
// Then The user should see an error message "<errorMessage>"
// And The user should see the "Post Question" button

Given('The user has write access to the application {string}', (url) => {
    cy.visit(url);
});
When('The user clicks the {string} button', (buttonName) => {
    cy.contains(buttonName).click();
});
And('fills all necessary question fields except {string}', (missingField) => {
    let q = {...newQuestion, [missingField]: ""};
    fillForm(q);
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

// Scenario: Add a new question with too many tags
// Given The user has write access to the application "http://localhost:3000"
// When The user clicks the "Ask a Question" button
// And fills out the necessary question fields
// And adds more than 5 tags
// And clicks the "Post Question" button
// Then The user should see an error message indicating the maximum number of tags allowed

Given('The user has write access to the application {string}', (url) => {
    cy.visit(url);
});
When('The user clicks the {string} button', (buttonName) => {
    cy.contains(buttonName).click();
});
And('fills out the necessary question fields', () => {
    fillForm(newQuestion);
});
And('adds more than 5 tags', () => {
    cy.get("#formTagInput").type("tag1 tag2 tag3 tag4 tag5");
});
And('clicks the {string} button', (buttonName) => {
    cy.contains(buttonName).click();
});
Then('The user should see an error message indicating the maximum number of tags allowed', () => {
    cy.contains("More than five tags is not allowed");
});

// Scenario: Add a new question with a title that's too long
// Given The user has write access to the application "http://localhost:3000"
// When The user clicks the "Ask a Question" button
// And fills out the necessary fields
// And enters a title that's longer than 20 words
// And clicks the "Post Question" button
// Then The user should see an error message indicating the maximum number of tags allowed

Given('The user has write access to the application {string}', (url) => {
    cy.visit(url);
}
);
When('The user clicks the {string} button', (buttonName) => {
    cy.contains(buttonName).click();
}
);
And('fills out the necessary question fields', () => {
    fillForm(newQuestion);
}
);
And('enters a title that\'s longer than 100 characters', () => {
    cy.get("#formTitleInput").type("This is a very long title that is more than 100 characters long..................................................................................................");
}
);
And('clicks the {string} button', (buttonName) => {
    cy.contains(buttonName).click();
}
);
Then('The user should see an error message indicating title\'s too long', () => {
    cy.contains("Title cannot be more than 100 characters");
}
);