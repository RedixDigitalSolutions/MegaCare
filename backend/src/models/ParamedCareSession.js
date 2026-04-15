const mongoose = require("mongoose");
const { Schema } = mongoose;

const ParamedCareSessionSchema = new Schema(
    {
        _id: { type: String, required: true },
        userId: { type: String, required: true },
        patient: { type: String, required: true },
        careType: { type: String, required: true },
        notes: { type: String, default: "" },
        photos: { type: Number, default: 0 },
        signed: { type: Boolean, default: false },
        date: { type: String, default: "" },
        time: { type: String, default: "" },
    },
    { timestamps: true, _id: false }
);

module.exports = mongoose.model("ParamedCareSession", ParamedCareSessionSchema);
