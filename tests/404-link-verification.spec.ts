import { test, expect } from '@playwright/test';

// ✅ TC_09: Check that internal links on key pages do not return 404
test('TC_09: Internal links on key pages should not return 404', async ({ page, request }) => {
  test.setTimeout(3 * 60 * 1000); // Set max timeout to 3 minutes for slower network/pages

  // ✅ Get baseURL from Playwright config
  const baseUrl = test.info().project.use.baseURL!;

  // ✅ Define 10 key pages to test for internal link integrity
  const testPaths = [
    '/', '/pricing/', '/about/', '/careers/', '/blog/',
    '/docs/', '/platform/', '/integrations/', '/contact/', '/enterprise/',
  ];

  const brokenLinks: string[] = [];

  // ✅ Loop through each key page
  for (const path of testPaths) {
    const pageUrl = `${baseUrl}${path}`;

    try {
      // ✅ Visit the page and wait for DOM content
      await page.goto(path, { waitUntil: 'domcontentloaded', timeout: 10000 });

      // ✅ Collect all <a href> values on the page
      const hrefs = await page.$$eval('a[href]', (elements) =>
        elements.map((el) => (el as HTMLAnchorElement).href)
      );

      // ✅ Filter only internal links and limit to 20 per page
      const internalLinks = hrefs
        .filter((href) => href.startsWith(baseUrl))
        .slice(0, 20);

      // ✅ For each internal link, send a request to check if it returns 404
      for (const link of internalLinks) {
        const relativePath = link.replace(baseUrl, '');
        const res = await request.get(relativePath, { timeout: 10000 });

        if (res.status() === 404) {
          brokenLinks.push(`${pageUrl} → ${link} [404]`);
        }
      }
    } catch (err) {
      console.warn(`⚠️ Could not load ${pageUrl}: ${err.message}`);
    }
  }

  // ✅ Report and fail test if any broken links were found
  if (brokenLinks.length > 0) {
    console.error('\n❌ Broken internal links found:');
    brokenLinks.forEach(link => console.error(' -', link));
    throw new Error(`Found ${brokenLinks.length} broken internal link(s).`);
  }
});
