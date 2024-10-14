// src/pages/AuthPanel.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import { Typography } from '@mui/material';
import '../assets/login.css'; // Import any specific styles

// Import your images
import loginImage from '../assets/images/login.svg'; // Update the path as needed
import signupImage from '../assets/images/signup.svg'; // Update the path as needed

const AuthPanel = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [secretKey, setSecretKey] = useState('');
    const [role, setRole] = useState('user'); // Default role
    const [department, setDepartment] = useState(''); // Add department state
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(username, password, role, secretKey, department)
        try {
            if (isSignUp) {
                await axios.post('http://localhost:5000/api/auth/signup', { username, password, role, secretKey, department }); // Include department here
                alert('Sign up successful! Please log in.');
                setIsSignUp(false);
            } else {
                const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
                const { token, role ,userId} = response.data;
                console.log(response.data)
                localStorage.setItem('token', token);
                localStorage.setItem('UserId',userId );
                navigate(role === 'admin' ? '/admin-dashboard' : '/user-dashboard');
            }
        } catch (error) {
            console.error('Authentication error:', error);
            alert('Error: ' + (error.response ? error.response.data.message : error.message)); // Handle error response
        }
    };
    
    
    return (
        <Container className={`container_l ${isSignUp ? 'sign-up-mode' : ''}`} style={{margin:0, width:"100%", maxWidth:"100%"}}>
            <div className="forms-container">
                <div className="signin-signup">
                    <form className={`sign-in-form`} onSubmit={handleSubmit}>
                        <Typography variant="h4" gutterBottom>Login</Typography>
                        <div className="input-field">
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-field">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn">Login</button>
                    </form>

                    <form className={`sign-up-form`} onSubmit={handleSubmit}>
                        <Typography variant="h4" gutterBottom>Sign Up</Typography>
                        <div className="input-field">
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-field">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="role-input-field">
                            <select
                                value={role}
                                onChange={(e) => {
                                    setRole(e.target.value);
                                    if (e.target.value === 'user') {
                                        setSecretKey(''); // Clear secret key if role is user
                                    }
                                }}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        {role === 'admin' && (
                            <div className="input-field secret-key-field">
                                <input
                                    type="text"
                                    placeholder="Secret Key"
                                    value={secretKey}
                                    onChange={(e) => setSecretKey(e.target.value)}
                                    required // Make it required only if the role is admin
                                />
                            </div>
                        )}
                        <div className="input-field">
                            <input
                                type="text"
                                placeholder="Department" // Add a placeholder for the department input
                                value={department} // Bind department state
                                onChange={(e) => setDepartment(e.target.value)} // Update state on change
                                required // Optionally make this field required
                            />
                        </div>
                        <button type="submit" className="btn">Sign Up</button>
                    </form>
                </div>
            </div>

            <div className="panels-container">
                <div className="panel left-panel">
                    <div className="content">
                        <h3>New here?</h3>
                        <p>Come join us, to start your journey and sharpen your Skills.</p>
                        <button className="btn transparent" onClick={() => setIsSignUp(true)}>Sign Up</button>
                    </div>
                    <img src={signupImage} className="image" alt="Signup Illustration" />
                </div>
                <div className="panel right-panel">
                    <div className="content">
                        <h3>One of us?</h3>
                        <p>Log in and start learning</p>
                        <button className="btn transparent" onClick={() => setIsSignUp(false)}>Login</button>
                    </div>
                    <img src={loginImage} className="image" alt="Login Illustration" />
                </div>
            </div>
        </Container>
    );
};

export default AuthPanel;
