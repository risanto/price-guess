// server/middleware/rateLimit.js
import { RateLimiterMemory } from "rate-limiter-flexible";
import { defineEventHandler } from "h3";

const rateLimiterAuthenticated = new RateLimiterMemory({
  points: 10, // 10 requests per 60 seconds
  duration: 60,
});

const rateLimiterUnauthenticated = new RateLimiterMemory({
  points: 30, // Allow more requests for unauthenticated users
  duration: 60,
});

// Middleware function
export default defineEventHandler(async (event) => {
  const ipHeader = event.node.req.headers["x-forwarded-for"];
  const ip =
    (typeof ipHeader === "string" ? ipHeader.split(",")[0] : ipHeader?.[0]) ||
    event.node.req.socket.remoteAddress;
  const authHeader = event.node.req.headers["authorization"];

  const userKey = authHeader ? authHeader : ip;

  try {
    if (authHeader) {
      // If user is authenticated, apply a stricter rate limit
      await rateLimiterAuthenticated.consume(userKey as string);
    } else {
      // If user is not authenticated, allow more requests for the same IP
      await rateLimiterUnauthenticated.consume(userKey as string);
    }
  } catch (err) {
    const error = createError({
      statusCode: 429,
      statusMessage: "Too Many Requests",
      message: "You have exceeded the rate limit. Please try again later.",
    });
    return sendError(event, error); // Send a structured erro
  }
});
