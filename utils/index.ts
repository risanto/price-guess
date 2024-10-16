export function getHomePageUrl() {
  return `${window.location.protocol}//${window.location.host}/`; // This will give you the home page URL
}

// Utility function to wrap setTimeout in a Promise
export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
