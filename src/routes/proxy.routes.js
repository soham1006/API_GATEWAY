const express = require("express");
const apiKeyAuth = require("../middleware/apiKeyAuth");
const rateLimiter = require("../middleware/rateLimiter");
const { forwardRequest } = require("../services/proxyServices");
const Log = require("../models/Log");

const router = express.Router();

router.use(apiKeyAuth, rateLimiter);

router.all("*", async (req, res) => {
  try {
    const response = await forwardRequest(req);

    await Log.create({
      apiKey: req.header("x-api-key"),
      path: req.originalUrl,
      method: req.method,
      statusCode: response.status
    });

    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(500).json({ msg: "Backend service error" });
  }
});

module.exports = router;
