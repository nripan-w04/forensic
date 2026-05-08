const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();    


const analyzeForensicData = async (text, analysisType) => {
    let prompt = "";

    if (analysisType === "strength") {
        prompt = `Analyze Case Strength: ${text}\nFormat: SCORE, CATEGORY, JUDGMENT, SUMMARY.`;
    } else if (analysisType === "priority") {
        prompt = `Predict Investigation Priority: ${text}\nFormat: INVESTIGATION PRIORITY, REASONING.`;
    } else if (analysisType === "evidence") {
        prompt = `Recommend Missing Evidence: ${text}\nFormat: MISSING EVIDENCE RECOMMENDATIONS.`;
    } else {
        prompt = `Comprehensive Forensic Analysis: ${text}`;
    }

    const response = await axios.post(process.env.GROQ_URL, {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: "You are a forensic legal analyst." }, { role: "user", content: prompt }],
        temperature: 0.5
    }, {
        headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" }
    });

    return response.data.choices[0].message.content;
};

module.exports = { analyzeForensicData };
