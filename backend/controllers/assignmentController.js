const Assignment = require('../models/Assignment');

// Controller for fetching assignments for a specific user
//NEEDS TESTING
const getAssignmentsByUser = async (req, res) => {
    try {
        const assignments = await Assignment.find({ userId: req.user.id });
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller for handling assignment-related operations
const createAssignment = async (req, res) => {
    const { title, description, course, date, priority } = req.body;
    try {
        const assignment = await Assignment.create({
            title,
            userId: req.user.id,
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

const updateAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        //look into this, it seems to be a bit repetitive and can be optimized
        const { title, description, course, date, priority } = req.body;
        
        //Possibly refine this to cleanup the code and avoid repetition
        if (title !== undefined) assignment.title = title;
        if (description !== undefined) assignment.description = description;
        if (course !== undefined) assignment.course = course;
        if (date !== undefined) assignment.date = date;
        if (priority !== undefined) assignment.priority = priority;

        const updatedAssignment = await assignment.save();
        res.status(200).json(updatedAssignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//exporting the controller functions to be used in routes
module.exports = {
    createAssignment,
    getAssignmentsByUser,
    updateAssignment,
};