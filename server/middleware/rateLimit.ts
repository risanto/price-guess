// server/middleware/rateLimit.js
import { RateLimiterMemory } from "rate-limiter-flexible";
import { defineEventHandler } from "h3";

// Configure rate limiting
const rateLimiter = new RateLimiterMemory({
  points: 30, // 30 requests
  duration: 60, // per 60 seconds
});

// Middleware function
export default defineEventHandler(async (event) => {
  const ipHeader = event.node.req.headers["x-forwarded-for"];
  const ip =
    (typeof ipHeader === "string" ? ipHeader.split(",")[0] : ipHeader?.[0]) ||
    event.node.req.socket.remoteAddress;

  const userKey = event.node.req.headers["authorization"] || ip;

  try {
    await rateLimiter.consume(userKey as string);
  } catch (err) {
    const error = createError({
      statusCode: 429,
      statusMessage: "Too Many Requests",
      message: "You have exceeded the rate limit. Please try again later.",
    });
    return sendError(event, error); // Send a structured erro
  }
});
