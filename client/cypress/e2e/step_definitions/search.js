import { Given, When, Then, And, } from "cypress-cucumber-preprocessor/steps";


const Q1_TITLE = "Programmatically navigate using React router";
const Q2_TITLE = "android studio save string shared preference, start activity and load the saved string";
const Q3_TITLE = "Quick question about storage on android";
const Q4_TITLE = "Object storage for a web application";


function verifySearchResults() {
    cy.contains(Q2_TITLE);
    cy.contains(Q3_TITLE);
    cy.contains(Q4_TITLE);
}

// Scenario: Should be able to search for questions by search string matching titles
// Given The user can access the homepage "http://localhost:3000"
// And can see the homepage "All Questions"
// When The user enter a search string in the search bar
// And press enter
// Then The user should see all questions in the database that match the search string
// And can see the homepage "Search Results"


Given('The user can access the homepage {string}', (url) => {
    cy.visit(url);
}
);

And('can see the homepage {string}', (pageName) => {
    cy.contains(pageName);
}
);

When('The user enter a search string in the search bar', () => {
    cy.get("#searchBar").type(Q1_TITLE);
}
); 

And('press enter', () => {
    cy.get("#searchBar").type("{enter}");
}
); 

Then('The user should see all questions in the database that match the search string', () => {
    cy.contains(Q1_TITLE);
}
);

And('can see the homepage {string}', (pageName) => {
    cy.contains(pageName);
}
);


// Scenario: Should be able to search for questions by search string, even if just partially matching
// Given The user can access the homepage "http://localhost:3000"
// And can see the homepage "All Questions"
// When The user enter a search string partially matching questions in the search bar
// And press enter
// Then The user should see all questions in the database that match the search string
// And can see the homepage "Search Results"

Given('The user can access the homepage {string}', (url) => {
    cy.visit(url);
}
);

And('can see the homepage {string}', (pageName) => {
    cy.contains(pageName);
}
);

When('The user enters a search string partially matching questions in the search bar', () => {
    cy.get("#searchBar").type("android phone");
}
); 

And('press enter', () => {
    cy.get("#searchBar").type("{enter}");
}
); 

Then('The user should see all questions in the database that match the search string partially', () => {
    cy.contains(Q2_TITLE);
    cy.contains(Q3_TITLE);
}
);

And('can see the homepage {string}', (pageName) => {
    cy.contains(pageName);
}
);

// Scenario: Should be able to search for questions by search string, even if just matching text
// Given The user can access the homepage "http://localhost:3000"
// And can see the homepage "All Questions"
// When The user enters a search string matching question text in the search bar
// And press enter
// Then The user should see all questions in the database whose text matches the search string
// And can see the homepage "Search Results"

Given('The user can access the homepage {string}', (url) => {
    cy.visit(url);
}
);

And('can see the homepage {string}', (pageName) => {
    cy.contains(pageName);
}
);

When('The user enters a search string matching question text in the search bar', () => {
    cy.get("#searchBar").type("navigation");
}
);

And('press enter', () => {
    cy.get("#searchBar").type("{enter}");
}
);

Then('The user should see all questions in the database whose text matches the search string', () => {
    cy.contains(Q2_TITLE);
}
);

// Scenario: Should be able to search for questions by tag
// Given The user can access the homepage "http://localhost:3000"
// And can see the homepage "All Questions"
// When The user enter a tag in the search bar
// And press enter
// Then The user should see all questions in the database that match the tag
// And can see the homepage "Search Results"

Given('The user can access the homepage {string}', (url) => {
    cy.visit(url);
}
);

And('can see the homepage {string}', (pageName) => {
    cy.contains(pageName);
}
);

When('The user enters a tag in the search bar', () => {
    cy.get("#searchBar").type("[react]");
}
); 

And('press enter', () => {
    cy.get("#searchBar").type("{enter}");
}
); 

Then('The user should see all questions in the database that match the tag', () => {
    cy.contains(Q1_TITLE);
}
);

And('can see the homepage {string}', (pageName) => {
    cy.contains(pageName);
}
);

// Scenario: Should be able to search for questions by tag or search string
// Given The user can access the homepage "http://localhost:3000"
// And can see the homepage "All Questions"
// When The user enter a tag and a search string in the search bar
// And press enter
// Then The user should see all questions in the database that match the search string or tag
// And can see the homepage "Search Results"

Given('The user can access the homepage {string}', (url) => {
    cy.visit(url);
}
);

And('can see the homepage {string}', (pageName) => {
    cy.contains(pageName);
}
);

When('The user enters a tag and a search string in the search bar', () => {
    cy.get("#searchBar").type("[website] android phone");
}
);

And('press enter', () => {
    cy.get("#searchBar").type("{enter}");
}
);

Then('The user should see all questions in the database that match the search string or tag', () => {
    verifySearchResults();
}
);
