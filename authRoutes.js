const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Register
router.post('/register', async (req, res) => {
  const { username, email, password, referred_by } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User exists" });

  const user = await User.create({
    username,
    email,
    password,
    referralCode: generateCode(),
    referredBy: referred_by || null
  });

  // Give referral bonus
  if (referred_by) {
    const refUser = await User.findOne({ referralCode: referred_by });
    if (refUser) {
      refUser.wallet += 0.50;
      await refUser.save();
    }
  }

  res.json({ message: "Registered successfully" });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, user });
});

// Reward (watch ad)
router.post('/reward', auth, async (req, res) => {
  const { amount } = req.body;
  req.user.wallet += amount;
  await req.user.save();
  res.json({ user: req.user });
});

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

module.exports = router;
