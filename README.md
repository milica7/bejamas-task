# Netlify Playwright Test Suite

This repository contains automated Playwright tests for verifying:

* Newsletter form functionality
* Sitemap and crawlability compliance
* 404 link detection across key pages

---

## 🔧 Setup Instructions

1. **Install dependencies:**

```bash
npm install
```

2. **Install Playwright browsers:**

```bash
npx playwright install
```

3. **Optional:** Adjust the base URL if needed inside `playwright.config.ts`:

```ts
use: {
  baseURL: 'https://www.netlify.com',
}
```

---

## ▶️ Test Execution Instructions

Run the entire test suite:

```bash
npx playwright test
```

Run a specific test file (e.g. 404 verification):

```bash
npx playwright test tests/TC-03-404-link-verification.spec.ts
```

Open the Playwright HTML report:

```bash
npx playwright show-report
```

---

## ✅ Test Structure & Approach

The suite is organized into separate test cases based on the task requirements:

###  Newsletter Form Validation

* Checks presence of the form
* Submits with valid and invalid data
* Verifies feedback messages and redirection

###  Sitemap and Crawlability Verification

* Ensures sitemap.xml exists and is valid
* Verifies all sitemap URLs respond with status < 400
* Flags pages with unexpected `noindex` tags
* Verifies that important pages are indexable

### Internal Link 404 Detection

* Loads 10 key pages
* Collects internal links (`<a href>` within the same domain)
* Requests each and flags those returning 404

---

## 💡 Assumptions & Limitations

* The test suite targets only **Netlify's public website** (`https://www.netlify.com`).
* Only a **subset of sitemap pages** (first 100 or fewer) is tested for performance.
* 404 link detection is scoped to **internal links only**, up to 20 per page.
* Pages returning `403` (e.g. `/trust-center/`) are **explicitly allowed**.
* Sitemap-based crawling avoids pages with `noindex` only if not in the allowed list.

---

## 📊 Reports

After test execution, an HTML report will be generated automatically:

* Location: `playwright-report/index.html`
* To open it:

```bash
npx playwright show-report
```

---

## 📁 Project Structure

```
tests/
├── TC-01-lead-capture-form-validation.spec.ts
├── TC-02-sitemap-and-crawlability-verification.spec.ts
├── TC-03-404-link-verification.spec.ts

playwright.config.ts
README.md
```

---

Created with ❤️ using [Playwright](https://playwright.dev)
