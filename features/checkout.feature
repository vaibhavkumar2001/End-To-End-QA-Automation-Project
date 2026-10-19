Feature: Checkout

  Background:
    Given I am logged in as a standard user

  @smoke
  Scenario: Customer completes a purchase
    When I add "sauce-labs-backpack" to the cart
    And I proceed to checkout with valid details
    Then I should see the order confirmation

  Scenario: Checkout fails without first name
    When I add "sauce-labs-bike-light" to the cart
    And I proceed to checkout without a first name
    Then I should see the checkout error "First Name is required"