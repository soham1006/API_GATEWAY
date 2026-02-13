const express = require("express");
const Log = require("../models/Log");

const router = express.Router();

router.get("/usage", async (req, res) => {
  try {
    const apiKey = req.header("x-api-key");

    const LIMIT = 100;

    // ✅ start of today in UTC
    const now = new Date();
    const startOfDayUTC = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate()
      )
    );

    // count today's requests
    const requestsToday = await Log.countDocuments({
      apiKey,
      timestamp: { $gte: startOfDayUTC }
    });

    const remaining = Math.max(LIMIT - requestsToday, 0);

    const recent = await Log.find({ apiKey })
      .sort({ timestamp: -1 })
      .limit(10);

    res.json({
      requestsToday,
      remaining,
      limit: LIMIT,
      recent
    });

  } catch (err) {
    res.status(500).json({ msg: "Stats error" });
  }
});

module.exports = router;
