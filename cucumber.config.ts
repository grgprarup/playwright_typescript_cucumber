import { BeforeAll, Before, After, AfterAll } from "@cucumber/cucumber"
import { Browser, chromium } from "playwright"

export var browser: Browser
BeforeAll(async function () {
    browser = await chromium.launch({
        headless: false,
    })

})

AfterAll(async function () {
    await browser.close()
})

Before(async function () {
    this.context = await browser.newContext()
    this.page = await this.context.newPage()
})

After(async function () {
    await this.page.close()
    await this.context.close()
})