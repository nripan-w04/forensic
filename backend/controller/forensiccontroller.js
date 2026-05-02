const User = require("../model/UserModel");
const Case = require("../model/CaseModel");
const Evidence = require("../model/EvidenceModel");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs");
const socketConfig = require("../config/socket");

// Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

const register = async (req, res) => {
    try {
        const { name, phone, address, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Credential conflict detected" });
        }

        // Secure password hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ name, phone, address, email, password: hashedPassword, role });
        await user.save();
        res.status(201).json({ message: "Personnel Enrollment Successful", user });
    } catch (error) {
        res.status(500).json({ message: "System Error during Registration", error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "invalid credentials" });
        }
        if (user.role !== role) {
            return res.status(401).json({ message: "Access Denied: Incorrect role for this user" });
        }
        if (user.role !== 'Admin' && user.status !== 'Approved') {
            return res.status(403).json({ message: "Account pending approval or rejected." });
        }
        res.status(200).json({ message: "Clearance Granted", user });
    } catch (error) {
        res.status(500).json({ message: "Terminal Access Error", error: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'Admin' } });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching personnel", error: error.message });
    }
};

const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        console.log(`Updating user ${id} to status ${status}`);

        const user = await User.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: "Personnel record not found" });
        }

        res.status(200).json({ message: `Personnel status updated to ${status}`, user });
    } catch (error) {
        console.error("Status Update Error:", error);
        res.status(500).json({ message: "Error updating status", error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        // Don't update password through this route
        delete updates.password;

        const user = await User.findByIdAndUpdate(id, updates, { new: true });
        res.status(200).json({ message: "User profile updated", user });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
};

const registerCase = async (req, res) => {
    try {
        const { title, date, location, category, description, firNumber, suspects, investigatingOfficer } = req.body;

        // Generate a random 4-digit case ID like C-8821
        const caseId = 'C-' + Math.floor(1000 + Math.random() * 9000);

        const newCase = new Case({
            caseId, title, date, location, category, description,
            firNumber, suspects, investigatingOfficer,
            status: "OPEN"
        });
        await newCase.save();
        res.status(201).json({ message: "Case registered securely", case: newCase });
    } catch (error) {
        res.status(500).json({ message: "Error registering case", error: error.message });
    }
};

const getCases = async (req, res) => {
    try {
        const cases = await Case.find().sort({ createdAt: -1 });
        res.status(200).json(cases);
    } catch (error) {
        res.status(500).json({ message: "Error fetching cases", error: error.message });
    }
};

const updateCase = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCase = await Case.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ message: "Case updated successfully", case: updatedCase });
    } catch (error) {
        res.status(500).json({ message: "Error updating case", error: error.message });
    }
};

const deleteCase = async (req, res) => {
    try {
        const { id } = req.params;
        await Case.findByIdAndDelete(id);
        res.status(200).json({ message: "Case deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting case", error: error.message });
    }
};

const addEvidence = async (req, res) => {
    try {
        const payload = req.body;
        const evidenceId = 'E-' + Math.floor(1000 + Math.random() * 9000);
        const newEvidence = new Evidence({
            ...payload,
            evidenceId,
            chainOfCustody: [{
                from: "Crime Scene",
                to: payload.collectedBy,
                purpose: "Initial Collection"
            }]
        });
        await newEvidence.save();

        // Update case status to COLLECTED
        const updatedCase = await Case.findOneAndUpdate({ caseId: payload.caseId }, { status: "COLLECTED" }, { new: true });

        // Emit Socket Event
        socketConfig.getIo().emit('evidence_added', { caseId: payload.caseId, evidence: newEvidence });
        socketConfig.getIo().emit('case_status_updated', { caseId: payload.caseId, status: "COLLECTED" });

        res.status(201).json({ message: "Evidence logged securely", evidence: newEvidence });
    } catch (error) {
        res.status(500).json({ message: "Error logging evidence", error: error.message });
    }
};

