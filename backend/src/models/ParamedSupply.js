const mongoose = require("mongoose");
const { Schema } = mongoose;

const ParamedSupplySchema = new Schema(
    {
        _id: { type: String, required: true },
        userId: { type: String, required: true },
        name: { type: String, required: true },
        category: { type: String, default: "" },
        current: { type: Number, default: 0 },
        max: { type: Number, default: 100 },
        unit: { type: String, default: "unité" },
        level: { type: String, enum: ["ok", "low", "critical"], default: "ok" },
        ordered: { type: Boolean, default: false },
    },
    { timestamps: true, _id: false }
);

module.exports = mongoose.model("ParamedSupply", ParamedSupplySchema);
