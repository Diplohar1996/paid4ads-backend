const express = require("express");
const router = express.Router();
const AdView = require("../models/AdView");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.sendStatus(401);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.sendStatus(403);
  }
}

router.post("/view-ad", authMiddleware, async (req, res) => {
  await AdView.create({ userId: req.userId, adId: req.body.adId });

  // reward user
  await User.findByIdAndUpdate(req.userId, { $inc: { balance: 1 } });

  res.json({ message: "Ad viewed, +1 balance" });
});

router.get("/balance", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json({ balance: user.balance });
});

module.exports = router;
