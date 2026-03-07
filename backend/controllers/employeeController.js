const Employee = require('../models/Employee');

const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({});
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (employee) res.json(employee);
        else res.status(404).json({ message: 'Employee not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createEmployee = async (req, res) => {
    const { name, email, department } = req.body;
    try {
        const existing = await Employee.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Employee email already exists' });

        const employee = new Employee({ name, email, department });
        const createdEmployee = await employee.save();
        res.status(201).json(createdEmployee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateEmployee = async (req, res) => {
    const { name, email, department } = req.body;
    try {
        const employee = await Employee.findById(req.params.id);
        if (employee) {
            employee.name = name || employee.name;
            employee.email = email || employee.email;
            employee.department = department || employee.department;

            const updatedEmployee = await employee.save();
            res.json(updatedEmployee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (deletedEmployee) {
            res.json({ message: 'Employee removed' });
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee };
