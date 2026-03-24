const Assignment = require('../models/Assignment');

// Controller for fetching assignments for a specific user
//NEEDS TESTING
const getAssignmentsByUser = async (req, res) => {
    try {
        const assignments = await Assignment.find({ userID: req.user.id });
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller for handling assignment-related operations
const createAssignment = async (req, res) => {
    const { name, description, course, date, priority } = req.body;
    try {
        const assignment = await Assignment.create({
            name,
            userID: req.user.id,
            description,
            course,
            date,
            priority,
        });
        res.status(201).json(assignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//exporting the controller functions to be used in routes
module.exports = {
    createAssignment,
    getAssignmentsByUser,
};