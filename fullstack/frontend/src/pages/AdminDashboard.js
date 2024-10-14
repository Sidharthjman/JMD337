import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Accordion, Card } from 'react-bootstrap';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom'; // Import Link for navigation
import NavBar from '../components/NavBar';

import Chart from 'react-apexcharts';

const AdminDashboard = () => {
    const [userPerformance, setUserPerformance] = useState([]);
    const [chartData, setChartData] = useState({
        series: [
            {
                name: 'Courses Enrolled',
                data: [],
            },
            {
                name: 'Courses Completed',
                data: [],
            },
        ],
        options: {
            chart: {
                height: 350,
                type: 'bar',
                toolbar: {
                    show: false,
                },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    endingShape: 'rounded',
                    columnWidth: '55%',
                },
            },
            dataLabels: {
                enabled: true,
            },
            xaxis: {
                categories: [],
            },
            yaxis: {
                title: {
                    text: 'Number of Courses',
                },
            },
            title: {
                text: 'User Performance Overview',
                align: 'left',
            },
        },
    });

    useEffect(() => {
        const fetchUserPerformance = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/admin/performance', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserPerformance(response.data.users); // Adjusted to use 'users' from the response

                // Prepare chart data
                const usernames = response.data.users.map(user => user.username);
                const enrollments = response.data.users.map(user => user.enrollments);
                const completions = response.data.users.map(user => user.completions);

                setChartData(prev => ({
                    ...prev,
                    series: [
                        { name: 'Courses Enrolled', data: enrollments },
                        { name: 'Courses Completed', data: completions },
                    ],
                    options: {
                        ...prev.options,
                        xaxis: {
                            categories: usernames,
                        },
                    },
                }));
            } catch (error) {
                console.error('Error fetching user performance:', error);
            }
        };

        fetchUserPerformance();
    }, []);

    return (
        <div>
            <NavBar />
            <Container className="mt-4">
                <Typography variant="h4" gutterBottom>
                    Total Users
                </Typography>

                {/* Add the Chart component */}
                <Chart
                    options={chartData.options}
                    series={chartData.series}
                    type="bar"
                    height={350}
                />

                <Table striped bordered hover className="mt-4">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Designation</th>
                            <th>Courses Enrolled</th>
                            <th>Courses Completed</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userPerformance.map((user, index) => (
                            <tr key={index}>
                                <td>
                                    <Link to={`/user-enrollments/${user.username}`}>{user.username}</Link>
                                </td>
                                <td>{user.department}</td>
                                <td>{user.enrollments}</td>
                                <td>{user.completions}</td>
                                <td>
                                    <Accordion defaultActiveKey="0">
                                        <Accordion.Item eventKey="1">
                                            <Accordion.Header>View Course Details</Accordion.Header>
                                            <Accordion.Body>
                                                {/* Course details could be displayed here if provided by the API */}
                                                <Card>
                                                    <Card.Body>
                                                        <Card.Text>
                                                            No course details available.
                                                        </Card.Text>
                                                    </Card.Body>
                                                </Card>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
            
        </div>
    );
};

export default AdminDashboard;
