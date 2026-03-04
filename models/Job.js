import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    jobTitle: { type: String, required: true },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    jobDescription: { type: String, required: true },
    jobType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Contract"],
      required: true,
    },
    jobLocation: { type: String, required: true },
    experienceRequired: { type: String, required: true },
    salaryRange: { type: String, required: true },
    jobStatus: { type: String, enum: ["Open", "Closed"], default: "Open" },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    profileImage: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("Job", jobSchema);
