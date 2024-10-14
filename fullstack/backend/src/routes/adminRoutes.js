const express = require('express');
const { authenticateUser, isAdmin } = require('../middleware/authMiddleware');
const { getUsers, getUserEnrollments } = require('../controllers/adminController'); // Import getUserEnrollments

const router = express.Router();

router.get('/performance', authenticateUser, isAdmin, getUsers);
// Route to create a new learning path
router.post('/learning-paths', authenticateUser, isAdmin);

// Route to get all learning paths
router.get('/learning-paths', authenticateUser, isAdmin);

router.get('/enrollments/:username', authenticateUser, isAdmin, getUserEnrollments); // Ensure isAdmin is included

module.exports = router;
