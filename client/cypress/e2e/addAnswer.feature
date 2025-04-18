Feature: Adding new answers to the questions
    As a user with write access to Fake Stack Overflow
    I want to add a new question to the application
    So that I can ask a question to the community

  Scenario: Add a new answer successfully
    Given The user has write access to the application "http://localhost:3000"
    When the user is viewing an answer page
    And clicks the "Answer Question" button
    And fills out the necessary fields
    And clicks the "Post Answer" button
    Then The user should see the new answer at the top of the question page with the metadata information

  Scenario Outline: Add a new answer with a missing field
    Given The user has write access to the application "http://localhost:3000"
    When the user is viewing an answer page
    And clicks the "Answer Question" button
    And fills out the necessary fields except "<missingField>"
    And clicks the "Post Answer" button
    Then The user should see an error message "<errorMessage>"
    And The user should see the "Post Answer" button

    Examples:
      | missingField | errorMessage                |
      | text         | Answer text cannot be empty |
      | user         | Username cannot be empty    |
