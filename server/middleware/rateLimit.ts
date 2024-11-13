// server/middleware/rateLimit.js
import { RateLimiterMemory } from "rate-limiter-flexible";
import { defineEventHandler } from "h3";

class HttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

// Configure rate limiting
const rateLimiter = new RateLimiterMemory({
  points: 10, // 10 requests
  duration: 60, // per 60 seconds
});

// Middleware function
export default defineEventHandler(async (event) => {
  const ipHeader = event.node.req.headers["x-forwarded-for"];
  const ip =
    (typeof ipHeader === "string" ? ipHeader.split(",")[0] : ipHeader?.[0]) ||
    event.node.req.socket.remoteAddress;

  try {
    await rateLimiter.consume(ip as string);
  } catch (err) {
    const error = createError({
      statusCode: 429,
      statusMessage: "Too Many Requests",
      message: "You have exceeded the rate limit. Please try again later.",
    });
    return sendError(event, error); // Send a structured erro
  }
});
