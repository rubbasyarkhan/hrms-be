import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    companyName: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("Organization", organizationSchema);
