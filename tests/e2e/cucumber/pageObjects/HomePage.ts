import { expect } from "@playwright/test";
import { Page } from "playwright";

class HomePage {
    page: Page;
    homeLogo: string;

    constructor(page: Page) {
        this.page = page;
        this.homeLogo = "";
    }

    async isOnHomePage() {
        const locator = await this.page.locator(this.homeLogo);
        await expect(locator).toBeVisible();
    }
}


export { HomePage }