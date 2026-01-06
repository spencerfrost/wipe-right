const CORS_PROXIES = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
];

/**
 * Fetch HTML content from a URL using CORS proxies
 * Tries each proxy in order until one succeeds
 */
export async function fetchWithCorsProxy(url: string): Promise<string> {
  const errors: string[] = [];

  for (const getProxyUrl of CORS_PROXIES) {
    const proxyUrl = getProxyUrl(url);
    try {
      const response = await fetch(proxyUrl, {
        headers: {
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });

      if (!response.ok) {
        errors.push(`Proxy returned ${response.status}`);
        continue;
      }

      const html = await response.text();
      if (html && html.length > 100) {
        return html;
      }
      errors.push("Empty or too short response");
    } catch (err) {
      errors.push(err instanceof Error ? err.message : "Unknown error");
    }
  }

  throw new Error(`Failed to fetch URL: ${errors.join(", ")}`);
}
