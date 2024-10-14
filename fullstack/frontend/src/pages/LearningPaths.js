// src/pages/LearningPaths.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';

const LearningPaths = () => {
    const [name, setName] = useState('');
    const [learningPaths, setLearningPaths] = useState([]);

    useEffect(() => {
        const fetchLearningPaths = async () => {
            try {
                const response = await axios.get('/api/admin/learning-paths', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setLearningPaths(response.data);
            } catch (error) {
                console.error('Error fetching learning paths:', error);
            }
        };
        fetchLearningPaths();
    }, []);

    const handleCreateLearningPath = async () => {
        try {
            await axios.post('/api/admin/learning-paths', { name }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setName('');
            // Fetch the updated list of learning paths
            const response = await axios.get('/api/admin/learning-paths', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setLearningPaths(response.data);
        } catch (error) {
            console.error('Error creating learning path:', error);
        }
    };

    return (
        <Container className="mt-4">
            <h1>Learning Paths</h1>
            <Form onSubmit={(e) => { e.preventDefault(); handleCreateLearningPath(); }}>
                <Form.Group>
                    <Form.Label>Learning Path Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter learning path name"
                        required
                    />
                </Form.Group>
                <Button type="submit" variant="primary">Create Learning Path</Button>
            </Form>

            <ListGroup className="mt-4">
                {learningPaths.map((path) => (
                    <ListGroup.Item key={path.id}>{path.name}</ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    );
};

export default LearningPaths;
