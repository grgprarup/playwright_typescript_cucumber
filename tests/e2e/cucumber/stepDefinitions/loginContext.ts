import { Given, Then, When } from "@cucumber/cucumber";
import { HomePage } from "../pageObjects/HomePage";
import { LoginPage } from "../pageObjects/LoginPage";
import { World } from "../types";

Given('the user has browsed to the login page', async function (this: World) {
    const loginPage: LoginPage = new LoginPage(this.page);
    await loginPage.browseToLoginPage();
});

When('the use logs in with username {string} and password {string} using the webUI', async function (this: World, username, password) {
    const loginPage: LoginPage = new LoginPage(this.page);
    await loginPage.logsIn(username, password);
});

Then('the user should be in homepage', async function (this: World) {
    const homePage: HomePage = new HomePage(this.page);
    await homePage.isOnHomePage();
});
