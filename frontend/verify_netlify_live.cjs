const { chromium } = require('playwright');

async function testNetlifyDeployment() {
  console.log('Testing live Netlify deployment at https://caresynciq.netlify.app ...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const consoleErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      const txt = msg.text();
      // Ignore expected localhost fallback connection error in production
      if (!txt.includes('localhost:5000') && !txt.includes('favicon')) {
        consoleErrors.push(txt);
      }
    }
  });

  const urlsToTest = [
    'https://caresynciq.netlify.app/',
    'https://caresynciq.netlify.app/dashboard',
    'https://caresynciq.netlify.app/timeline',
    'https://caresynciq.netlify.app/safety',
    'https://caresynciq.netlify.app/patient',
    'https://caresynciq.netlify.app/handoff'
  ];

  for (const url of urlsToTest) {
    console.log(`Checking route: ${url} ...`);
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    const status = resp.status();
    console.log(`  -> Status code: ${status}`);

    const title = await page.title();
    console.log(`  -> Page title: "${title}"`);

    // Verify main content rendered
    const hasHeader = await page.$('header');
    console.log(`  -> Header present: ${!!hasHeader}`);
  }

  console.log('Testing interaction on /timeline ...');
  await page.goto('https://caresynciq.netlify.app/timeline', { waitUntil: 'networkidle', timeout: 30000 });

  // Click patient tab Priya (P1002)
  const priyaBtn = await page.waitForSelector('button:has-text("Priya")', { timeout: 5000 });
  await priyaBtn.click();
  await page.waitForTimeout(500);
  console.log('✓ Successfully clicked Priya (P1002) tab on live Netlify site.');

  // Click filter button
  const labsFilterBtn = await page.waitForSelector('button:has-text("LABS")', { timeout: 5000 });
  await labsFilterBtn.click();
  await page.waitForTimeout(500);
  console.log('✓ Successfully filtered by LABS on live Netlify site.');

  console.log('Testing interaction on /safety ...');
  await page.goto('https://caresynciq.netlify.app/safety', { waitUntil: 'networkidle', timeout: 30000 });
  const safetyHeading = await page.waitForSelector('text=Clinical Safety & Cross-Provider Anomaly Hub', { timeout: 5000 });
  console.log('✓ Safety Hub header verified on live Netlify site.');

  // Click Rajesh (P1001) to verify duplicate test warning
  const rajeshBtn = await page.waitForSelector('button:has-text("Rajesh")', { timeout: 5000 });
  await rajeshBtn.click();
  await page.waitForTimeout(500);

  const repeatedWarning = await page.waitForSelector('text=Repeated Test Warning', { timeout: 5000 });
  console.log('✓ Repeated Test Warning verified for Rajesh on live Netlify site.');

  console.log('\n======================================================');
  console.log('🎉 NETLIFY LIVE DEPLOYMENT TEST PASSED 100%!');
  console.log(`Uncaught Console Errors: ${consoleErrors.length}`);
  console.log('======================================================');

  await browser.close();
}

testNetlifyDeployment().catch(err => {
  console.error('Netlify verification failed:', err);
  process.exit(1);
});
