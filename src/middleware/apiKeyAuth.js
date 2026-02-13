const User = require("../models/User");

module.exports = async (req, res, next) => {
  const apiKey = req.header("x-api-key");

  if (!apiKey) {
    return res.status(401).json({ msg: "API key missing" });
  }

  const user = await User.findOne({ apiKey });
  if (!user) {
    return res.status(401).json({ msg: "Invalid API key" });
  }

  req.user = user;
  next();
};
