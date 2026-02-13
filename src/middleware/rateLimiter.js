const limits = {};

const WINDOW_SIZE = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100;

module.exports = (req, res, next) => {
  const apiKey = req.header("x-api-key");
  const now = Date.now();

  if (!limits[apiKey]) {
    limits[apiKey] = { count: 1, startTime: now };
    return next();
  }

  const diff = now - limits[apiKey].startTime;

  if (diff > WINDOW_SIZE) {
    limits[apiKey] = { count: 1, startTime: now };
    return next();
  }

  if (limits[apiKey].count >= MAX_REQUESTS) {
    return res.status(429).json({ msg: "Rate limit exceeded" });
  }

  limits[apiKey].count++;
  next();
};
