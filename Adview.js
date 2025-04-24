const mongoose = require("mongoose");

const adViewSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  adId: String,
  viewedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AdView", adViewSchema);
