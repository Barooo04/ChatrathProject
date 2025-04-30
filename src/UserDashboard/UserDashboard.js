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
    const [useAnthropic, setUseAnthropic] = useState(false);
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
                }, 600);
            }
        };

        fetchAssistants();
    }, [user.id]);

    useEffect(() => {
        const savedService = localStorage.getItem('chatService');
        if (savedService) {
            setUseAnthropic(savedService === 'anthropic');
        }
    }, []);

    const handleServiceChange = (service) => {
        const isAnthropic = service === 'anthropic';
        setUseAnthropic(isAnthropic);
        localStorage.setItem('chatService', service);
    };

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

    const scrollToAssistantType = (type, offset = 100) => {
        const element = document.getElementById(type);
        if (element) {
            const rect = element.getBoundingClientRect();
            const scrollPosition = window.scrollY + rect.top - offset;
            window.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            });
        }
    };

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
                <div className="view-switches">
                    <div className="view-mode-buttons">
                        <div className="view-mode-button-overlay">
                            <button 
                                className={`view-mode-button ${viewMode === 'card' ? 'active' : 'inactive'}`} 
                                onClick={() => setViewMode('card')}
                            >
                                Card View
                            </button>
                            <button 
                                className={`view-mode-button ${viewMode === 'line' ? 'active' : 'inactive'}`} 
                                onClick={() => setViewMode('line')}
                            >
                                Line View
                            </button>
                        </div>
                    </div>
                    <div className="view-mode-buttons">
                        <div className="view-mode-button-overlay">
                            <button 
                                className={`view-mode-button ${!useAnthropic ? 'active' : 'inactive'}`}
                                onClick={() => handleServiceChange('default')}
                            >
                                Default
                            </button>
                            <button 
                                className={`view-mode-button ${useAnthropic ? 'active' : 'inactive'}`}
                                onClick={() => handleServiceChange('anthropic')}
                            >
                                Anthropic
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="legend-container">
                <div style={{display: 'flex', gap: '10px'}}>
                    <div className="legend-item" onClick={() => scrollToAssistantType('overarching')} style={{ cursor: 'pointer' }}>
                        <div className="legend-dot" style={{ backgroundColor: "rgb(208, 214, 36)" }}></div>
                        <span className="legend-text">Start here: Onboarding</span>
                    </div>
                    <div className="legend-item" onClick={() => scrollToAssistantType('productmarketfit')} style={{ cursor: 'pointer' }}>
                        <div className="legend-dot" style={{ backgroundColor: "rgb(255, 87, 51)" }}></div>
                        <span className="legend-text">Find product-market fit</span>
                    </div>
                    <div className="legend-item" onClick={() => scrollToAssistantType('growthengine')} style={{ cursor: 'pointer' }}>
                        <div className="legend-dot" style={{ backgroundColor: "rgb(251, 142, 209)" }}></div>
                        <span className="legend-text">Design a growth engine</span>
                    </div>
                    <div className="legend-item" onClick={() => scrollToAssistantType('scaling')} style={{ cursor: 'pointer' }}>
                        <div className="legend-dot" style={{ backgroundColor: "rgb(101, 235, 204)" }}></div>
                        <span className="legend-text">Scale with intention</span>
                    </div>
                </div>
                <div style={{display: 'flex', gap: '10px'}}>
                    <div className="legend-item" onClick={() => scrollToAssistantType('leadself')} style={{ cursor: 'pointer' }}>
                        <div className="legend-dot" style={{ backgroundColor: "rgb(107, 149, 247)" }}></div>
                        <span className="legend-text">Lead Self</span>
                    </div>
                    <div className="legend-item" onClick={() => scrollToAssistantType('leadothers')} style={{ cursor: 'pointer' }}>
                        <div className="legend-dot" style={{ backgroundColor: "rgb(165, 86, 226)" }}></div>
                        <span className="legend-text">Lead Others</span>
                    </div>
                    <div className="legend-item" onClick={() => scrollToAssistantType('leadorganization')} style={{ cursor: 'pointer' }}>
                        <div className="legend-dot" style={{ backgroundColor: "rgb(90, 196, 87)" }}></div>
                        <span className="legend-text">Lead Organization</span>
                    </div>
                </div>
            </div>

            <div className="legend-mobile">
                <div className="legend-mobile-item" onClick={() => scrollToAssistantType('overarching')} style={{ cursor: 'pointer' }}>
                    <div className="legend-mobile-dot" style={{ backgroundColor: "rgb(208, 214, 36)" }}></div>
                    <span className="legend-mobile-text">Start here: Onboarding</span>
                </div>
                <div className="legend-mobile-item" onClick={() => scrollToAssistantType('productmarketfit')} style={{ cursor: 'pointer' }}>
                    <div className="legend-mobile-dot" style={{ backgroundColor: "rgb(255, 87, 51)" }}></div>
                    <span className="legend-mobile-text">Find product-market fit</span>
                </div>
                <div className="legend-mobile-item" onClick={() => scrollToAssistantType('growthengine')} style={{ cursor: 'pointer' }}>
                    <div className="legend-mobile-dot" style={{ backgroundColor: "rgb(251, 142, 209)" }}></div>
                    <span className="legend-mobile-text">Design a growth engine</span>
                </div>
                <div className="legend-mobile-item" onClick={() => scrollToAssistantType('scaling')} style={{ cursor: 'pointer' }}>
                    <div className="legend-mobile-dot" style={{ backgroundColor: "rgb(101, 235, 204)" }}></div>
                    <span className="legend-mobile-text">Scale with intention</span>
                </div>
                <div className="legend-mobile-item" onClick={() => scrollToAssistantType('leadself')} style={{ cursor: 'pointer' }}>
                    <div className="legend-mobile-dot" style={{ backgroundColor: "rgb(107, 149, 247)" }}></div>
                    <span className="legend-mobile-text">Lead Self</span>
                </div>
                <div className="legend-mobile-item" onClick={() => scrollToAssistantType('leadothers')} style={{ cursor: 'pointer' }}>
                    <div className="legend-mobile-dot" style={{ backgroundColor: "rgb(165, 86, 226)" }}></div>
                    <span className="legend-mobile-text">Lead Others</span>
                </div>
                <div className="legend-mobile-item" onClick={() => scrollToAssistantType('leadorganization')} style={{ cursor: 'pointer' }}>
                    <div className="legend-mobile-dot" style={{ backgroundColor: "rgb(90, 196, 87)" }}></div>
                    <span className="legend-mobile-text">Lead Organization</span>
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