Feature: login users


    As a user
    I want to be able to log into my account
    So that I have access to my files

    Scenario: user login with valid credential
        Given the user has browsed to the login page
        When the use logs in with username "standard_user" and password "secret_sauce" using the webUI
        Then the user should be in homepage