Feature: Product sorting

  Background:
    Given I am logged in as a standard user

  Scenario Outline: Shopper sorts the products
    When I sort products by "<option>"
    Then the products should be sorted by "<option>"

    Examples:
      | option              |
      | Name (A to Z)       |
      | Name (Z to A)       |
      | Price (low to high) |
      | Price (high to low) |