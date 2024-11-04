export function getHomePageUrl() {
  return `${window.location.protocol}//${window.location.host}/`; // This will give you the home page URL
}

// Utility function to wrap setTimeout in a Promise
export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isToday(timestamptz: string): boolean {
  const date = new Date(timestamptz); // Parse timestamptz to a Date object
  const today = new Date(); // Get current date

  // Compare year, month, and date
  return (
    date.getUTCFullYear() === today.getUTCFullYear() &&
    date.getUTCMonth() === today.getUTCMonth() &&
    date.getUTCDate() === today.getUTCDate()
  );
}
