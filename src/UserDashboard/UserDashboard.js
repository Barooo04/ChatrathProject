import React, { useState, useEffect } from 'react';
import './UserDashboard.css';
import Loader from '../Loader/Loader';
import AssistantCard from './AssistantCard';

function UserDashboard({ user, onLogout }) {
    const [isLoading, setIsLoading] = useState(true);
    const [assistants, setAssistants] = useState([]);
    const API_URL = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001'  // URL locale
        : 'https://chatrathbackend.onrender.com'; // URL di produzione

    useEffect(() => {
        const fetchAssistants = async () => {
            try {
                const response = await fetch(`${API_URL}/api/assistants`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: user.id }),
                });

                if (!response.ok) {
                    throw new Error('Errore nel recupero degli assistenti');
                }

                const data = await response.json();
                setAssistants(data);
            } catch (error) {
                console.error('Errore:', error);
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 3000);
            }
        };

        fetchAssistants();
    }, [user.id]);

    return (
        <>
        {isLoading ? (
            <Loader />
        ) : (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <h1 className="dashboard-nav-title">Welcome back, {user.name}!</h1>
            <button className="dashboard-nav-logout" onClick={onLogout}>Logout</button>
            </nav>
            <div className="assistants-container-content">
                <h1 className="assistants-container-title">ALL YOUR ASSISTANTS</h1>
                <h3 className="assistants-container-subtitle">Select an assistant to start chatting!</h3>
            </div>
            <div className="assistants-container">
                {assistants.length > 0 ? (
                    assistants.map(assistant => (
                        <AssistantCard 
                            key={assistant.id} 
                            assistant={assistant} 
                            user={user}
                        />
                    ))
                ) : (
                    <p>Nessun assistente trovato.</p>
                )}
            </div>
        </div>
        )}
        </>
    );
}

export default UserDashboard;