const getEvidences = async (req, res) => {
    try {
        const evidences = await Evidence.find().sort({ createdAt: -1 });
        res.status(200).json(evidences);
    } catch (error) {
        res.status(500).json({ message: "Error fetching evidence", error: error.message });
    }
};

const updateEvidence = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Evidence.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ message: "Evidence updated", evidence: updated });
    } catch (error) {
        res.status(500).json({ message: "Error updating evidence", error: error.message });
    }
};

const deleteEvidence = async (req, res) => {
    try {
        const { id } = req.params;
        await Evidence.findByIdAndDelete(id);
        res.status(200).json({ message: "Evidence deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting evidence", error: error.message });
    }
};

// Lab & Court Specific Controllers
const uploadLabReport = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }
        const filePaths = req.files.map(file => file.path);
        const evidence = await Evidence.findByIdAndUpdate(
            id,
            {
                $push: { labReports: { $each: filePaths } },
                status: "ANALYZED"
            },
            { new: true }
        );

        // Update Case status to REPORT_READY
        const updatedCase = await Case.findOneAndUpdate({ caseId: evidence.caseId }, { status: "REPORT_READY" }, { new: true });

        // Emit Socket Event
        socketConfig.getIo().emit('report_uploaded', { caseId: evidence.caseId, evidenceId: evidence.evidenceId });
        socketConfig.getIo().emit('case_status_updated', { caseId: evidence.caseId, status: "REPORT_READY" });

        res.status(200).json({ message: "Lab report uploaded successfully", evidence });
    } catch (error) {
        res.status(500).json({ message: "Error uploading report", error: error.message });
    }
};

const updateHearingDates = async (req, res) => {
    try {
        const { id } = req.params;
        const { date } = req.body;
        const updatedCase = await Case.findByIdAndUpdate(
            id,
            { $push: { hearingDates: date } },
            { new: true }
        );
        res.status(200).json({ message: "Hearing date added", case: updatedCase });
    } catch (error) {
        res.status(500).json({ message: "Error adding hearing date", error: error.message });
    }
};

const recordVerdict = async (req, res) => {
    try {
        const { id } = req.params;
        const { judgment } = req.body;
        const updatedCase = await Case.findByIdAndUpdate(
            id,
            {
                judgment,
                status: "CLOSED",
                closedDate: new Date()
            },
            { new: true }
        );
        res.status(200).json({ message: "Final judgment recorded", case: updatedCase });
    } catch (error) {
        res.status(500).json({ message: "Error recording judgment", error: error.message });
    }
};

const transferToLab = async (req, res) => {
    try {
        const { id } = req.params;
        const { to, purpose } = req.body;
        const evidence = await Evidence.findById(id);
        if (!evidence) return res.status(404).json({ message: "Evidence not found" });

        evidence.status = "SENT_TO_LAB";
        evidence.transferStatus = "Transferred";
        evidence.chainOfCustody.push({
            from: evidence.collectedBy,
            to: to,
            purpose: purpose || "Forensic Analysis"
        });

        await evidence.save();

        // Update case status
        const updatedCase = await Case.findOneAndUpdate({ caseId: evidence.caseId }, { status: "SENT_TO_LAB" }, { new: true });

        // Emit Socket Event
        socketConfig.getIo().emit('evidence_transferred', { caseId: evidence.caseId, evidenceId: evidence.evidenceId, to });
        socketConfig.getIo().emit('case_status_updated', { caseId: evidence.caseId, status: "SENT_TO_LAB" });

        res.status(200).json({ message: "Evidence transferred to lab", evidence });
    } catch (error) {
        res.status(500).json({ message: "Transfer error", error: error.message });
    }
};

