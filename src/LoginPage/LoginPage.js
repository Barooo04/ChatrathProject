import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./LoginPage.css";

function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            onLogin(data.user);
            navigate('/dashboard');
        } else {
            setErrorMessage(data.message);
        }
    };

    return (
        <div className="background">
            <div className="shape"></div>
            <div className="shape"></div>
            <form onSubmit={handleSubmit}>
                <h3>Login</h3>

                {errorMessage && <div className="error-message">{errorMessage}</div>}

                <label htmlFor="username">Email</label>
                <input
                    type="text"
                    placeholder="Email"
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
            </form>
        </div>
    );
}

export default LoginPage;