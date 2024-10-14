import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Button, Row, Col, Form } from 'react-bootstrap';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';

import '../assets/userDashboard.css';

const UserDashboard = () => {
    const [availableCourses, setAvailableCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // State to hold search term
    const navigate = useNavigate();

    // Fetch available courses
    useEffect(() => {
        const fetchAvailableCourses = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/user/courses', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                    params: { search: searchTerm }
                });
        
                if (response.data && response.data.data) {
                    console.log("Available Courses Data:", response.data.data); // Log available courses
                    setAvailableCourses(response.data.data);
                } else {
                    console.error("Invalid available courses response format", response.data);
                }
            } catch (error) {
                console.error('Error fetching available courses:', error);
            }
        };
        fetchAvailableCourses();
    }, [searchTerm]); // Re-fetch available courses when search term changes

    // Fetch my courses
    const fetchMyCourses = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/user/my-courses', {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Ensure that response data structure is valid
            if (response.data && response.data.enrollments) {
                setMyCourses(response.data.enrollments);
            } else {
                console.error("Invalid my courses response format", response.data);
            }
        } catch (error) {
            console.error('Error fetching my courses:', error);
        }
    };

    // Fetch my courses when the component mounts
    useEffect(() => {
        fetchMyCourses();
    }, []);

    const continueCourse = (courseId) => {
        navigate(`/course/${courseId}`);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value); // Update search term on input change
    };

    // Enroll the user in the selected course
    const enrollCourse = async (courseId) => {
        console.log("Course ID:", courseId); // Logging the course ID for debugging
        if (!courseId) {
            alert('Invalid course ID. Please try again.');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:5000/api/user/enroll/${courseId}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            alert(response.data.message); // Show success message
            fetchMyCourses(); // Refetch 'My Courses' after successful enrollment
        } catch (error) {
            console.error('Error enrolling in course:', error);
            alert('Failed to enroll in course');
        }
    };

    // Before the return statement, log the course data
console.log("Available Courses:", availableCourses);
console.log("My Courses:", myCourses);


return (
    <div>
        <NavBar />
        <Container className="mt-4 user-dashboard">
            <Typography variant="h4" gutterBottom>
                User Dashboard
            </Typography>

            <Row className="dashboard-section">
                {/* My Courses Section */}
                <Col md={4} className="mb-4">
                    <Card className="dashboard-card">
                        <Card.Body>
                            <Card.Title>My Courses</Card.Title>
                            {myCourses.length > 0 ? (
                                <ul>
                                    {myCourses.map((course) => (
                                        <li key={course.courseId}>
                                            {course && course.title ? (
                                                <>
                                                    {course.title} - Progress: {course.progress}%
                                                    <Button 
                                                        variant="link" 
                                                        onClick={() => {
                                                            console.log("Continuing course ID:", course.courseId); 
                                                            continueCourse(course.courseId); 
                                                        }}
                                                    >
                                                        Continue
                                                    </Button>
                                                </>
                                            ) : (
                                                <p>Invalid course data</p>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No courses enrolled yet.</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Available Courses Section */}
                <Col md={8} className="mb-4">
                    <Card className="dashboard-card">
                        <Card.Body>
                            <Card.Title>Available Courses</Card.Title>
                            <Form.Control
                                type="text"
                                placeholder="Search for courses..."
                                value={searchTerm}
                                onChange={handleSearch} // Update search term on input change
                                className="mb-3"
                            />
                            <Row>
                                {availableCourses.length > 0 ? (
                                    availableCourses.map((course) => (
                                        <Col xs={12} key={course.courseid} className="mb-3"> {/* Use courseid here */}
                                            {course && course.title ? (
                                                <Card>
                                                    <Card.Body>
                                                        <Card.Title>{course.title}</Card.Title>
                                                        <Card.Text>{course.short_intro}</Card.Text>
                                                        <Button 
                                                            variant="primary" 
                                                            onClick={() => {
                                                                console.log("Enrolling in course ID:", course.courseid); // Log course ID on click
                                                                enrollCourse(course.courseid); // Use the correct identifier
                                                            }}
                                                        >
                                                            Enroll
                                                        </Button>
                                                    </Card.Body>
                                                </Card>
                                            ) : (
                                                <p>Invalid course data</p>
                                            )}
                                        </Col>
                                    ))
                                ) : (
                                    <p>No available courses.</p>
                                )}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
        
    </div>
);


    
};

export default UserDashboard;
