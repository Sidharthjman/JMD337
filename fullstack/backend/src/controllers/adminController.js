const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all user performance data for admin with pagination
exports.getUsers = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Fetch page and limit from query params
    const skip = (page - 1) * limit; // Calculate how many records to skip
  
    try {
        // Fetch users
        const users = await prisma.users.findMany({
            skip: skip,
            take: Number(limit),
            // Do not include enrollments here since it's not defined as a relation in your schema
        });
  
        // Count total users for pagination
        const userCount = await prisma.users.count();
  
        res.status(200).json({
            message: 'Users fetched successfully.',
            users, // This contains the list of users
            totalUsers: userCount,
            currentPage: page,
            totalPages: Math.ceil(userCount / limit), // Calculate total pages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getUserEnrollments = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await prisma.users.findUnique({
            where: { username: username },
            include: {
                userEnrollments: {
                    include: {
                        course: true // Ensure course details are included
                    }
                }
            }
        });

        if (!user || !user.userEnrollments) {
            return res.status(404).json({ message: 'User or enrollments not found' });
        }

        // Map through userEnrollments to get the desired structure
        const enrollments = user.userEnrollments.map(enrollment => ({
            courseTitle: enrollment.course.Title,
            category: enrollment.course.Category,
            progress: enrollment.Progress,
            grade: enrollment.Completed ? 100 : 0, // You can adjust this logic as needed
        }));

        res.json(enrollments);
    } catch (error) {
        console.error('Error fetching user enrollments:', error);
        res.status(500).json({ message: 'Error fetching enrollments' });
    }
};

