const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = path.resolve(__dirname, '..', '.audit_screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const PAGES = [
  { name: 'landing', path: '/' },
  { name: 'dashboard', path: '/dashboard' },
  { name: 'timeline', path: '/timeline' },
  { name: 'patient_portal', path: '/patient' },
  { name: 'doctor_handoff', path: '/handoff' },
  { name: 'safety_checks', path: '/safety' },
  { name: 'chat_qa', path: '/chat' },
  { name: 'verification_queue', path: '/verify' },
  { name: 'audit_trail', path: '/audit' },
  { name: 'report_generator', path: '/reports' },
  { name: 'fhir_export', path: '/fhir' },
  { name: 'ai_metrics', path: '/metrics' },
  { name: 'upload_pipeline', path: '/upload' }
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 }
];

async function runAudit() {
  console.log('=== CareSyncIQ Comprehensive Playwright QA Audit ===');
  console.log(`Timestamp: ${new Date().toISOString()}`);

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const auditResults = {
    timestamp: new Date().toISOString(),
    pagesTested: 0,
    screenshotsCaptured: 0,
    consoleErrors: [],
    failedRequests: [],
    pages: []
  };

  for (const pageInfo of PAGES) {
    for (const vp of VIEWPORTS) {
      const pageResult = {
        name: pageInfo.name,
        path: pageInfo.path,
        viewport: vp.name,
        status: 'PENDING',
        consoleErrors: [],
        failedRequests: [],
        screenshot: ''
      };

      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1
      });
      const page = await context.newPage();

      // Listen for console errors
      page.on('console', msg => {
        if (msg.type() === 'error') {
          const text = msg.text();
          if (!text.includes('favicon.ico')) {
            pageResult.consoleErrors.push(text);
            auditResults.consoleErrors.push({ page: pageInfo.name, viewport: vp.name, error: text });
          }
        }
      });

      // Listen for failed network requests
      page.on('requestfailed', req => {
        const url = req.url();
        if (!url.includes('favicon.ico')) {
          pageResult.failedRequests.push({ url, failure: req.failure()?.errorText });
          auditResults.failedRequests.push({ page: pageInfo.name, url, failure: req.failure()?.errorText });
        }
      });

      try {
        const targetUrl = `http://localhost:5173${pageInfo.path}`;
        const response = await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 20000 });
        await page.waitForTimeout(1000); // Allow React re-renders and charts to mount

        const title = await page.title();
        pageResult.title = title;
        pageResult.httpStatus = response ? response.status() : null;

        const bodyText = await page.innerText('body');
        pageResult.textLength = bodyText.length;
        pageResult.hasSubstance = bodyText.length > 50;

        const screenshotPath = path.join(SCREENSHOT_DIR, `${pageInfo.name}_${vp.name}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: false });
        pageResult.screenshot = screenshotPath;
        auditResults.screenshotsCaptured++;

        pageResult.status = (pageResult.consoleErrors.length === 0 && pageResult.hasSubstance) ? 'PASS' : 'WARN';
        console.log(`[${pageResult.status}] ${pageInfo.name} (${vp.name}): HTTP ${pageResult.httpStatus}, ${bodyText.length} chars text, screenshot saved`);
      } catch (err) {
        pageResult.status = 'FAIL';
        pageResult.error = err.message;
        console.error(`[FAIL] ${pageInfo.name} (${vp.name}): ${err.message}`);
      } finally {
        auditResults.pages.push(pageResult);
        auditResults.pagesTested++;
        await context.close();
      }
    }
  }

  await browser.close();

  const reportPath = path.join(__dirname, '..', 'playwright_audit_summary.json');
  fs.writeFileSync(reportPath, JSON.stringify(auditResults, null, 2));
  console.log(`\nAudit completed! Summary written to: ${reportPath}`);
  console.log(`Total Pages/Viewports: ${auditResults.pagesTested}`);
  console.log(`Total Screenshots: ${auditResults.screenshotsCaptured}`);
  console.log(`Console Errors: ${auditResults.consoleErrors.length}`);
  console.log(`Failed Requests: ${auditResults.failedRequests.length}`);
}

runAudit().catch(err => {
  console.error('Audit fatal error:', err);
  process.exit(1);
});
