import mongoose from "mongoose";
import Admin from "./models/Admin.js";
import dotenv from "dotenv";

dotenv.config();

const ADMIN_EMAIL = "admin@hrms.com";
const ADMIN_PASSWORD = "Admin@1234";

const seedAdmin = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB ✓");

    // Remove ALL existing admin accounts to start fresh
    const deleted = await Admin.deleteMany({});
    console.log(`Removed ${deleted.deletedCount} existing admin account(s).`);

    // Create the new admin
    const newAdmin = new Admin({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    await newAdmin.save();

    console.log("✅ New admin seeded successfully!");
    console.log("----------------------------------");
    console.log(`  Email   : ${ADMIN_EMAIL}`);
    console.log(`  Password: ${ADMIN_PASSWORD}`);
    console.log("----------------------------------");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
    process.exit(1);
  }
};

seedAdmin();
