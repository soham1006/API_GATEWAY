const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ msg: "User exists" });

  const hashed = await bcrypt.hash(password, 10);
  const apiKey = crypto.randomBytes(24).toString("hex");


  const user = await User.create({
    email,
    password: hashed,
    apiKey
  });

  res.json({ msg: "Registered", apiKey: user.apiKey });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ msg: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.json({ token, apiKey: user.apiKey });
});

module.exports = router;
