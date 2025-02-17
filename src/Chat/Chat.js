import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Chat.css';
import './ChatResponsive.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import video from "../Images/how-ai2.mp4";
import ReactMarkdown from 'react-markdown';

function Chat() {
    const { assistantToken } = useParams();
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [assistantName, setAssistantName] = useState('Assistant');
    const [assistantId, setAssistantId] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.id : null;
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [rating, setRating] = useState(3);
    const [comment, setComment] = useState('');
    const [threadId, setThreadId] = useState(null);
    const messagesEndRef = useRef(null);

    const API_URL = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001'  // URL locale
        : 'https://chatrathbackend-kcux.onrender.com'; // URL di produzione

    // Aggiungi questo nuovo useEffect per recuperare il nome dell'assistente
    useEffect(() => {
        const fetchAssistantDetails = async () => {
            try {
                const response = await fetch(`${API_URL}/api/assistant/${assistantToken}`);
                if (response.ok) {
                    const data = await response.json();
                    setAssistantName(data.name);
                    setAssistantId(data.id);
                }
            } catch (error) {
                console.error('Errore nel recupero dei dettagli dell\'assistente:', error);
            }
        };

        fetchAssistantDetails();
    }, [assistantToken, API_URL]);
    
    // Carica i messaggi dal localStorage all'avvio
    useEffect(() => {
        const savedMessages = localStorage.getItem(`chat_${assistantToken}`);
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        }
    }, [assistantToken]);

    // Salva i messaggi nel localStorage ogni volta che cambiano
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem(`chat_${assistantToken}`, JSON.stringify(messages));
        }
    }, [messages, assistantToken]);

    // Aggiungi questo useEffect dopo il fetchAssistantDetails
    useEffect(() => {
        const createMetadata = async () => {
            if (!userId || !assistantId || !assistantName) return;
            
            // Controlla se esiste una sessione nel localStorage
            const sessionKey = `chat_session_${userId}_${assistantId}`;
            const existingSession = localStorage.getItem(sessionKey);

            // Se esiste già una sessione attiva, non creare nuovi metadata
            if (existingSession) {
                // Recupera il threadId dalla sessione esistente
                const sessionData = JSON.parse(existingSession);
                setThreadId(sessionData.threadId);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/metadata`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId,
                        assistantId,
                        assistantName
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setThreadId(data.threadId);
                    
                    // Salva la sessione nel localStorage con il threadId
                    localStorage.setItem(sessionKey, JSON.stringify({
                        active: true,
                        threadId: data.threadId
                    }));
                }
            } catch (error) {
                console.error('Errore durante la creazione dei metadata:', error);
            }
        };

        createMetadata();
    }, [userId, assistantId, assistantName, API_URL]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || !userId || !threadId) return;

        const newMessage = {
            text: inputMessage,
            isUser: true,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, newMessage]);
        setInputMessage('');
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    assistantToken,
                    message: inputMessage,
                    userId: userId,
                    threadId: threadId
                })
            });

            if (!response.ok) {
                throw new Error('Errore nella risposta del server');
            }

            const data = await response.json();
            console.log('Risposta dal server:', data);
            
            const assistantMessage = {
                text: data.response,
                isUser: false,
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Errore durante l\'invio del messaggio:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!userId) {
            navigate('/login');
        }
    }, [userId, navigate]);

    const handleFeedbackSubmit = async () => {
        try {
            if (!threadId) {
                console.error('ThreadId non disponibile');
                return;
            }

            const response = await fetch(`${API_URL}/api/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    assistantId,
                    userId,
                    rating,
                    comment,
                    threadId
                })
            });

            if (response.ok) {
                // Rimuovi la sessione dal localStorage
                const sessionKey = `chat_session_${userId}_${assistantId}`;
                localStorage.removeItem(sessionKey);
                localStorage.removeItem(`chat_${assistantToken}`);

                navigate('/dashboard');
            } else {
                const errorData = await response.json();
                console.error('Errore dal server:', errorData);
            }
        } catch (error) {
            console.error('Errore durante l\'invio del feedback:', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="chat-container">
            <video src={video} autoPlay loop muted playsInline className="background-video"></video>
            <div className='chat-header'>
                <h1>{assistantName}</h1>
                <div className="header-buttons">
                    <p onClick={() => setShowFeedbackModal(true)}>Back to Dashboard</p>
                </div>
            </div>
            <div className="messages-container">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.isUser ? 'user-message' : 'assistant-message'}`}>
                        {message.isUser ? (
                            message.text
                        ) : (
                            <ReactMarkdown>{message.text}</ReactMarkdown>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="loading-indicator">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="input-container">
                <form onSubmit={handleSubmit} className="input-form">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="message-input"
                    />
                    <button className="send-button" onClick={handleSubmit}>Send</button>
                </form>
            </div>
            
            {showFeedbackModal && (
                <div className="feedback-modal-overlay">
                    <div className="feedback-modal">
                        <h2>Feedback for {assistantName}</h2>
                        <p>How did you find with {assistantName}? Select a rating with the stars</p>
                        
                        <div className="rating-container">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`star ${star <= rating ? 'selected' : ''}`}
                                    onClick={() => setRating(star)}
                                >
                                    <FontAwesomeIcon icon={faStar} className={`star-icon ${star <= rating ? 'selected' : ''}`}/>
                                </span>
                            ))}
                        </div>

                        <textarea
                            placeholder="Write a comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <p className='feedback-modal-subtitle'>*By leaving this feedback, you won't be able to continue this conversation. You can just start a new one.</p>

                        <div className="modal-buttons">
                            <button onClick={handleFeedbackSubmit}>Send Feedback</button>
                            <button onClick={() => navigate('/dashboard')} className='skip-button'>Skip</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Chat;