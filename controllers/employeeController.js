import Employee from "../models/Employee.js";

// Create a new employee
export const createEmployee = async (req, res) => {
  try {
    const {
      joiningDate,
      name,
      fatherName,
      address,
      postCode,
      homePhone,
      email,
      dateOfBirth,
      cnic,
      emergencyContacts,
      department,
      organization,
      profilePicture,
      resume,
    } = req.body;

    const employee = new Employee({
      joiningDate,
      name,
      fatherName,
      address,
      postCode,
      homePhone,
      email,
      dateOfBirth,
      cnic,
      emergencyContacts: emergencyContacts || [],
      department: department || undefined,
      organization,
      profilePicture,
      resume,
    });

    await employee.save();
    await employee.populate([
      { path: "department", select: "name" },
      { path: "organization", select: "companyName" },
    ]);
    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An employee with this email already exists.",
      });
    }
    console.error("Error creating employee:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all employees (with optional search/filter)
export const getEmployees = async (req, res) => {
  try {
    const { search, department, organization } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (organization) filter.organization = organization;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { cnic: { $regex: search, $options: "i" } },
      ];
    }

    const employees = await Employee.find(filter)
      .populate([
        { path: "department", select: "name" },
        { path: "organization", select: "companyName" },
      ])
      .sort({ createdAt: -1 });

    res.json({ success: true, data: employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get single employee
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate([
      { path: "department", select: "name" },
      { path: "organization", select: "companyName" },
    ]);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }
    res.json({ success: true, data: employee });
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update employee
export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true },
    ).populate([
      { path: "department", select: "name" },
      { path: "organization", select: "companyName" },
    ]);

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }
    res.json({ success: true, data: employee });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete employee
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }
    res.json({ success: true, message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
