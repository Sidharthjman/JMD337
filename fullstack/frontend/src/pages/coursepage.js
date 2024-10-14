// src/pages/CoursePage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Container } from 'react-bootstrap';

const CoursePage = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/user/course/${id}`);
                setCourse(response.data);
            } catch (error) {
                console.error('Error fetching course details:', error);
            }
        };

        fetchCourse();
    }, [id]);

    const enrollInCourse = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/user/enroll', { courseId: id }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Enrolled successfully!');
        } catch (error) {
            console.error('Error enrolling in course:', error);
        }
    };

    if (!course) return <p>Loading...</p>;

    return (
        <Container>
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <Button onClick={enrollInCourse}>Enroll</Button>
        </Container>
    );
};

export default CoursePage;
