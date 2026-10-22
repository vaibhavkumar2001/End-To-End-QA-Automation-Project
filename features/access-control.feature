Feature: Access control

  Scenario: Products page cannot be opened without logging in
    Given I open "/inventory.html" without logging in
    Then I should see the error "You can only access '/inventory.html' when you are logged in"