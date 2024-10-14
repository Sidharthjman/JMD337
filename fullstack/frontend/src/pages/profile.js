import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, ProgressBar } from 'react-bootstrap';
import '../assets/Profiles.css'
const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/profile', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setProfile(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return <p>Loading profile...</p>;
    }

    return (
        <Container className="mt-4">
            <Row>
                {/* Profile Information */}
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Profile Information</Card.Title>
                            <p><strong>Username:</strong> {profile?.username}</p>
                            <p><strong>Role:</strong> {profile?.role}</p>
                        </Card.Body>
                    </Card>

                    {/* Achievements */}
                    <Card>
                        <Card.Body>
                            <Card.Title>Achievements</Card.Title>
                            {profile?.achievements?.length > 0 ? (
                                profile.achievements.map((achievement, index) => (
                                    <p key={index}>{achievement}</p>
                                ))
                            ) : (
                                <p>No achievements yet.</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Courses & Progress */}
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Enrolled Courses</Card.Title>
                            {profile?.enrollments?.map((enrollment) => (
                                <div key={enrollment.course.id} className="mb-3">
                                    <p><strong>{enrollment.course.title}</strong></p>
                                    <ProgressBar 
                                        now={enrollment.progress} 
                                        label={`${enrollment.progress}%`} 
                                        striped 
                                        variant="success" 
                                    />
                                </div>
                            ))}
                        </Card.Body>
                    </Card>

                    {/* Performance */}
                    <Card>
                        <Card.Body>
                            <Card.Title>Performance Overview</Card.Title>
                            <p><strong>Total Courses Enrolled:</strong> {profile?.enrollments?.length}</p>
                            <p><strong>Courses Completed:</strong> {profile?.enrollments?.filter(e => e.progress === 100).length}</p>
                            <p><strong>Average Progress:</strong> {
                                profile?.enrollments?.length > 0 
                                ? (profile.enrollments.reduce((acc, curr) => acc + curr.progress, 0) / profile.enrollments.length).toFixed(2) 
                                : 0
                            }%</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;
