import Job from "../models/Job.js";
import Department from "../models/Department.js";

export const createJob = async (req, res) => {
  try {
    const newJob = new Job(req.body);
    await newJob.save();
    res.status(201).json(newJob);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getJobs = async (req, res) => {
  try {
    const {
      organizationId,
      department,
      jobType,
      jobStatus,
      location,
      experience,
      search,
    } = req.query;
    const filter = {};

    if (organizationId) filter.organization = organizationId;

    if (department) {
      const dept = await Department.findOne({
        name: { $regex: department, $options: "i" },
      });
      if (dept) {
        filter.department = dept._id;
      } else {
        return res.json({
          success: true,
          data: [],
          message: "No jobs found for this department",
        });
      }
    }

    if (jobType) filter.jobType = jobType;
    if (jobStatus) filter.jobStatus = jobStatus;
    if (location) filter.jobLocation = { $regex: location, $options: "i" };
    if (experience)
      filter.experienceRequired = { $regex: experience, $options: "i" };

    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [{ jobTitle: searchRegex }, { jobDescription: searchRegex }];
    }

    const jobs = await Job.find(filter)
      .populate("organization", "clientName companyName")
      .populate("department", "name description");

    res.json({ success: true, data: jobs, count: jobs.length });
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("organization")
      .populate("department");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateJob = async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getJobStats = async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments();
    const openJobs = await Job.countDocuments({ jobStatus: "Open" });
    const closedJobs = await Job.countDocuments({ jobStatus: "Closed" });

    res.json({
      success: true,
      data: {
        total: totalJobs,
        open: openJobs,
        closed: closedJobs,
      },
    });
  } catch (error) {
    console.error("Error fetching job stats:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const closeJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { jobStatus: "Closed" },
      { new: true, runValidators: true },
    );

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.json({
      success: true,
      message: "Job closed successfully",
      data: job,
    });
  } catch (error) {
    console.error("Error closing job:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
