import Organization from "../models/Organization.js";
import Job from "../models/Job.js";
import Department from "../models/Department.js";
import Candidate from "../models/Candidate.js";

export const createOrganization = async (req, res) => {
  try {
    const { clientName, companyName } = req.body;
    const newOrg = new Organization({ clientName, companyName });
    await newOrg.save();
    res.status(201).json(newOrg);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getOrganizations = async (req, res) => {
  try {
    const orgs = await Organization.find();
    res.json({ success: true, data: orgs });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getOrganizationById = async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id);
    if (!org)
      return res
        .status(404)
        .json({ success: false, message: "Organization not found" });
    res.json({ success: true, data: org });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateOrganization = async (req, res) => {
  try {
    const updatedOrg = await Organization.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.json(updatedOrg);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteOrganization = async (req, res) => {
  try {
    await Organization.findByIdAndDelete(req.params.id);
    res.json({ message: "Organization deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getOrganizationStats = async (req, res) => {
  try {
    const totalOrganizations = await Organization.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalDepartments = await Department.countDocuments();
    const totalCandidates = await Candidate.countDocuments();

    const jobsByOrg = await Job.aggregate([
      { $group: { _id: "$organization", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "organizations",
          localField: "_id",
          foreignField: "_id",
          as: "org",
        },
      },
      { $unwind: "$org" },
      {
        $project: { organizationName: "$org.companyName", jobCount: "$count" },
      },
    ]);

    res.json({
      success: true,
      data: {
        total: totalOrganizations,
        totalJobs,
        totalDepartments,
        totalCandidates,
        jobsByOrganization: jobsByOrg,
      },
    });
  } catch (error) {
    console.error("Error fetching organization stats:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
