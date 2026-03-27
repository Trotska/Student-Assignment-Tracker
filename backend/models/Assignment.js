const mongoose = require("mongoose");
// MongoDB model for assignments
//Potential Ideas: name, date, priority, description, course, status (e.g., pending, completed)
const assignmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    course: { type: String },
    date: { type: Date, required: true},
    priority: { type: String, required: true },
});

module.exports = mongoose.model("Assignment", assignmentSchema);