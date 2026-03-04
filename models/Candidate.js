import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    experience: { type: String, required: true },
    skills: { type: [String], required: true },
    salaryOffered: { type: String, required: true },
    joiningDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Candidate", "Employee"],
      default: "Candidate",
    },
    notes: { type: String },
    resume: { type: String },
    profilePicture: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("Candidate", candidateSchema);
