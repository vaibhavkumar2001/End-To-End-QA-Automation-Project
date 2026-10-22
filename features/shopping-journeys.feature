Feature: Shopping journeys

  Background:
    Given I am logged in as a standard user

  Scenario: Shopper adds several products and sees all of them in the cart
    When I add "sauce-labs-backpack" to the cart
    And I add "sauce-labs-bike-light" to the cart
    And I add "sauce-labs-bolt-t-shirt" to the cart
    Then the cart badge should show 3 items
    When I open the cart
    Then the cart should contain 3 items
    And the cart should list "Sauce Labs Backpack"
    And the cart should list "Sauce Labs Bike Light"
    And the cart should list "Sauce Labs Bolt T-Shirt"

  Scenario: Shopper changes their mind and removes a product from the products page
    When I add "sauce-labs-backpack" to the cart
    And I add "sauce-labs-bike-light" to the cart
    And I add "sauce-labs-onesie" to the cart
    And I remove "sauce-labs-bike-light" from the products page
    Then the cart badge should show 2 items
    When I open the cart
    Then the cart should contain 2 items
    And the cart should not list "Sauce Labs Bike Light"

  Scenario: Shopper removes a product from the cart page
    When I add "sauce-labs-backpack" to the cart
    And I add "sauce-labs-fleece-jacket" to the cart
    And I open the cart
    And I remove "sauce-labs-backpack" from the cart page
    Then the cart should contain 1 item
    And the cart should not list "Sauce Labs Backpack"
    When I continue shopping
    Then the cart badge should show 1 item

  Scenario: Shopper keeps shopping after looking at the cart
    When I add "sauce-labs-backpack" to the cart
    And I open the cart
    And I continue shopping
    And I add "sauce-labs-bike-light" to the cart
    Then the cart badge should show 2 items
    When I open the cart
    Then the cart should contain 2 items

  Scenario: Cancelling checkout keeps the items in the cart
    When I add "sauce-labs-backpack" to the cart
    And I open the cart
    And I start the checkout
    And I cancel the checkout
    Then I should be back on the cart page
    And the cart should contain 1 item

  Scenario: Item total on the order overview matches the chosen products
    When I add "sauce-labs-backpack" to the cart
    And I add "sauce-labs-bike-light" to the cart
    And I add "sauce-labs-bolt-t-shirt" to the cart
    And I open the cart
    And I continue to the order overview with valid details
    Then the item total should match the prices of the products

  Scenario: Full journey from browsing to a completed order
    When I sort products by "Price (low to high)"
    And I add "sauce-labs-onesie" to the cart
    And I add "sauce-labs-bike-light" to the cart
    And I add "sauce-labs-backpack" to the cart
    And I remove "sauce-labs-backpack" from the products page
    And I open the cart
    And I continue to the order overview with valid details
    And I finish the order
    Then I should see the order confirmation
    When I go back to the products page
    Then I should see the products page
    And the cart badge should not be visible

  Scenario: Shopper logs out in the middle of a session
    When I add "sauce-labs-backpack" to the cart
    And I log out
    Then I should see the login page