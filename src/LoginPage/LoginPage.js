import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./LoginPage.css";
import logo from '../Images/logonick.png';

function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const API_URL = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001'  // URL locale
        : 'https://chatrathbackend.onrender.com'; // URL di produzione

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Errore:', errorData);
                throw new Error(`Errore: ${response.status} ${errorData.message}`);
            }

            const data = await response.json();
            onLogin(data.user);

            if (data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Errore dettagliato:', error);
            setErrorMessage(error.message);
        }
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <div className="background">
            <div className="shape">
                <img src={logo} alt="Logo" className="logo" style={{height: '130px', zIndex: '1000'}} />
            </div>
            <form onSubmit={handleSubmit}>
                <h3>Login</h3>

                {errorMessage && <div className="error-message">{errorMessage}</div>}

                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    placeholder="Email Address"
                    id="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Log In</button>
                <button type="button" className="back-button" onClick={handleBackToHome}>
                    ← Back to Home
                </button>
            </form>
        </div>
    );
}

export default LoginPage;