@smoke
Feature: Login

  Scenario: Valid user can log in
    Given I am on the login page
    When I log in as "standard_user" with password "secret_sauce"
    Then I should see the products page

  Scenario: Locked out user sees an error
    Given I am on the login page
    When I log in as "locked_out_user" with password "secret_sauce"
    Then I should see the error "Sorry, this user has been locked out"