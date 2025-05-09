import { test, expect } from '@playwright/test';

// Base URL and sitemap location
const baseUrl = 'https://www.netlify.com';
const sitemapUrl = `${baseUrl}/sitemap.xml`;

// Pages allowed to have a noindex meta tag
const allowNoIndexPages = new Set([
  `${baseUrl}/privacy/`,
  `${baseUrl}/contact/`,
  `${baseUrl}/gdpr-ccpa/`,
  `${baseUrl}/trust-center/`,
  `${baseUrl}/agency-directory/`,
  `${baseUrl}/instantly-build-exceptional-digital-experiences-with-contentful-and-netlify/`,
]);

// Pages allowed to return 403 status (e.g. protected pages)
const allow403Pages = new Set([
  `${baseUrl}/trust-center/`,
  `${baseUrl}/legal/subprocessors/`,
]);

// Pages that are important for SEO and must be indexable
const importantPages = new Set([
  `${baseUrl}/`,
  `${baseUrl}/pricing/`,
  `${baseUrl}/blog/`,
  `${baseUrl}/platform/`,
  `${baseUrl}/about/`,
  `${baseUrl}/careers/`,
  `${baseUrl}/enterprise/`,
  `${baseUrl}/docs/`,
  `${baseUrl}/integrations/`,
  `${baseUrl}/contact/`,
]);

// Utility function to extract <loc> URLs from sitemap XML
function extractUrlsFromSitemap(xml: string): string[] {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
}

test.describe('Sitemap and Crawlability Tests', () => {
  let sitemapUrls: string[] = [];

  // Load and parse the sitemap before running any tests
  test.beforeAll(async ({ request }) => {
    const res = await request.get(sitemapUrl);
    expect(res.status()).toBe(200);
    const xml = await res.text();
    sitemapUrls = extractUrlsFromSitemap(xml);
  });

  // TC_05: Basic check to confirm sitemap.xml is accessible
  test('TC_05: Sitemap.xml should exist', async ({ request }) => {
    const res = await request.get(sitemapUrl);
    expect(res.status()).toBe(200);
  });

  // TC_06: Check that all pages in sitemap respond with a valid status (< 400), except those explicitly allowed to return 403
  test('TC_06: All sitemap URLs should be accessible (status < 400)', async ({ request }) => {
    test.setTimeout(5 * 60 * 1000); // Set timeout for batch execution

    const urlsToTest = sitemapUrls;
    const batchSize = 10; // Batch size to reduce concurrency overload
    const errors: string[] = [];

    for (let i = 0; i < urlsToTest.length; i += batchSize) {
      const batch = urlsToTest.slice(i, i + batchSize);

      await Promise.allSettled(
        batch.map(async (rawUrl) => {
          const normalizedUrl = rawUrl.endsWith('/') ? rawUrl : rawUrl + '/';

          try {
            const res = await request.get(rawUrl, { timeout: 10_000 });

            // If page is not explicitly allowed to return 403, it must be < 400
            if (!allow403Pages.has(normalizedUrl)) {
              if (res.status() >= 400) {
                errors.push(`${rawUrl} returned ${res.status()}`);
              }
            }
          } catch (err: any) {
            errors.push(`Failed to access ${rawUrl}: ${err.message || err}`);
          }
        })
      );
    }

    if (errors.length > 0) {
      console.error('\n Some pages failed:');
      errors.forEach(e => console.error(e));
      throw new Error(`${errors.length} URLs failed accessibility check`);
    }
  });

  // TC_07: Pages must not be marked as noindex unless explicitly whitelisted
  test('TC_07: Pages must not have noindex unless explicitly allowed', async ({ request }) => {
    const urlsToTest = sitemapUrls.slice(0, 100); // Limit for performance

    for (const rawUrl of urlsToTest) {
      const normalizedUrl = rawUrl.endsWith('/') ? rawUrl : rawUrl + '/';
      const res = await request.get(rawUrl);
      const html = await res.text();
      const hasNoIndex = html.includes('name="robots"') && html.includes('noindex');

      // If noindex is found, it must be on an approved page
      if (hasNoIndex) {
        expect(allowNoIndexPages.has(normalizedUrl), `${rawUrl} has unexpected noindex`).toBeTruthy();
      }
    }
  });

  // TC_08: Critical SEO pages must be indexable (must not have noindex tag)
  test('TC_08: Important pages must be indexable', async ({ request }) => {
    for (const url of importantPages) {
      const res = await request.get(url);
      expect(res.status(), `${url} returned ${res.status()}`).toBeLessThan(400);

      const html = await res.text();
      const hasNoIndex = html.includes('name="robots"') && html.includes('noindex');

      // These pages must not be excluded from search engines
      expect(hasNoIndex, `Important page ${url} has noindex!`).toBeFalsy();
    }
  });
});
