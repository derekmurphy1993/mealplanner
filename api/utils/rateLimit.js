import { errorHandler } from "./error.js";

export const createRateLimiter = ({
  windowMs,
  max,
  message = "Too many requests. Try again later.",
  keyGenerator,
} = {}) => {
  const windowSize = Number(windowMs) || 15 * 60 * 1000;
  const maxRequests = Number(max) || 100;
  const getKey =
    keyGenerator ||
    ((req) => req.ip || req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown");

  const hits = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const key = String(getKey(req));
    const current = hits.get(key);

    if (!current || now >= current.resetAt) {
      hits.set(key, { count: 1, resetAt: now + windowSize });
      return next();
    }

    if (current.count >= maxRequests) {
      const retryAfterSeconds = Math.ceil((current.resetAt - now) / 1000);
      if (retryAfterSeconds > 0) {
        res.set("Retry-After", String(retryAfterSeconds));
      }
      return next(errorHandler(429, message));
    }

    current.count += 1;
    hits.set(key, current);
    return next();
  };
};
