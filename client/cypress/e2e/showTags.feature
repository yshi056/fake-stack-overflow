Feature: Show tags
As a user with read access to fake stack overflow
I want to click on the "Tags" menu item
And see all tags with the number of questions associated with each tag 

  Scenario: View tags list from question page
    Given the user can access the homepage "http://localhost:3000"
    And can see the homepage "All Questions"
    When the user clicks on the "Tags" menu item
    Then the user should see a list of tags with the number of questions associated with it

  Scenario: View tags list from answers page
    Given the user can access the homepage "http://localhost:3000"
    And the user clicks on a question title
    When the user clicks on the "Tags" menu item
    Then the user should see a list of tags with the number of questions associated with it

  Scenario: View tag details
    Given the user can access the homepage "http://localhost:3000"
    And the user clicks on the "Tags" menu item
    When the user clicks on a tag
    Then the user should see a list of questions associated with that tag
