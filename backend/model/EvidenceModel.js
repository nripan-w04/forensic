const mongoose = require("mongoose");

const evidenceSchema = new mongoose.Schema({
    evidenceId: { type: String, required: true, unique: true },
    caseId: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    collectedBy: { type: String, required: true },
    collectedDate: { type: String, required: true },
    status: {
        type: String,
        default: "LOGGED",
        enum: ["LOGGED", "COLLECTED", "SENT_TO_LAB", "ANALYZED"]
    },
    barcode: { type: String },
    qrCode: { type: String },
    transferStatus: { type: String, default: "In Custody" },
    images: [{ type: String }],
    aiAnalysis: { type: String },
    findingsSummary: { type: String },
    analystName: { type: String },
    chainOfCustody: [{
        from: String,
        to: String,
        date: { type: Date, default: Date.now },
        purpose: String
    }],
    labReports: [String],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Evidence", evidenceSchema);
