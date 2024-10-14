// backend/src/routes/userRoutes.js

const express = require('express');
const { authenticateUser, isAdmin } = require('../middleware/authMiddleware');
const { enrollInCourse, getAvailableCourses, getMyCourses, markCourseComplete, enrollCourse } = require('../controllers/userController');
const { getUserDetails} = require('../controllers/userController')
 
const router = express.Router();

// Route to get all available courses
router.get('/courses', authenticateUser, getAvailableCourses);

router.post('/enroll/:courseId', authenticateUser, enrollCourse);

// Route to get user profile
router.get('/profile', authenticateUser, getUserDetails);

// Route to get user's enrolled courses
router.get('/my-courses', authenticateUser, getMyCourses);

// Route to mark course as complete
router.post('/complete/:courseId', authenticateUser, markCourseComplete);

// src/routes/userRoutes.js
// router.get('/course/:id', authenticateUser,getCourseById);



module.exports = router;
