const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema({
    caseId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true, default: "Other" },
    description: { type: String, required: true },
    status: {
        type: String,
        default: "LOGGED",
        enum: ["LOGGED", "COLLECTED", "SENT_TO_LAB", "ANALYZED", "REPORT_READY", "UNDER_INVESTIGATION", "FILED_IN_COURT", "CLOSED"]
    },
    firNumber: { type: String },
    suspects: [{ type: String }],
    investigatingOfficer: { type: String },         
    investigationNotes: { type: String },
    chargeSheet: { type: String },
    legalNotes: { type: String },
    assignedEvidenceTeam: { type: String },
    hearingDates: [{ type: Date }],
    judgment: { type: String },
    courtAuthority: { type: String },
    closedDate: { type: Date },
    caseImage: { type: String },
    aiStrength: { type: String },
    aiPriority: { type: String },
    aiRecommendations: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Case", caseSchema);
