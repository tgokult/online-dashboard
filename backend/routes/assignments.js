const express = require('express');
const router = express.Router();
const { assignAsset, returnAsset, getAssignments } = require('../controllers/assignmentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAssignments);
router.post('/assign', protect, assignAsset);
router.post('/return/:id', protect, returnAsset); // Assignment ID

module.exports = router;
