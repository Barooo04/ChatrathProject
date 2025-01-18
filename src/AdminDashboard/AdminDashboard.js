import "./AdminDashboard.css"
import Loader from "../Loader/Loader";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

function AdminDashboard({ user, onLogout }) {

    const [isLoading, setIsLoading] = useState(true);
    const [assistants, setAssistants] = useState([]);
    const [stats, setStats] = useState(null);
    const [assistantId, setAssistantId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');
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
            setError('Per favore, compila tutti i campi.');
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
                throw new Error('Errore durante il recupero delle statistiche');
            }

            const data = await response.json();
            setStats(data);
            setError('');
        } catch (error) {
            console.error('Errore:', error);
            setError('Errore durante il recupero delle statistiche');
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

     return (

        <>
        {isLoading ? (
            <Loader />
        ) : (
        <div className="admin-container">
            <div className="analystics-container-content">
                <h1 className="analystics-container-title">HI {user.name}, HERE ARE YOUR STATS!</h1>
                <h3 className="analystics-container-subtitle">Select an assistant and a time period to see its stats!</h3>
            </div>
            <nav className="admin-nav">
                <div style={{display: 'flex', gap: '10px'}}>
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
                    <button className="admin-nav-view" onClick={fetchStats}>View</button>
                </div>
                <div style={{display: 'flex', gap: '10px'}}>
                    <button className="admin-nav-client" >Add a new client</button>
                    <button className="admin-nav-logout" onClick={onLogout}>Logout</button>
                </div>
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
        </div>
        )}
        </>
    );
}

export default AdminDashboard;