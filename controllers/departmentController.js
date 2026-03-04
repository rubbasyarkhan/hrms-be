import Department from "../models/Department.js";
import Organization from "../models/Organization.js";
import Job from "../models/Job.js";

export const createDepartment = async (req, res) => {
  try {
    const { name, description, organization } = req.body;

    const org = await Organization.findById(organization);
    if (!org) {
      return res
        .status(404)
        .json({ success: false, message: "Organization not found" });
    }

    const department = new Department({
      name,
      description,
      organization,
    });

    await department.save();
    res.status(201).json({ success: true, data: department });
  } catch (error) {
    console.error("Error creating department:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getDepartments = async (req, res) => {
  try {
    const { organizationId } = req.query;
    const filter = organizationId ? { organization: organizationId } : {};

    const departments = await Department.find(filter).populate(
      "organization",
      "clientName companyName",
    );
    res.json({ success: true, data: departments });
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate(
      "organization",
      "clientName companyName",
    );

    if (!department) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }

    res.json({ success: true, data: department });
  } catch (error) {
    console.error("Error fetching department:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true },
    );

    if (!department) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }

    res.json({ success: true, data: department });
  } catch (error) {
    console.error("Error updating department:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);

    if (!department) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }

    res.json({ success: true, message: "Department deleted successfully" });
  } catch (error) {
    console.error("Error deleting department:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get department statistics
export const getDepartmentStats = async (req, res) => {
  try {
    const totalDepartments = await Department.countDocuments();

    // Departments by organization
    const deptsByOrg = await Department.aggregate([
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
        $project: {
          organizationName: "$org.companyName",
          departmentCount: "$count",
        },
      },
    ]);

    // Jobs by department
    const jobsByDept = await Job.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "departments",
          localField: "_id",
          foreignField: "_id",
          as: "dept",
        },
      },
      { $unwind: "$dept" },
      { $project: { departmentName: "$dept.name", jobCount: "$count" } },
    ]);

    res.json({
      success: true,
      data: {
        total: totalDepartments,
        byOrganization: deptsByOrg,
        jobsByDepartment: jobsByDept,
      },
    });
  } catch (error) {
    console.error("Error fetching department stats:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
