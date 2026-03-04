import Candidate from "../models/Candidate.js";

export const createCandidate = async (req, res) => {
  try {
    const newCandidate = new Candidate(req.body);
    await newCandidate.save();
    res.status(201).json(newCandidate);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getCandidates = async (req, res) => {
  try {
    const { jobId, status, skills, experience, organizationId, search } =
      req.query;
    const filter = {};

    if (jobId) filter.job = jobId;
    if (status) filter.status = status;
    if (experience) filter.experience = { $regex: experience, $options: "i" };
    if (organizationId) filter.organization = organizationId;

    if (skills) {
      const skillsArray = skills.split(",").map((s) => s.trim());
      filter.skills = { $in: skillsArray };
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { resume: searchRegex },
      ];
    }

    const candidates = await Candidate.find(filter)
      .populate("job", "jobTitle jobType")
      .populate("organization", "clientName companyName");

    res.json({ success: true, data: candidates, count: candidates.length });
  } catch (err) {
    console.error("Error fetching candidates:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

export const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id)
      .populate(
        "job",
        "jobTitle jobType jobLocation salaryRange experienceRequired jobDescription",
      )
      .populate("organization", "clientName companyName");

    if (!candidate) {
      return res
        .status(404)
        .json({ success: false, message: "Candidate not found" });
    }

    res.json({ success: true, data: candidate });
  } catch (err) {
    console.error("Error fetching candidate by ID:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

export const updateCandidate = async (req, res) => {
  try {
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.json(updatedCandidate);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteCandidate = async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ message: "Candidate deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getCandidateStats = async (req, res) => {
  try {
    const totalCandidates = await Candidate.countDocuments();
    const candidatesByStatus = await Candidate.countDocuments({
      status: "Candidate",
    });
    const employeesByStatus = await Candidate.countDocuments({
      status: "Employee",
    });

    // Candidates by job
    const candidatesByJob = await Candidate.aggregate([
      { $group: { _id: "$job", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },
      { $project: { jobTitle: "$job.jobTitle", candidateCount: "$count" } },
      { $sort: { candidateCount: -1 } },
      { $limit: 10 },
    ]);

    // Most common skills
    const topSkills = await Candidate.aggregate([
      { $unwind: "$skills" },
      { $group: { _id: "$skills", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { skill: "$_id", count: 1, _id: 0 } },
    ]);

    res.json({
      success: true,
      data: {
        total: totalCandidates,
        byStatus: {
          candidates: candidatesByStatus,
          employees: employeesByStatus,
        },
        candidatesByJob,
        topSkills,
      },
    });
  } catch (error) {
    console.error("Error fetching candidate stats:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
