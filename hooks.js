import {
  Before,
  BeforeAll,
  AfterAll,
  After,
  IWorld,
  setDefaultTimeout,
  ITestCaseHookParameter
} from '@cucumber/cucumber';
import { Browser, chromium, firefox, webkit } from 'playwright';
import { timeout, headless, reportTracing, reportDir, recordVideo, monitorXhrs, browserToUse, slowMo } from './config';
import path from 'path';
import { BrowserContextOptions } from '@playwright/test';
import * as fs from 'fs';

setDefaultTimeout(timeout * 1000);

let browser: Browser;

BeforeAll(async function () {
  const browserConfiguration = {
    slowMo: slowMo,
    firefoxUserPrefs: {
      'media.navigator.streams.fake': true,
      'media.navigator.permission.disabled': true
    },
    headless: headless
  };

  browser = await (async (): Promise<Browser> => {
    switch (browserToUse) {
      case 'firefox':
        return firefox.launch(browserConfiguration);
      case 'safari':
        return webkit.launch(browserConfiguration);
      case 'msedge':
        return chromium.launch({ ...browserConfiguration, channel: 'msedge' });
      case 'chromium':
        return chromium.launch(browserConfiguration);
      default:
        return chromium.launch({ ...browserConfiguration, channel: 'chrome' });
    }
  })();
});

AfterAll(async function () {
  await browser.close();
});

Before(async function (this: IWorld) {
  const config: BrowserContextOptions = {};

  if (recordVideo) {
    config['recordVideo'] = {
      dir: reportDir + '/videos',
      size: { width: 1920, height: 1080 }
    };
  }

  this.context = await browser.newContext(config);
  if (reportTracing) {
    await this.context.tracing.start({ screenshots: true, snapshots: true, sources: true });
  }

  this.page = await this.context.newPage();

  if (monitorXhrs) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.page.on('request', (request: any) => console.debug('>>', request.method(), request.url()));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.page.on('response', (response: any) => console.debug('<<', response.status(), response.url()));
  }
});

After(async function (this: IWorld, scenarioResult: ITestCaseHookParameter) {
  if (scenarioResult?.result?.status === 'FAILED') {
    if (reportTracing) {
      const currentScenario = scenarioResult.pickle.name.trim().replace(/\s/g, '_');
      const timestamp = new Date().toISOString().replace(/:/g, '-');

      await this.context.tracing.stop({
        path: path.join(reportDir, 'tracing', `${currentScenario}_${timestamp}.zip`)
      });
    }
  } else {
    if (recordVideo) {
      // delete recorded video for passed scenarios
      const vPath = await this.page.video().path();

      if (vPath) {
        fs.unlinkSync(vPath);
      }
    }
  }
  await this.page.close();
  await this.context.close();
});
