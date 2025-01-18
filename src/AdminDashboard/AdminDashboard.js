import "./AdminDashboard.css"
import Loader from "../Loader/Loader";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faXmark, faCopy, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import bcrypt from 'bcryptjs';

function AdminDashboard({ user, onLogout }) {

    const [isLoading, setIsLoading] = useState(true);
    const [assistants, setAssistants] = useState([]);
    const [stats, setStats] = useState(null);
    const [assistantId, setAssistantId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');
    const [showAddClientPopup, setShowAddClientPopup] = useState(false);
    const [clientEmail, setClientEmail] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [clientName, setClientName] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const API_URL = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001'  // URL locale
        : 'https://chatrathbackend.onrender.com';

    useEffect(() => {
       const fetchAssistants = async () => {
        try {
            const endpoint = user.role === 'admin' 
                ? `${API_URL}/api/assistants/admin` 
                : `${API_URL}/api/assistants`;

            const response = await fetch(endpoint, {
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
            console.log('Assistants data:', data);
            setAssistants(data);
        } catch (error) {
            console.error('Errore fetching assistants:', error);
        }
       };
       fetchAssistants();

    }, [user.id, user.role]);
    
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 3000);
    }, []);

    const fetchStats = async () => {
        if (!assistantId || !startDate || !endDate) {
            setError('Please fill all fields.');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/metadata/stats`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ assistantId, startDate, endDate }),
            });

            if (!response.ok) {
                throw new Error('Error fetching stats');
            }

            const data = await response.json();
            setStats(data);
            setError('');
        } catch (error) {
            console.error('Errore:', error);
            setError('Error fetching stats');
        }
    };



    const handlePeriodChange = (event) => {
        const selectedPeriod = event.target.value;
        const today = new Date();
        let start = new Date();

        switch (selectedPeriod) {
            case 'today':
                start = new Date(today);
                break;
            case 'week':
                start.setDate(today.getDate() - 7);
                break;
            case 'month':
                start.setMonth(today.getMonth() - 1);
                break;
            case 'year':
                start.setFullYear(today.getFullYear() - 1);
                break;
            default:
                return;
        }

        setStartDate(start.toISOString().split('T')[0]); // Formatta come 'YYYY-MM-DD'
        setEndDate(today.toISOString().split('T')[0]); // Formatta come 'YYYY-MM-DD'
    };

    const generateRandomPassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        for (let i = 0; i < 8; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    };

    const handleAddClient = async () => {
        setErrorMessage('');
        setSuccessMessage('');
        setGeneratedPassword('');

        if (!clientEmail || !clientName) {
            setErrorMessage('Please insert a name and an email.');
            return;
        }

        const password = generateRandomPassword();

        try {
            const response = await fetch(`${API_URL}/api/add-client`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: clientName,
                    email: clientEmail,
                    password: password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.message || 'Error adding client');
                return;
            }

            setSuccessMessage('Client added successfully');
            setGeneratedPassword(password);
        } catch (error) {
            console.error('Error adding client:', error);
            setErrorMessage('Error adding client');
        }
    };

    const openAddClientPopup = () => {
        setClientName('');
        setClientEmail('');
        setErrorMessage('');
        setSuccessMessage('');
        setGeneratedPassword('');
        setShowAddClientPopup(true);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setShowNotification(true);
            setTimeout(() => {
                setShowNotification(false);
            }, 4000);
        }).catch(err => {
            console.error('Errore durante la copia negli appunti:', err);
        });
    };

    return (

        <>
        {isLoading ? (
            <Loader />
        ) : (
        <div className="admin-container">
            <div className="admin-buttons">
                <button className="admin-nav-client" onClick={openAddClientPopup}>Add a new client</button>
                <button className="admin-nav-logout" onClick={onLogout}>Logout</button>
            </div>
            <div className="analystics-container-content">
                <h1 className="analystics-container-title">HI {user.name}, HERE ARE YOUR STATS!</h1>
                <h3 className="analystics-container-subtitle">Select an assistant and a time period to see its stats!</h3>
            </div>
            <nav className="admin-nav">
                <div style={{display: 'flex', gap: '20px'}}>
                    <select className="assistant-select" value={assistantId} onChange={(e) => setAssistantId(e.target.value)}>  
                        <option value="">Select an assistant</option>
                        {assistants.map(assistant => (
                            <option key={assistant.id} value={assistant.id}>
                                {assistant.name}
                            </option>
                        ))}
                    </select>
                    <select className="assistant-select" onChange={handlePeriodChange}>
                        <option value="">Select a time period</option>
                        <option value="today"> last Day</option>
                        <option value="week">last Week</option>
                        <option value="month">last Month</option>
                        <option value="year">last Year</option>
                    </select>
                </div>
                <button className="admin-nav-view" onClick={fetchStats}>View</button>
                
            </nav>
            <div className="stats-container">
                {stats && (
                    <>
                        <div className="stats-container-content">
                            <div className="card">
                                <p className="stats-container-content-title">CONVERSATIONS</p>
                                <p className="stats-container-content-value">{stats.totalConversations}</p>
                            </div>
                            <div className="card">
                                <p className="stats-container-content-title">AVERAGE DURATION</p>
                                    <p className="stats-container-content-value">{Math.round(stats.averageDuration)} seconds</p>
                            </div>
                            <div className="card">
                                <p className="stats-container-content-title">AVERAGE RATING</p>
                                <p className="stats-container-content-value">{parseFloat(stats.averageRating).toFixed(1)}</p>
                            </div>
                            <div className="card">
                                <p className="stats-container-content-title">FEEDBACK</p>
                                <p className="stats-container-content-value">{stats.totalFeedbacks}</p>
                            </div>
                        </div>
                        <h3 className="last-feedbacks-title">ALL FEEDBACKS</h3>
                        <ul className="feedback-list">
                            {stats.recentFeedbacks.map((feedback, index) => (
                                <li key={index} className="feedback-card">
                                    <div className="rating-stars">
                                        {Array.from({ length: feedback.rating }, (_, i) => (
                                             <FontAwesomeIcon icon={faStar} className="star"/>
                                        ))}
                                    </div>
                                    <p className="feedback-comment">"{feedback.comment}"</p>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
            {showAddClientPopup && (
                <>
                <div className="overlay"></div>
                <div className="password-popup">
                    <button className="close-button" onClick={() => setShowAddClientPopup(false)}><FontAwesomeIcon icon={faXmark} /></button>
                    {successMessage ? (
                        <div className="success-message">
                            <FontAwesomeIcon icon={faCheckCircle} size="2x" color="green" />
                            <p>{successMessage}</p>
                            <p className="generated-password">Generated password: {generatedPassword}</p>
                            <button className="copy-button" onClick={() => copyToClipboard(generatedPassword)}><FontAwesomeIcon icon={faCopy} /></button>
                        </div>
                    ) : (
                        <>
                        <h2>Add a new client</h2>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <input 
                            type="text" 
                            placeholder="Nome" 
                            value={clientName} 
                            onChange={(e) => setClientName(e.target.value)} 
                        />
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={clientEmail} 
                            onChange={(e) => setClientEmail(e.target.value)} 
                        />
                        <button onClick={handleAddClient}>Add Client</button>
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

export default AdminDashboard;