import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import LandingPage from './LandingPage/LandingPage';
import LoginPage from './LoginPage/LoginPage';
import UserDashboard from './UserDashboard/UserDashboard';
import AdminDashboard from './AdminDashboard/AdminDashboard';
import Chat from './Chat/Chat';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Recupera i dati di autenticazione dal localStorage all'inizio
        const storedUser = localStorage.getItem('user');
        const storedAuth = localStorage.getItem('isAuthenticated') === 'true';

        if (storedUser && storedAuth) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);

        // Salva i dati di autenticazione nel localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUser(null);

        // Rimuovi i dati di autenticazione dal localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route
                    path="/login"
                    element={
                        isAuthenticated ? (
                            user.role === 'admin' ? (
                                <Navigate to="/admin" />
                            ) : (
                                <Navigate to="/dashboard" />
                            )
                        ) : (
                            <LoginPage onLogin={handleLogin} />
                        )
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        isAuthenticated && user.role !== 'admin' ? (
                            <UserDashboard user={user} onLogout={handleLogout} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route
                    path="/admin"
                    element={
                        isAuthenticated && user.role === 'admin' ? (
                            <AdminDashboard user={user} onLogout={handleLogout} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route path="/chat/:assistantToken" element={<Chat />} />
            </Routes>
        </Router>
    );
}

export default App;
