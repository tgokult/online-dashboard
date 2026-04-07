const Employee = require('../models/Employee');
const Assignment = require('../models/Assignment');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');

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

        await AuditLog.create({
            action: 'EMPLOYEE_CREATED',
            entity: 'Employee',
            entityId: createdEmployee._id,
            entityName: createdEmployee.name,
            details: `${createdEmployee.name} was added to ${createdEmployee.department}.`,
        });

        await Notification.create({
            title: 'Employee Added',
            message: `${createdEmployee.name} joined the asset directory.`,
            type: 'info',
            relatedEntity: 'Employee',
            relatedId: createdEmployee._id,
        });

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

            await AuditLog.create({
                action: 'EMPLOYEE_UPDATED',
                entity: 'Employee',
                entityId: updatedEmployee._id,
                entityName: updatedEmployee.name,
                details: `${updatedEmployee.name}'s employee profile was updated.`,
            });

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
        const activeAssignments = await Assignment.countDocuments({
            employeeId: req.params.id,
            returnDate: null,
        });

        if (activeAssignments > 0) {
            return res.status(400).json({ message: 'Cannot delete an employee with active asset assignments' });
        }

        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (deletedEmployee) {
            await AuditLog.create({
                action: 'EMPLOYEE_DELETED',
                entity: 'Employee',
                entityId: deletedEmployee._id,
                entityName: deletedEmployee.name,
                details: `${deletedEmployee.name} was removed from the employee directory.`,
            });

            res.json({ message: 'Employee removed' });
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee };
