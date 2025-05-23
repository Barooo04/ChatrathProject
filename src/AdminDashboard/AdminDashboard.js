import "./AdminDashboard.css"
import Loader from "../Loader/Loader";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faXmark, faCheckCircle, faRedo } from '@fortawesome/free-solid-svg-icons';
import video from "../Images/how-ai2.mp4";
import emailjs from '@emailjs/browser';
import { format } from 'date-fns';

function AdminDashboard({ user, onLogout }) {

    const [isLoading, setIsLoading] = useState(true);
    const [assistants, setAssistants] = useState([]);
    const [stats, setStats] = useState(null);
    const [assistantId, setAssistantId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');
    const [showAddClientPopup, setShowAddClientPopup] = useState(false);
    const [showRemoveClientPopup, setShowRemoveClientPopup] = useState(false);
    const [clientEmail, setClientEmail] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [clientName, setClientName] = useState('');
    const [globalStats, setGlobalStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');

    const API_URL = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001'  // URL locale
        : 'https://chatrathbackend-kcux.onrender.com';

        useEffect(() => {
            const fetchGlobalStats = async () => {
                try {
                    const response = await fetch(`${API_URL}/api/admin/stats`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
    
                    if (!response.ok) {
                        throw new Error('Errore nel recupero delle statistiche globali');
                    }
    
                    const data = await response.json();
                    setGlobalStats(data);
                } catch (error) {
                    console.error('Errore fetching global stats:', error);
                }
            };
    
            fetchGlobalStats();
        }, []);

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
        }, 600);
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${API_URL}/api/users`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Errore nel recupero degli utenti');
                }

                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Errore fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const fetchStats = async () => {
        if (!assistantId && !startDate && !endDate && !selectedUserId) {
            setError('Please fill all fields.');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/metadata/stats`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    assistantId: assistantId === 'all' ? null : assistantId,
                    startDate: startDate || null,
                    endDate: endDate || null,
                    userId: selectedUserId === 'all' ? null : selectedUserId
                }),
            });

            if (!response.ok) {
                throw new Error('Error fetching stats');
            }

            const data = await response.json();
            console.log(data);
            setStats(data);
            setError('');
        } catch (error) {
            console.error('Errore:', error);
            setError('Error fetching stats');
        }
    };

    const resetFilters = () => {
        setAssistantId('');
        setStartDate('');
        setEndDate('');
        setSelectedUserId('');
        setStats(null);
        setError('');
        document.querySelector('.assistant-select:nth-of-type(2)').value = '';
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
            case 'all':
                start = new Date(0);
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

    const handleRemoveClient = async () => {
        setErrorMessage('');
        setSuccessMessage('');

        if (!clientEmail) {
            setErrorMessage('Please insert an email.');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/remove-client`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: clientEmail }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.message === 'Email not found') {
                    setErrorMessage('The email does not exist in the users.');
                } else {
                    setErrorMessage(data.message || 'Error removing client');
                }
                return;
            } else {
                console.log('Client removed successfully');
                setSuccessMessage('Client removed successfully');
            }
        } catch (error) {
            console.error('Error removing client:', error);
            setErrorMessage('Error removing client');
        }
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

            const emailParamsToNick = {
                from_name: clientName,
                client_email: clientEmail,
                pass_gen: password,
            };

            emailjs.send('service_yi9plyd', 'template_rwicvhb', emailParamsToNick, 'b5fsPJLt_FRNIzG-8')
            .then((result) => {
                console.log('Email a te inviata con successo:', result.text);
            }, (error) => {
                console.error('Errore nell\'invio dell\'email a te:', error.text);
            });

            const emailParamsToClient = {
                to_name: clientName,
                link_login: 'https://www.threshold.coach/login', 
                pass_gen: password,
                to_email: clientEmail,
            };

            emailjs.send('service_yi9plyd', 'template_s6onr0c', emailParamsToClient, 'b5fsPJLt_FRNIzG-8')
                .then((result) => {
                    console.log('Email al cliente inviata con successo:', result.text);
                    setSuccessMessage('Client added successfully and email sent');
                }, (error) => {
                    console.error('Errore nell\'invio dell\'email al cliente:', error.text);
                    setErrorMessage('Client added but failed to send email to client');
                });
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

    const openRemoveClientPopup = () => {
        setShowRemoveClientPopup(true);
    };

    const downloadCSV = () => {
        if (!stats || !stats.recentFeedbacks) {
            setError('No data available to download.');
            return;
        }

        const csvRows = [];
        const headers = ['Assistant Name', 'Assistant ID', 'User ID', 'Conversation ID', 'Start Date', 'End Date', 'Rating', 'Comment'];
        csvRows.push(headers.join(','));

        stats.recentFeedbacks.forEach(feedback => {
            const startDate = feedback.data_apertura ? format(new Date(feedback.data_apertura), 'dd/MM/yyyy HH:mm') : '';
            const endDate = feedback.data_chiusura ? format(new Date(feedback.data_chiusura), 'dd/MM/yyyy HH:mm') : '';

            const feedbackRow = [
                feedback.assistant_name || '',
                feedback.assistant_id || '',
                feedback.user_id || '',
                feedback.thread_id || '',
                startDate,
                endDate,
                feedback.rating || '',
                feedback.comment || ''
            ];
            csvRows.push(feedbackRow.join(','));
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'stats.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (

        <>
        {isLoading ? (
            <Loader />
        ) : (
        <div className="admin-container">
            <video src={video} autoPlay loop muted playsInline className="background-video"></video>
            <div className="admin-buttons">
                <button className="admin-nav-client" onClick={openRemoveClientPopup}>Remove a Client</button>
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
                        <option value="all">All Assistants</option>
                        {assistants.map(assistant => (
                            <option key={assistant.id} value={assistant.id}>
                                {assistant.name}
                            </option>
                        ))}
                    </select>
                    <select className="assistant-select" onChange={handlePeriodChange}>
                        <option value="">Select a time period</option>
                        <option value="all">No Time Period</option>
                        <option value="today"> last Day</option>
                        <option value="week">last Week</option>
                        <option value="month">last Month</option>
                        <option value="year">last Year</option>
                    </select>
                    <select className="assistant-select" value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
                        <option value="">Select a user</option>
                        <option value="all">All Users</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.id}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{display: 'flex', gap: '20px'}}>
                    <button className="admin-nav-view" onClick={fetchStats}>View</button>
                    <button className="admin-nav-view" onClick={resetFilters}>
                        <FontAwesomeIcon icon={faRedo} />
                    </button>
                    <button className="admin-nav-view" onClick={downloadCSV}>Download CSV</button>
                </div>
            </nav>
            <div className="stats-container">
                {globalStats && (
                    <div className="global-stats" style={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px'}}>
                        <div className="card-global">
                            <p className="stats-container-content-title">CLIENTS</p>
                            <p className="stats-container-content-value">{globalStats.totalClients}</p>
                        </div>
                        <div className="card-global">
                            <p className="stats-container-content-title">ASSISTANTS</p>
                            <p className="stats-container-content-value">{globalStats.totalAssistants}</p>
                        </div>
                        <div className="card-global">
                            <p className="stats-container-content-title">CONVERSATIONS</p>
                            <p className="stats-container-content-value">{globalStats.totalConversations}</p>
                        </div>
                        <div className="card-global">
                            <p className="stats-container-content-title">FEEDBACK</p>
                            <p className="stats-container-content-value">{globalStats.totalFeedbacks}</p>
                        </div>
                    </div>
                )}
                {stats && (
                    <>
                        <h3 className="global-stats-title" style={{textAlign: 'center', marginBottom: '20px', color: 'white', fontSize: '3rem'}}>SELECTED ASSISTANT STATS</h3>
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
                            {stats.recentFeedbacks
                                .filter(feedback => feedback.comment && feedback.comment.trim() !== '')
                                .map((feedback, index) => (
                                    <li key={index} className="feedback-card">
                                        <div className="rating-stars">
                                            {Array.from({ length: feedback.rating }, (_, i) => (
                                                <FontAwesomeIcon icon={faStar} className="star" />
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
                        </div>
                    ) : (
                        <>
                        <h2>Add a new client</h2>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <input 
                            type="text" 
                            placeholder="Name" 
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
            {showRemoveClientPopup && (
                <>
                <div className="overlay"></div>
                <div className="password-popup">
                    <button className="close-button" onClick={() => setShowRemoveClientPopup(false)}><FontAwesomeIcon icon={faXmark} /></button>
                    {successMessage ? (
                        <div className="success-message">
                            <FontAwesomeIcon icon={faCheckCircle} size="2x" color="green" />
                            <p>{successMessage}</p>
                        </div>
                    ) : (
                        <>
                        <h2>Remove a client</h2>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={clientEmail} 
                            onChange={(e) => setClientEmail(e.target.value)} 
                        />
                        <button onClick={handleRemoveClient}>Remove Client</button>
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