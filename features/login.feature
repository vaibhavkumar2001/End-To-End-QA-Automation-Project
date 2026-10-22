@smoke
Feature: Login

  @smoke
  Scenario: Valid user can log in
    Given I am on the login page
    When I log in as "standard_user" with password "secret_sauce"
    Then I should see the products page

  @smoke
  Scenario: Locked out user sees an error
    Given I am on the login page
    When I log in as "locked_out_user" with password "secret_sauce"
    Then I should see the error "Sorry, this user has been locked out"

  Scenario Outline: Invalid credentials are rejected
    Given I am on the login page
    When I log in as "<username>" with password "<password>"
    Then I should see the error "<message>"

    Examples:
      | username      | password       | message                             |
      | standard_user | wrong_password | Username and password do not match  |
      | standard_user |                | Password is required                |
      |               | secret_sauce   | Username is required                |