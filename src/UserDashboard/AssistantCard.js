import React from 'react';
import './AssistantCard.css';
import { useNavigate } from 'react-router-dom';

function AssistantCard({ assistant, user }) {
    const navigate = useNavigate();
    const API_URL = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001'  // URL locale
        : 'https://chatrathbackend.onrender.com'; // URL di produzione
    
    const handleCardClick = async () => {
        const sessionKey = `chat_session_${user.id}_${assistant.id}`;
        const existingSession = localStorage.getItem(sessionKey);

        if (existingSession) {
            const continueChat = window.confirm('An active session with this assistant already exists.');
            if (continueChat) {
                const sessionData = JSON.parse(existingSession);
                navigate(`/chat/${assistant.token}`, { state: { threadId: sessionData.threadId } });
                return;
            } else {
                // Rimuovi la sessione esistente
                localStorage.removeItem(sessionKey);
                // Rimuovi i messaggi della chat esistente
                localStorage.removeItem(`chat_${assistant.token}`);
            }
        }

        try {
            // Salva i metadata e crea una nuova sessione
            const metadataResponse = await fetch(`${API_URL}/api/metadata`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    assistantId: assistant.id,
                    assistantName: assistant.name
                }),
            });

            if (!metadataResponse.ok) {
                throw new Error('Errore nel salvare i metadata');
            }

            const data = await metadataResponse.json();
            localStorage.setItem(sessionKey, JSON.stringify({
                active: true,
                threadId: data.threadId
            }));

            navigate(`/chat/${assistant.token}`, { state: { threadId: data.threadId } });
        } catch (error) {
            console.error('Errore:', error);
        }
    };

    return (
        <div className="assistant-card" onClick={handleCardClick}>
            <img className="assistant-icon" src={assistant.icon_url} alt={assistant.name} />
            <div className="assistant-info">
                <h2 className="assistant-name">{assistant.name}</h2>
                <p className="assistant-description">{assistant.description}</p>
            </div>
        </div>
    );
}

export default AssistantCard; 