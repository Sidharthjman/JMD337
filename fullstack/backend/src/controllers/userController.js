// backend/src/controllers/userContollers.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all available courses for the user
const getAvailableCourses = async (req, res) => {
    const { page = 1, limit = 10, sortBy = 'title', order = 'asc', search = '' } = req.query;

    try {
        // Fetch courses with search, pagination, and sorting
        const courses = await prisma.courses.findMany({
            where: {
                title: {
                    contains: search, // Searches for courses containing the search term in the title
                    mode: 'insensitive' // Makes the search case-insensitive
                }
            },
            skip: (page - 1) * limit,  // Skip to the correct page
            take: parseInt(limit),  // Limit the number of results per page
            orderBy: {
                [sortBy]: order === 'asc' ? 'asc' : 'desc',  // Dynamic sorting by field and order
            },
        });

        // Get the total number of courses for pagination
        const totalCourses = await prisma.courses.count({
            where: {
                title: {
                    contains: search,
                    mode: 'insensitive'
                }
            }
        });

        // Respond with the courses and pagination info
        res.status(200).json({
            data: courses,
            totalPages: Math.ceil(totalCourses / limit),  // Calculate total pages
            currentPage: parseInt(page),  // Return the current page number
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


// const enrollCourse = async (req, res) => {
//     const { courseId } = req.params;
//     const userId = req.user.id; // Assuming you get user ID from authentication middleware

//     try {
//         // Check if the user is already enrolled in the course
//         const existingEnrollment = await prisma.enrollment.findUnique({
//             where: {
//                 userId_courseId: {
//                     userId,
//                     courseId,
//                 },
//             },
//         });

//         if (existingEnrollment) {
//             return res.status(400).json({ message: 'User already enrolled in this course.' });
//         }

//         // Create a new enrollment
//         const enrollment = await prisma.enrollment.create({
//             data: {
//                 userId,
//                 courseId,
//                 progress: 0, // Set initial progress to 0
//                 startDate: new Date(),
//                 completed: 0, // Set initial completion status
//             },
//         });

//         return res.status(201).json(enrollment);
//     } catch (error) {
//         console.error('Error enrolling in course:', error);
//         return res.status(500).json({ message: 'Server error while enrolling in course.' });
//     }
// };


const enrollCourse = async (courseId) => {
    try {
        console.log(`Enrolling in course ID: ${courseId}`);
        const response = await axios.post(`http://localhost:5000/api/user/enroll/${courseId}`, {
            // Pass any required data here, if necessary
        }, {
            headers: {
                Authorization: `Bearer ${your_jwt_token}`, // Ensure the token is passed here
            },
        });
        console.log('Enrollment successful:', response.data);
    } catch (error) {
        console.error('Error enrolling in course:', error);
    }
};




const getMyCourses = async (req, res) => {
    const userid = req.user.id;

    try {
        const enrollments = await prisma.enrollments.findMany({
            where: { userid },
            include: { course: true },  // Include course details
        });

        res.status(200).json({
            message: 'User Dashboard',
            enrollments: enrollments.map(e => ({
                title: e.course.title,           // Course title
                shortIntro: e.course.shortIntro, // Short introduction of the course
                progress: e.progress,            // User's progress in this course
            })),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Get course by ID
const getCourseById = async (req, res) => {
    const { id } = req.params;
    try {
        const course = await prisma.courses.findUnique({
            where: { courseid: id } 
        });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching course details', error });
    }
};


const getUserDetails = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await prisma.users.findUnique({
            where: { id: userId },
            include: {
                enrollments: {
                    include: {
                        course: true,
                    },
                },
            },
        });

        // Optionally, modify the response to include specific fields
        const userProfile = {
            id: user.id,
            username: user.username,
            role: user.role,
            enrollments: user.enrollments.map((enrollment) => ({
                courseId: enrollment.courseId,
                courseTitle: enrollment.course.title,
                progress: enrollment.progress,
                completed: enrollment.completed,
            })),
        };

        res.json(userProfile);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
};


// Mark course as completed
const markCourseComplete = async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user.id;

    try {
        await prisma.enrollment.upsert({
            where: {
                userId_courseId: {
                    userId,
                    courseId: courseId, // No need to parse the courseId
                },
            },
            update: {
                completed: 1, // Assuming 1 means completed based on your schema
                progress: 100.0, // Optional: setting progress to 100 when completed
            },
            create: {
                userId,
                courseId: courseId, // Using courseId as a string
                completed: 1,
                progress: 100.0, // Optional: setting initial progress to 100 when marking as completed
            },
        });

        res.status(200).json({ message: 'Course marked as completed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to mark course as completed' });
    }
};

module.exports = {
    getAvailableCourses,
    getCourseById,
    enrollCourse,
    getMyCourses,
    getUserDetails,
    markCourseComplete
};
