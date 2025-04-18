Feature: Show answers
As a user with read access to fake stack overflow
I want to click a question title to see all answers to a question in the database in most recent order
So that I can view the most recent answers to a question

  Scenario: Show answers in most recent order
    Given The user can access the homepage "http://localhost:3000"
    And can see the homepage "All Questions"
    When the user clicks on a question title
    Then the user should see the answers in the most recent order

  Scenario: Show answers in most recent order after posting a new answer
    Given The user can access the homepage "http://localhost:3000"
    And can see the homepage "All Questions"
    When the user clicks on a question title
    And the user posts a new answer
    Then the user should see the answers with the new answer in the most recent order
