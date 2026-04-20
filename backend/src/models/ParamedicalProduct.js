const mongoose = require("mongoose");

const paramedicalProductSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true },
        catalogItemId: { type: String, default: "" },
        userId: { type: String, default: "" },
        name: { type: String, required: true },
        brand: { type: String, default: "" },
        category: { type: String, default: "" },
        price: { type: Number, required: true },
        originalPrice: { type: Number, default: null },
        rating: { type: Number, default: 4.5 },
        reviews: { type: Number, default: 0 },
        inStock: { type: Boolean, default: true },
        stockQty: { type: Number, default: 0 },
        prescription: { type: Boolean, default: false },
        imageUrl: { type: String, default: "" },
        shortDesc: { type: String, default: "" },
        description: { type: String, default: "" },
        usage: { type: String, default: "" },
        compatibility: { type: String, default: "" },
        features: { type: [String], default: [] },
        images: { type: [String], default: [] },
        deliveryDays: { type: String, default: "48h" },
    },
    { timestamps: true, _id: false }
);

module.exports = mongoose.model("ParamedicalProduct", paramedicalProductSchema);
