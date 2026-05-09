const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Cart = require("../models/Cart");

// GET /api/cart — load the authenticated user's saved cart
router.get("/", auth, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id }).lean();
  res.json({
    pharmaItems: Array.isArray(cart?.pharmaItems) ? cart.pharmaItems : [],
    paraItems: Array.isArray(cart?.paraItems) ? cart.paraItems : [],
  });
});

// PUT /api/cart — persist the authenticated user's cart
router.put("/", auth, async (req, res) => {
  const { pharmaItems, paraItems } = req.body;

  if (pharmaItems !== undefined && !Array.isArray(pharmaItems)) {
    return res.status(400).json({ message: "pharmaItems must be an array" });
  }
  if (paraItems !== undefined && !Array.isArray(paraItems)) {
    return res.status(400).json({ message: "paraItems must be an array" });
  }

  const update = {};
  if (pharmaItems !== undefined) update.pharmaItems = pharmaItems;
  if (paraItems !== undefined) update.paraItems = paraItems;

  await Cart.findOneAndUpdate(
    { userId: req.user.id },
    { $set: update },
    { upsert: true, new: true },
  );

  res.json({ message: "Cart saved" });
});

module.exports = router;
