Feature: Show Questions by most recent order
As a user with read access to fake stack overflow
I want to see all questions in the database in most recently posted order
So that I can view the questions that were posted most recently

  Scenario: Show all questions in most recent order on user request
    Given The user can access the homepage "http://localhost:3000"
    And can see the homepage "All Questions"
    When The user clicks on the "Newest" tab
    Then The user should see all questions in the database with the most recently posted questions first

  Scenario Outline: Return to the Newest tab after viewing questions in another order
    Given The user is viewing questions in "<currentOrder>"
    When The user clicks on the "Newest" order
    Then The user should see all questions in the database with the most recently posted questions first

    Examples:
      | currentOrder |
      | Active       |
      | Unanswered   |

  Scenario: Return to Newest after viewing Tags
    Given The user is viewing the homepage "http://localhost:3000"
    When The user clicks on the "Tags" menu item
    And clicks on the "Questions" menu item
    And clicks on the "Newest" tab
    Then The user should see all questions in the database with the most recently posted questions first

  Scenario: View questions in most recent order after answering questions
    Given The user is viewing the homepage "http://localhost:3000"
    And The user creates a new question
    And creates another new question
    When The user clicks on the "Newest" tab in the "Questions" page
    Then The user should see all questions in the database in most recent order
