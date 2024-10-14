// frontend/src/pages/AvailableCourses.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

const AvailableCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Define fetchCourses here
    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users/courses', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses(); // Call the fetchCourses function here
    }, []);

    const handleComplete = async (courseId) => {
        try {
            await axios.post(`http://localhost:5000/api/users/complete/${courseId}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert('Course marked as completed');
            fetchCourses(); // Refresh courses after completion
        } catch (error) {
            alert('Failed to mark course as completed');
            console.error('Completion error:', error);
        }
    };

    const handleEnroll = async (courseId) => {
        try {
            await axios.post(`http://localhost:5000/api/users/enroll/${courseId}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert('Successfully enrolled in course');
            fetchCourses(); // Optionally refresh courses after enrollment
        } catch (error) {
            alert('Failed to enroll in course');
            console.error('Enrollment error:', error);
        }
    };

    if (loading) {
        return <p>Loading courses...</p>;
    }

    return (
        <Container className="mt-4">
            <Row>
                {courses.map((course) => (
                    <Col key={course.id} md={4} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>{course.title}</Card.Title>
                                <Card.Text>{course.description}</Card.Text>
                                <Button variant="primary" onClick={() => handleEnroll(course.id)}>
                                    Enroll
                                </Button>
                                {/* Button to mark course as completed */}
                                <Button variant="success" onClick={() => handleComplete(course.id)}>
                                    Mark as Completed
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default AvailableCourses;
