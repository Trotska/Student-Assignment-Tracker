const express = require('express');
const { createAssignment, getAssignmentsByUser, updateAssignment } = require('../controllers/assignmentController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createAssignment);
router.get('/', protect, getAssignmentsByUser);
router.put('/:id', protect, updateAssignment);

module.exports = router;