import { expect } from "@playwright/test";
import { Page } from "playwright";

class HomePage {
    page: Page;
    titleProduct: string;

    constructor(page: Page) {
        this.page = page;
        this.titleProduct = ".title";
    }

    async isOnHomePage() {
        const locator = await this.page.locator(this.titleProduct);
        await expect(locator).toContainText("Products");
    }
}


export { HomePage }