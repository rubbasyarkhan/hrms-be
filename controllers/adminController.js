import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ message: "Invalid input format" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // Set token in httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Railway = HTTPS → always true
      sameSite: "none", // REQUIRED for cross-site
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Send response WITHOUT token in body
    res.json({
      message: "Login successful",
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyAuth = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({
      authenticated: true,
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error("Verify auth error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
