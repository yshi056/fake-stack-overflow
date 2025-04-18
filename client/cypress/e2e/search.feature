Feature: Search questions by search string or tagname/s

  Scenario: Should be able to search for questions by search string matching titles
    Given The user can access the homepage "http://localhost:3000"
    And can see the homepage "All Questions"
    When The user enter a search string in the search bar
    And press enter
    Then The user should see all questions in the database that match the search string
    And can see the homepage "Search Results"

  Scenario: Should be able to search for questions by search string, even if just partially matching
    Given The user can access the homepage "http://localhost:3000"
    And can see the homepage "All Questions"
    When The user enters a search string partially matching questions in the search bar
    And press enter
    Then The user should see all questions in the database that match the search string partially
    And can see the homepage "Search Results"

  Scenario: Should be able to search for questions by search string, even if just matching text
    Given The user can access the homepage "http://localhost:3000"
    And can see the homepage "All Questions"
    When The user enters a search string matching question text in the search bar
    And press enter
    Then The user should see all questions in the database whose text matches the search string
    And can see the homepage "Search Results"

  Scenario: Should be able to search for questions by tag
    Given The user can access the homepage "http://localhost:3000"
    And can see the homepage "All Questions"
    When The user enters a tag in the search bar
    And press enter
    Then The user should see all questions in the database that match the tag
    And can see the homepage "Search Results"

  Scenario: Should be able to search for questions by tag or search string
    Given The user can access the homepage "http://localhost:3000"
    And can see the homepage "All Questions"
    When The user enters a tag and a search string in the search bar
    And press enter
    Then The user should see all questions in the database that match the search string or tag
    And can see the homepage "Search Results"
