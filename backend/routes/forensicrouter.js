const express = require("express");
const router = express.Router();
const {
  register, login, getUsers, updateUserStatus, deleteUser, updateUser,
  registerCase, getCases, updateCase, deleteCase,
  addEvidence, getEvidences, updateEvidence, deleteEvidence,
  transferToLab, generateAIAnalysis, updateInvestigation, fileLegalDocs,
  analyzeEvidence, uploadLabReport, updateHearingDates, recordVerdict, upload, analyze
} = require("../controller/forensiccontroller");

router.post("/register", register);
router.post("/login", login);
router.get("/users", getUsers);
router.put("/users/:id/status", updateUserStatus);
router.delete("/users/:id", deleteUser);
router.put("/users/:id", updateUser);

// Case Management Routes
router.post("/cases", upload.single('image'), registerCase);
router.get("/cases", getCases);
router.put("/cases/:id", updateCase);
router.delete("/cases/:id", deleteCase);
router.put("/cases/:id/investigation", updateInvestigation);
router.put("/cases/:id/legal", fileLegalDocs);

// Evidence Management Routes
router.post("/evidence", upload.array('images', 10), addEvidence);
router.get("/evidence", getEvidences);
router.put("/evidence/:id", updateEvidence);
router.delete("/evidence/:id", deleteEvidence);
router.put("/evidence/:id/transfer", transferToLab);
router.post("/evidence/:id/ai", generateAIAnalysis);

// Specialized Workflows
router.post("/evidence/:id/report", upload.array("reports", 10), uploadLabReport);
router.post("/evidence/:id/analyze", upload.array("reports", 10), analyzeEvidence);
router.put("/cases/:id/hearing", updateHearingDates);
router.put("/cases/:id/verdict", recordVerdict);
router.post("/analyze", analyze);


module.exports = router;
