const baseUrl = 'https://www.netlify.com';

export const crawlabilityConfig = {
  allowNoIndexPages: new Set([
    `${baseUrl}/contact/`,
    `${baseUrl}/privacy/`,
    `${baseUrl}/gdpr-ccpa/`,
    `${baseUrl}/trust-center/`,
    `${baseUrl}/agency-directory/`,
  ]),
  allow403Pages: new Set([
    `${baseUrl}/trust-center/`,
    `${baseUrl}/agency-directory/`,
  ]),
  importantPages: new Set([
    `${baseUrl}/`,
    `${baseUrl}/platform/`,
    `${baseUrl}/pricing/`,
    `${baseUrl}/blog/`,
    `${baseUrl}/about/`,
    `${baseUrl}/careers/`,
    `https://docs.netlify.com/`,
  ]),
};
