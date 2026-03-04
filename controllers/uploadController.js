import cloudinary from "../config/cloudinary.js";

// Upload resume to Cloudinary
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Convert buffer to base64
    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: "hrms/resumes",
      resource_type: "auto",
    });

    res.json({
      message: "Resume uploaded successfully",
      url: uploadResponse.secure_url,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Error uploading resume" });
  }
};

// Upload job image to Cloudinary
export const uploadJobImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Convert buffer to base64
    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: "hrms/job-images",
      resource_type: "image",
    });

    res.json({
      message: "Job image uploaded successfully",
      url: uploadResponse.secure_url,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Error uploading job image" });
  }
};
