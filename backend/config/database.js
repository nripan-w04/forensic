const mongoose = require("mongoose");
const User = require("../model/UserModel");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
async function database() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Database connected");

        // Seed Admin User
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminExists = await User.findOne({ email: adminEmail });

        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
            
            const admin = new User({
                name: "System Admin",
                phone: "000-000-0000",
                address: "HQ Command Center",
                email: adminEmail,
                password: hashedPassword,
                role: "Admin",
                status: "Approved"
            });
            await admin.save();
            console.log("Admin user seeded successfully with hashed password");
        }
    } catch (err) {
        console.log("Database connection error:", err);
    }
}

module.exports = database;