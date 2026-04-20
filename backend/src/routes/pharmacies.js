const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET /api/pharmacies — list approved pharmacies
router.get("/", async (req, res) => {
  const filter = { role: "pharmacy", status: "approved" };
  if (req.query.wilaya) filter.wilaya = req.query.wilaya;
  if (req.query.city) filter.city = req.query.city;
  if (req.query.governorate) filter.governorate = { $regex: String(req.query.governorate).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
  if (req.query.delegation) filter.delegation = { $regex: String(req.query.delegation).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };

  const pharmacies = await User.find(filter)
    .select("-password")
    .sort({ companyName: 1 })
    .lean();

  res.json(
    pharmacies.map((p) => ({
      id: p._id,
      name: p.companyName || `${p.firstName} ${p.lastName}`,
      address: p.address || "",
      governorate: p.governorate || "",
      delegation: p.delegation || "",
      coordinates: p.coordinates || null,
      phone: p.phone || "",
      wilaya: p.wilaya || "",
      city: p.city || "",
      openingHours: p.openingHours || "",
      isOnDuty: p.isOnDuty || false,
      description: p.description || "",
      avatar: p.avatar || "",
      mapsUrl: p.mapsUrl || "",
    })),
  );
});

// GET /api/pharmacies/nearby?lat=&lng=&radius=
router.get("/nearby", async (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lng = parseFloat(req.query.lng);
  const radius = parseFloat(req.query.radius) || 10; // km

  if (isNaN(lat) || isNaN(lng)) {
    return res.status(400).json({ message: "lat et lng sont requis" });
  }

  const pharmacies = await User.find({ role: "pharmacy", status: "approved" })
    .select("-password")
    .lean();

  // Filter by distance (Haversine)
  const toRad = (d) => (d * Math.PI) / 180;
  const nearby = pharmacies
    .map((p) => {
      if (!p.coordinates?.lat || !p.coordinates?.lng) return null;
      const dLat = toRad(p.coordinates.lat - lat);
      const dLng = toRad(p.coordinates.lng - lng);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat)) *
          Math.cos(toRad(p.coordinates.lat)) *
          Math.sin(dLng / 2) ** 2;
      const dist = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      if (dist > radius) return null;
      return {
        id: p._id,
        name: p.companyName || `${p.firstName} ${p.lastName}`,
        address: p.address || "",
        coordinates: p.coordinates,
        phone: p.phone || "",
        wilaya: p.wilaya || "",
        city: p.city || "",
        openingHours: p.openingHours || "",
        isOnDuty: p.isOnDuty || false,
        description: p.description || "",
        avatar: p.avatar || "",
        mapsUrl: p.mapsUrl || "",
        distance: Math.round(dist * 10) / 10, // km, 1 decimal
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.distance - b.distance);

  res.json(nearby);
});

// GET /api/pharmacies/:id
router.get("/:id", async (req, res) => {
  const p = await User.findOne({ _id: req.params.id, role: "pharmacy" })
    .select("-password")
    .lean();
  if (!p) return res.status(404).json({ message: "Pharmacie non trouvée" });
  res.json({
    id: p._id,
    name: p.companyName || `${p.firstName} ${p.lastName}`,
    address: p.address || "",
    coordinates: p.coordinates || null,
    phone: p.phone || "",
    wilaya: p.wilaya || "",
    city: p.city || "",
    openingHours: p.openingHours || "",
    isOnDuty: p.isOnDuty || false,
    description: p.description || "",
    avatar: p.avatar || "",
    mapsUrl: p.mapsUrl || "",
  });
});

module.exports = router;