const generateAIAnalysis = async (req, res) => {
    try {
        const { id } = req.params;
        const evidence = await Evidence.findById(id);
        if (!evidence) return res.status(404).json({ message: "Evidence not found" });

        // Simulated AI analysis "API Call"
        setTimeout(async () => {
            let analysis = "";
            const type = evidence.type.toLowerCase();

            if (type.includes("dna") || type.includes("blood")) {
                analysis = "AI ANALYSIS: Biological markers detected. High probability of match with CODIS database. Recommended: STR analysis for definitive identification. Estimated accuracy: 99.8%.";
            } else if (type.includes("weapon") || type.includes("fingerprint")) {
                analysis = "AI ANALYSIS: Structural integrity check complete. Latent prints extracted from trigger/grip. Database cross-reference suggests potential link to prior Case #C-4421. Recommended: Ballistics comparison.";
            } else if (type.includes("digital") || type.includes("phone")) {
                analysis = "AI ANALYSIS: Encrypted partitions detected. Decryption heuristic active. Metadata indicates location coordinates mismatching with witness statement. High-priority files flagged in /hidden_root/.";
            } else {
                analysis = "AI ANALYSIS: Pattern recognition confirms anomalous characteristics. Recommend chemical spectral analysis. No direct matches found in current local database; searching international registries.";
            }

            evidence.aiAnalysis = analysis;
            await evidence.save();

            // Emit Socket Event when "API" finishes
            socketConfig.getIo().emit('ai_analysis_complete', { caseId: evidence.caseId, evidenceId: evidence.evidenceId, analysis });
        }, 1500);

        res.status(200).json({ message: "AI Diagnostic initiated. Processing results..." });
    } catch (error) {
        res.status(500).json({ message: "AI Diagnostic Error", error: error.message });
    }
};

const updateInvestigation = async (req, res) => {
    try {
        const { id } = req.params;
        const { notes, suspects } = req.body;
        const updatedCase = await Case.findByIdAndUpdate(
            id,
            {
                investigationNotes: notes,
                $addToSet: { suspects: { $each: suspects || [] } },
                status: "UNDER_INVESTIGATION"
            },
            { new: true }
        );
        res.status(200).json({ message: "Investigation updated", case: updatedCase });
    } catch (error) {
        res.status(500).json({ message: "Error updating investigation", error: error.message });
    }
};

const fileLegalDocs = async (req, res) => {
    try {
        const { id } = req.params;
        const { chargeSheet, legalNotes } = req.body;
        const updatedCase = await Case.findByIdAndUpdate(
            id,
            {
                chargeSheet,
                legalNotes,
                status: "FILED_IN_COURT"
            },
            { new: true }
        );
        res.status(200).json({ message: "Legal documents filed", case: updatedCase });
    } catch (error) {
        res.status(500).json({ message: "Error filing legal docs", error: error.message });
    }
};

const analyzeEvidence = async (req, res) => {
    try {
        const { id } = req.params;
        const { findingsSummary, analystName } = req.body;
        
        const updateData = {
            findingsSummary,
            analystName,
            status: "ANALYZED"
        };

        // If files are uploaded, push them to the array
        if (req.files && req.files.length > 0) {
            const filePaths = req.files.map(file => file.path);
            updateData.$push = { labReports: { $each: filePaths } };
        }

        const evidence = await Evidence.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        // Update Case status to REPORT_READY
        await Case.findOneAndUpdate({ caseId: evidence.caseId }, { status: "REPORT_READY" });

        // Emit Socket Event
        socketConfig.getIo().emit('evidence_analyzed', { caseId: evidence.caseId, evidenceId: evidence.evidenceId });

        res.status(200).json({ message: "Forensic results sent to Authority", evidence });
    } catch (error) {
        res.status(500).json({ message: "Error analyzing evidence", error: error.message });
    }
};

module.exports = {
    register, login, getUsers, updateUserStatus, deleteUser, updateUser,
    registerCase, getCases, updateCase, deleteCase,
    addEvidence, getEvidences, updateEvidence, deleteEvidence,
    uploadLabReport, updateHearingDates, recordVerdict, upload,
    transferToLab, generateAIAnalysis, updateInvestigation, fileLegalDocs,
    analyzeEvidence
};
