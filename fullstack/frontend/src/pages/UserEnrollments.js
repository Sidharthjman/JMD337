// src/pages/UserEnrollments.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';


const UserEnrollments = () => {
    const { username } = useParams();
    const [enrollments, setEnrollments] = useState([]);

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('Fetching enrollments for username:', username); // Log the username being fetched
                const response = await axios.get(`http://localhost:5000/api/enrollments/${username}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                console.log('Enrollments response:', response.data); // Log the response data
                setEnrollments(response.data); // Adjust based on your API response structure
            } catch (error) {
                console.error('Error fetching user enrollments:', error);
            }
        };
        

        fetchEnrollments();
    }, [username]);

    return (
        <div>
            <NavBar />
            <Container className="mt-4">
                <h2>{username}'s Enrollments</h2>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Course Title</th>
                            <th>Progress</th>
                            <th>Grade</th>
                            <th>Completed</th>
                        </tr>
                    </thead>
                    <tbody>
    {enrollments.map((enrollment) => (
        <tr key={enrollment.id}> {/* Use enrollment.id or enrollment.enrollmentId */}
            <td>{enrollment.course.title}</td>
            <td>{enrollment.progress}%</td>
            <td>{enrollment.grade}</td>
            <td>{enrollment.completed ? 'Yes' : 'No'}</td>
        </tr>
    ))}
</tbody>

                </Table>
            </Container>
            
        </div>
    );
};

export default UserEnrollments;
