const Assignment = require('../models/Assignment');

// Controller for fetching assignments for a specific user
//NEEDS TESTING
const getAssignmentsByUser = async (req, res) => {
    try {
        //finding the assignment with a given user ID
        const assignments = await Assignment.find({ userId: req.user.id });
        res.status(200).json(assignments);
    } catch (error) {
        //sending a 500 error response in case of any server errors
        res.status(500).json({ message: error.message });
    }
};

// Controller for handling assignment-related operations
const createAssignment = async (req, res) => {
    //collecting data from the request body
    const { title, description, course, date, priority } = req.body;
    try {
        //creating assignment object
        const assignment = await Assignment.create({
            title,
            userId: req.user.id,
            description,
            course,
            date,
            priority,
        });
        //responding with the created assignment
        res.status(201).json(assignment);
    } catch (error) {
        //handling errors and responding with an error message
        res.status(500).json({ message: error.message });
    }
};

// Controller for updating an assignment
const updateAssignment = async (req, res) => {
    try {
        //finding the assignment by ID and user ID
        const assignment = await Assignment.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });

        //if assignment is not found respond with a 404 error
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
        
        //updating the assignment and responding with the updated assignment
        const updatedAssignment = await assignment.save();
        res.status(200).json(updatedAssignment);
    } catch (error) {
        //sending a 500 error response in case of any server errors
        res.status(500).json({ message: error.message });
    }
};
//Delete assignment controller
const deleteAssignment = async (req, res) => {
    try {
        // finding the assignment by ID and User ID
        const assignment = await Assignment.findOne({_id: req.params.id,userId: req.user.id,});
        // if assignment is not found, respond with a 404 error
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        // deleting the assignment
        await assignment.remove();

        // responding with a success message
        res.status(200).json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        // sending a 500 error response in case of any server errors
        res.status(500).json({ message: error.message });
    }
};

//exporting the controller functions to be used in routes
module.exports = {
    createAssignment,
    getAssignmentsByUser,
    updateAssignment,
    deleteAssignment,
};