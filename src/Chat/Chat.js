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
    const [assistantPrompt, setAssistantPrompt] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.id : null;
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [rating, setRating] = useState(3);
    const [comment, setComment] = useState('');
    const [threadId, setThreadId] = useState(null);
    const messagesEndRef = useRef(null);
    const useAnthropic = localStorage.getItem('chatService') === 'anthropic';

    const API_URL = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001'  // URL locale
        : 'https://chatrathbackend-kcux.onrender.com'; // URL di produzione

    useEffect(() => {
        const fetchAssistantDetails = async () => {
            try {
                const response = await fetch(`${API_URL}/api/assistant/${assistantToken}`);
                if (response.ok) {
                    const data = await response.json();
                    setAssistantName(data.name);
                    setAssistantId(data.id);
                    setAssistantPrompt(data.prompt);
                    
                    console.log('🔄 Servizio Chat:', useAnthropic ? 'Anthropic' : 'Default');
                    console.log('📝 Prompt Assistente:', data.prompt);
                    
                    // Controlla se ci sono messaggi salvati solo se non stiamo usando Anthropic
                    if (!useAnthropic) {
                        const savedMessages = localStorage.getItem(`chat_${assistantToken}`);
                        if (!savedMessages) {
                            setMessages([{
                                text: data.first_message || `Hi! I'm ${data.name}`,
                                isUser: false,
                                timestamp: new Date().toISOString()
                            }]);
                        } else {
                            setMessages(JSON.parse(savedMessages));
                        }
                    } else {
                        // Se stiamo usando Anthropic, mostra solo il messaggio di benvenuto
                        setMessages([{
                            text: data.first_message || `Hi! I'm ${data.name}`,
                            isUser: false,
                            timestamp: new Date().toISOString()
                        }]);
                    }
                }
            } catch (error) {
                console.error('Errore nel recupero dei dettagli dell\'assistente:', error);
            }
        };

        fetchAssistantDetails();
    }, [assistantToken, API_URL, useAnthropic]);

    // Salva i messaggi nel localStorage solo se non stiamo usando Anthropic
    useEffect(() => {
        if (messages.length > 0 && !useAnthropic) {
            localStorage.setItem(`chat_${assistantToken}`, JSON.stringify(messages));
        }
    }, [messages, assistantToken, useAnthropic]);

    useEffect(() => {
        const createMetadata = async () => {
            if (!userId || !assistantId || !assistantName) return;
            
            try {
                if (useAnthropic) {
                    // Per Anthropic, creiamo una nuova riga nel DB con threadId null
                    const response = await fetch(`${API_URL}/api/metadata`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId,
                            assistantId,
                            assistantName,
                            isAnthropic: true
                        })
                    });
                    
                    if (response.ok) {
                        setThreadId(null); // Per Anthropic, threadId è sempre null
                    }
                } else {
                    // Per il servizio Default, controlliamo se esiste una chat aperta
                    const response = await fetch(`${API_URL}/api/metadata/check`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId,
                            assistantId
                        })
                    });
                
                    if (response.ok) {
                        const data = await response.json();
                        if (data.exists && data.threadId) {
                            // Se esiste una chat aperta, usiamo il suo threadId
                            setThreadId(data.threadId);
                        } else {
                            // Se non esiste una chat aperta, ne creiamo una nuova
                            const newResponse = await fetch(`${API_URL}/api/metadata`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    userId,
                                    assistantId,
                                    assistantName,
                                    isAnthropic: false
                                })
                            });
                            
                            if (newResponse.ok) {
                                const newData = await newResponse.json();
                                setThreadId(newData.threadId);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Errore durante la creazione dei metadata:', error);
            }
        };

        createMetadata();
    }, [userId, assistantId, assistantName, API_URL, useAnthropic]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || !userId) return;

        const newMessage = {
            text: inputMessage,
            isUser: true,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, newMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            if (useAnthropic) {
                console.log('📤 Invio messaggio tramite Anthropic');
                // Prepara i messaggi per Anthropic
                const anthropicMessages = messages.map(msg => ({
                    role: msg.isUser ? 'user' : 'assistant',
                    content: msg.text
                }));
                anthropicMessages.push({ role: 'user', content: inputMessage });

                const response = await fetch(`${API_URL}/api/anthropic`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        messages: anthropicMessages,
                        system: "MANDATORY: use maximum around 50 words per answer. " + (assistantPrompt || `You are ${assistantName}, an AI assistant.`),
                        model: 'claude-3-haiku-20240307',
                        temperature: 0.2,
                        max_tokens: 1024
                    })
                });

                if (!response.ok) {
                    throw new Error('Errore nella risposta del server');
                }

                const data = await response.json();
                console.log('📥 Risposta ricevuta da Anthropic');
                
                const assistantMessage = {
                    text: data.assistant,
                    isUser: false,
                    timestamp: new Date().toISOString()
                };

                setMessages(prev => [...prev, assistantMessage]);
            } else {
                console.log('📤 Invio messaggio tramite servizio Default');
                // Logica esistente per il servizio normale
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
                console.log('📥 Risposta ricevuta dal servizio Default');
                
                const assistantMessage = {
                    text: data.response,
                    isUser: false,
                    timestamp: new Date().toISOString()
                };

                setMessages(prev => [...prev, assistantMessage]);
            }
        } catch (error) {
            console.error('❌ Errore durante l\'invio del messaggio:', error);
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
            if (useAnthropic) {
                // Per Anthropic, salviamo il feedback solo se c'è una recensione
                if (rating !== 3 || comment.trim() !== '') {
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
                            threadId: null,
                            isAnthropic: true
                        })
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('Errore dal server:', errorData);
                    }
                }
                // In ogni caso, naviga alla dashboard
                navigate('/dashboard');
                return;
            }

            // Per il servizio Default, manteniamo la logica esistente
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
                    threadId,
                    isAnthropic: false
                })
            });

            if (response.ok) {
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
            <div className="messages-container"
                style={{
                    maxHeight: 'calc(100vh - 320px)'
                }}
            >
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
                    <textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="message-input"
                        rows={4}
                        style={{overflowY: 'auto'}}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                    />
                    <button className="send-button" onClick={handleSubmit}>Send</button>
                </form>
            </div>
            
            {showFeedbackModal && (
                <div className="feedback-modal-overlay">
                    <div className="feedback-modal">
                        <h2>Feedback for {assistantName}</h2>
                        <p>{useAnthropic ? 
                            "How was your experience with this conversation? Leave a rating before starting a new one." : 
                            "How did you find with " + assistantName + "? Select a rating with the stars"}
                        </p>
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
                        
                        {useAnthropic && (
                            <p className='feedback-modal-subtitle'>*By leaving this chat, you won't be able to continue this conversation. You can just start a new one.</p>
                        )}

                        <div className="modal-buttons">
                            {useAnthropic ? (
                                <button onClick={handleFeedbackSubmit}>Leave Chat</button>
                            ) : (
                                <>
                                    <button onClick={handleFeedbackSubmit}>Leave Chat</button>
                                    <button onClick={() => navigate('/dashboard')} className='skip-button'>Skip</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Chat;