const express = require('express');
const { createAssignment} = require('../controllers/assignmentController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createAssignment);
router.get('/', protect, getAssignmentsByUser);

module.exports = router;