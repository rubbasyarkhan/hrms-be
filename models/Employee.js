import mongoose from "mongoose";

const emergencyContactSchema = new mongoose.Schema(
  {
    contactName: { type: String },
    relationship: { type: String },
    phone1: { type: String },
    phone2: { type: String },
  },
  { _id: false },
);

const employeeSchema = new mongoose.Schema(
  {
    joiningDate: { type: Date, required: true },
    name: { type: String, required: true },
    fatherName: { type: String },
    address: { type: String },
    postCode: { type: String },
    homePhone: { type: String },
    email: { type: String, required: true, unique: true },
    dateOfBirth: { type: Date },
    cnic: { type: String },
    emergencyContacts: {
      type: [emergencyContactSchema],
      default: [],
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    profilePicture: { type: String },
    resume: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("Employee", employeeSchema);
