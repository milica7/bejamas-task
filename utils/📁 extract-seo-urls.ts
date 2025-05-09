export function extractSeoRelevantUrls(urls: string[]): string[] {
    return urls.filter((url) => {
      const lower = url.toLowerCase();
  
      const isExcluded =
        lower.includes('thank-you') ||
        lower.includes('404') ||
        lower.includes('preview') ||
        lower.includes('?') ||
        lower.endsWith('.xml') ||
        lower.endsWith('.pdf');
  
      return !isExcluded;
    });
  }
  