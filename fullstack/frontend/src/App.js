import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Login from './pages/Login';
import AvailableCourses from './pages/AvailableCourses';
import Profile from './pages/profile';
import LearningPaths from './pages/LearningPaths';
import CoursePage from './pages/coursepage';
import UserEnrollments from './pages/UserEnrollments'; // Import the new UserEnrollments page

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/user-dashboard" element={<UserDashboard />} />
                <Route path="/available-courses" element={<AvailableCourses />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/course/:id" element={<CoursePage />} />
                <Route path="/learning-paths" element={<LearningPaths />} />
                <Route path="/login" element={<Login />} />
                <Route path="/user-enrollments/:username" element={<UserEnrollments />} /> {/* New route for user enrollments */}
            </Routes>
        </Router>
    );
}

export default App;
