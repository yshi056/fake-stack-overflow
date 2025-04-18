import { Given, When, Then, And} from "cypress-cucumber-preprocessor/steps";

const Q1_TITLE = "Programmatically navigate using React router";

function verifyTagList() {
    const tags = [["android-studio", 2], ["javascript", 2], ["react", 1], ["shared-preferences", 2], ["storage", 2], ["website", 1]];
    tags.forEach(tag => {
        cy.contains(tag[0]).should('exist').next().should('contain', `${tag[1]} questions`);
    });
}

// Scenario: View tags list from question page
// Given the user can access the homepage "http://localhost:3000"
// And can see the homepage "All Questions"
// When the user clicks on the "Tags" menu item
// Then the user should see a list of tags with the number of questions associated with it

Given('the user can access the homepage {string}', (url) => {
    cy.visit(url);
}
); 

And('can see the homepage {string}', (pageName) => {
    cy.contains(pageName);
}
);

When('the user clicks on the {string} menu item', (menuItem) => {
    cy.contains(menuItem).click();
}
);

Then('the user should see a list of tags with the number of questions associated with it', () => {
    verifyTagList();
}
); 

// Scenario: View tags list from answers page
// Given the user can access the homepage "http://localhost:3000"
// And the user clicks on a question title
// When the user clicks on the "Tags" menu item
// Then the user should see a list of tags
// And each tag should display the number of questions associated with it

Given('the user can access the homepage {string}', (url) => {
    cy.visit(url);
}
);  

And('the user clicks on a question title', () => {
    cy.contains(Q2_TITLE).click();
}
);

When('the user clicks on the {string} menu item', (menuItem) => {
    cy.contains(menuItem).click();
}
);

Then('the user should see a list of tags with the number of questions associated with it', () => {
    verifyTagList();
}
);



// Scenario: View tag details
// Given the user can access the homepage "http://localhost:3000"
// And the user clicks on the "Tags" menu item
// When the user clicks on a tag
// Then the user should see a list of questions associated with that tag

Given('the user can access the homepage {string}', (url) => {
    cy.visit(url);
}
);

And('the user clicks on the {string} menu item', (menuItem) => {
    cy.contains(menuItem).click();
}
);

When('the user clicks on a tag', () => {
    cy.contains("react").click();
}
);

Then('the user should see a list of questions associated with that tag', () => {
    cy.contains(Q1_TITLE);
}
);