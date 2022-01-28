import { Page } from "playwright";
import config from "../config";
import { expect } from "@playwright/test"
class LoginPage {
    page: Page
    loginLogo: string;
    username: string;
    password: string;
    submitButton: string;

    constructor(page: Page) {
        this.page = page;
        this.loginLogo = "";
        this.username = "";
        this.password = "";
        this.submitButton = "";
    }

    async browseToLoginPage() {
        await this.page.goto(`${config.baseUrl}`);
        const locator = this.page.locator(this.loginLogo);
        await expect(locator).toBeVisible();
    }

    async fillLoginField(username: string, password: string) {
        await this.page.fill(this.username, username);
        await this.page.fill(this.password, password);
        await this.page.click(this.submitButton);
    }
}

export { LoginPage }