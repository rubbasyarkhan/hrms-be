import mongoose from "mongoose";
import Admin from "./models/Admin.js";
import dotenv from "dotenv";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const existingAdmin = await Admin.findOne({
      email: process.env.ADMIN_EMAIL,
    });

    if (!existingAdmin) {
      const newAdmin = new Admin({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      });
      await newAdmin.save();
      console.log("Admin seeded successfully");
    } else {
      console.log("Admin already exists");
    }
    process.exit();
  } catch (err) {
    console.error("Error seeding admin:", err);
    process.exit(1);
  }
};

seedAdmin();
