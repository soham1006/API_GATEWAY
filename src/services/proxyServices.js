const axios = require("axios");

const BACKEND_URL = "http://backend:4000";

async function forwardRequest(req) {
  const url = BACKEND_URL + req.originalUrl.replace("/proxy", "");

  const response = await axios({
    method: req.method,
    url,
    headers: { ...req.headers, host: "" },
    data: req.body
  });

  return response;
}

module.exports = { forwardRequest };
