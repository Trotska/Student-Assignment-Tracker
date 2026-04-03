const express = require('express');
const { createAssignment, getAssignmentsByUser, updateAssignment, deleteAssignment } = require('../controllers/assignmentController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createAssignment);
router.get('/', protect, getAssignmentsByUser);
router.put('/:id', protect, updateAssignment);
router.delete('/:id', protect, deleteAssignment);

module.exports = router;