Feature: Show Questions by Unanswered questions
As a user with read access to fake stack overflow
I want to see all Unanswered questions in the database in newest order
So that I can view the most recent unanswered questions

  Scenario: Show all unanswered questions in newest order on user request
    Given The user can access the homepage "http://localhost:3000"
    And can see the homepage "All Questions"
    When The user clicks on the "Unanswered" tab
    Then The user should see all unanswered questions in the database in newest order

  Scenario Outline: Return to the Unanswered tab after viewing questions in another order
    Given The user is viewing questions in "<currentOrder>"
    When The user clicks on the "Unanswered" order
    Then The user should see all unanswered questions in the database in newest order

    Examples:
      | currentOrder |
      | Newest       |
      | Active       |

  Scenario: Return to Unanswered after viewing Tags
    Given The user is viewing the homepage "http://localhost:3000"
    When The user clicks on the "Tags" menu item
    And clicks on the "Questions" menu item
    And clicks on the "Unanswered" tab
    Then The user should see all unanswered questions in the database in newest order

  Scenario: View questions in Unanswered order after posting questions
    Given The user is viewing the homepage "http://localhost:3000"
    And The user has created a new question
    And has created another new question
    When The user clicks on the "Unanswered" tab in the "Questions" page
    Then The user should see the new questions in the database in newest order

  Scenario: View questions in Unanswered order after answering questions
    Given The user is viewing the homepage "http://localhost:3000"
    And The user has created a new question
    And answers the new question
    When The user clicks on the "Unanswered" tab in the "Questions" page
    Then The user should not see the new question
