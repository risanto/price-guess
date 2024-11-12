import { jwtDecode } from "jwt-decode";

// Function to check if the token is expired
export function isTokenExpired(token: string) {
  try {
    const decodedToken = jwtDecode(token);

    if (!decodedToken.exp) return false;

    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return decodedToken.exp < currentTime;
  } catch (error) {
    // If decoding fails, consider the token invalid/expired
    return true;
  }
}

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
