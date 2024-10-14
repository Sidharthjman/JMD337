const prisma = require('../prisma/prismaClient');

// Create a new learning path
const createLearningPath = async (req, res) => {
    const { name } = req.body;

    try {
        const learningPath = await prisma.learningPath.create({
            data: { name },
        });
        res.status(201).json(learningPath);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create learning path' });
    }
};

// Get all learning paths
const getLearningPaths = async (req, res) => {
    try {
        const learningPaths = await prisma.learningPath.findMany({
            include: { courses: true },
        });
        res.json(learningPaths);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch learning paths' });
    }
};

module.exports = {
    createLearningPath,
    getLearningPaths,
};
