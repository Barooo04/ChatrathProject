import React, { useState, useEffect } from 'react';
import './UserDashboard.css';
import './UserDashboardResponsive.css';
import Loader from '../Loader/Loader';
import AssistantCard from './AssistantCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import video from "../Images/how-ai2.mp4";
import AssistantTable from './AssistantTable';

function UserDashboard({ user, onLogout }) {
    const [isLoading, setIsLoading] = useState(true);
    const [assistants, setAssistants] = useState([]);
    const [showPasswordPopup, setShowPasswordPopup] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [viewMode, setViewMode] = useState('card');
    const [searchTerm, setSearchTerm] = useState('');
    const API_URL = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001'  // URL locale
        : 'https://chatrathbackend-kcux.onrender.com'; // URL di produzione

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
                }, 1500);
            }
        };

        fetchAssistants();
    }, [user.id]);

    const handlePasswordChange = async () => {
        // Resetta i messaggi
        setErrorMessage('');
        setSuccessMessage('');

        // Verifica che le nuove password corrispondano
        if (newPassword !== confirmNewPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    currentPassword: currentPassword,
                    newPassword: newPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.message || 'Errore durante il cambio della password');
                return;
            }

            setSuccessMessage('Password changed successfully');
        } catch (error) {
            console.error('Errore durante la richiesta di cambio password:', error);
            setErrorMessage('Errore durante il cambio della password');
        }
    };

    const openPasswordPopup = () => {
        // Resetta i campi e i messaggi di stato quando il popup viene aperto
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setErrorMessage('');
        setSuccessMessage('');
        setShowPasswordPopup(true);
    };

    // Funzione per filtrare gli assistenti
    const filteredAssistants = assistants.filter(assistant =>
        assistant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assistant.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
        {isLoading ? (
            <Loader />
        ) : (
        <div className="dashboard-container">
            <video src={video} autoPlay loop muted playsInline className="background-video"></video>
            <nav className="dashboard-nav">
                <h1 className="dashboard-nav-title">Welcome back, {user.name}!</h1>
                <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                    <p className="change-password" onClick={openPasswordPopup}>Change your password</p>
                    <button className="dashboard-nav-logout" onClick={onLogout}>Logout</button>
                </div>
            </nav>
            <div className="assistants-container-content">
                <h1 className="assistants-container-title">ALL YOUR ASSISTANTS</h1>
                <h3 className="assistants-container-subtitle">Select an assistant to start chatting!</h3>
                <div className="view-mode-buttons">
                    <div className="view-mode-button-overlay">
                        <button 
                            className={viewMode === 'card' ? 'view-mode-button active' : 'view-mode-button inactive'} 
                            onClick={() => setViewMode('card')}
                        >
                            Card View
                        </button>
                        <button 
                            className={viewMode === 'line' ? 'view-mode-button active' : 'view-mode-button inactive'} 
                            onClick={() => setViewMode('line')}
                        >
                            Line View
                        </button>
                    </div>
                </div>
            </div>
            <input 
                type="text" 
                placeholder="Search assistants..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />
            <div className="assistants-container">
                {viewMode === 'card' ? (
                    filteredAssistants.length > 0 ? (
                        filteredAssistants.map(assistant => (
                            <AssistantCard 
                                key={assistant.id} 
                                assistant={assistant} 
                                user={user}
                            />
                        ))
                    ) : (
                        <p>Nessun assistente trovato.</p>
                    )
                ) : (
                    <table className="assistant-table">
                        <thead>
                            <tr>
                                <th>Assistant</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody> 
                            {
                                filteredAssistants.length > 0 ? (
                                    filteredAssistants.map(assistant => (
                                        <AssistantTable
                                            key={assistant.id} 
                                            assistant={assistant} 
                                            user={user}
                                        />
                                    ))
                            ) : (
                                <p>Nessun assistente trovato.</p>
                            )
                        }
                        </tbody>
                    </table>
                )}
            </div>
            {showPasswordPopup && (
                <>
                <div className="overlay" onClick={() => setShowPasswordPopup(false)}></div>
                <div className="password-popup">
                    <button className="close-button" onClick={() => setShowPasswordPopup(false)}><FontAwesomeIcon icon={faXmark} /></button>
                    {successMessage ? (
                        <div className="success-message">
                            <FontAwesomeIcon icon={faCheckCircle} size="2x" color="green" />
                            <p>{successMessage}</p>
                        </div>
                    ) : (
                        <>
                        <h2>Change your password</h2>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <input 
                            type="password" 
                            placeholder="Current password" 
                            value={currentPassword} 
                            onChange={(e) => setCurrentPassword(e.target.value)} 
                        />
                        <input 
                            type="password" 
                            placeholder="New password" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                        />
                        <input 
                            type="password" 
                            placeholder="Confirm new password" 
                            value={confirmNewPassword} 
                            onChange={(e) => setConfirmNewPassword(e.target.value)} 
                        />
                        <button onClick={handlePasswordChange}>Change password</button>
                        </>
                    )}
                </div>
                </>
            )}
        </div>
        )}
        </>
    );
}

export default UserDashboard;