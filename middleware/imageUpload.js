import multer from "multer";

const storage = multer.memoryStorage();

// File filter to accept only image files
const imageFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, and WebP image files are allowed"), false);
  }
};

// Configure upload with 5MB size limit
const imageUpload = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 6 * 1024 * 1024, // 6MB
  },
});

export default imageUpload;
