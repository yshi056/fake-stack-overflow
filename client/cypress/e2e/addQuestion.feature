Feature: Adding new questions
    As a user with write access to Fake Stack Overflow
    I want to add a new question to the application
    So that I can ask a question to the community

  Scenario: Add a new question successfully
    Given The user has write access to the application "http://localhost:3000"
    When The user clicks the "Ask a Question" button
    And fills out the necessary question fields
    And clicks the "Post Question" button
    Then The user should see the new question in the All Questions page with the metadata information

  Scenario Outline: Add a new question with a missing field
    Given The user has write access to the application "http://localhost:3000"
    When The user clicks the "Ask a Question" button
    And fills all necessary question fields except "<missingField>"
    And clicks the "Post Question" button
    Then The user should see an error message "<errorMessage>"
    And The user should see the "Post Question" button

    Examples:
      | missingField | errorMessage                  |
      | title        | Title cannot be empty         |
      | text         | Question text cannot be empty |
      | tags         | Should have at least one tag  |
      | user         | Username cannot be empty      |

  Scenario: Add a new question with too many tags
    Given The user has write access to the application "http://localhost:3000"
    When The user clicks the "Ask a Question" button
    And fills out the necessary question fields
    And adds more than 5 tags
    And clicks the "Post Question" button
    Then The user should see an error message indicating the maximum number of tags allowed

  Scenario: Add a new question with a title that's too long
    Given The user has write access to the application "http://localhost:3000"
    When The user clicks the "Ask a Question" button
    And fills out the necessary question fields
    And enters a title that's longer than 100 characters
    And clicks the "Post Question" button
    Then The user should see an error message indicating title's too long
