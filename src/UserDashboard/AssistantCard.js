import React, { useState } from 'react';
import './AssistantCard.css';
import { useNavigate } from 'react-router-dom';
import Popup from './Popup';

function AssistantCard({ assistant, user }) {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const API_URL = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001'  // URL locale
        : 'https://chatrathbackend.onrender.com'; // URL di produzione

    const handleCardClick = async () => {
        const sessionKey = `chat_session_${user.id}_${assistant.id}`;
        const existingSession = localStorage.getItem(sessionKey);

        if (existingSession) {
            setShowPopup(true);
            return;
        }

        await createNewSession();
    };

    const createNewSession = async () => {
        try {
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
            const sessionKey = `chat_session_${user.id}_${assistant.id}`;
            localStorage.setItem(sessionKey, JSON.stringify({
                active: true,
                threadId: data.threadId
            }));

            navigate(`/chat/${assistant.token}`, { state: { threadId: data.threadId } });
        } catch (error) {
            console.error('Errore:', error);
        }
    };

    const handleContinue = () => {
        const sessionKey = `chat_session_${user.id}_${assistant.id}`;
        const sessionData = JSON.parse(localStorage.getItem(sessionKey));
        setShowPopup(false);
        navigate(`/chat/${assistant.token}`, { state: { threadId: sessionData.threadId } });
    };

    const handleNewChat = () => {
        const sessionKey = `chat_session_${user.id}_${assistant.id}`;
        localStorage.removeItem(sessionKey);
        localStorage.removeItem(`chat_${assistant.token}`);
        setShowPopup(false);
        createNewSession();
    };

    return (
        <div>
            <div className="assistant-card" onClick={handleCardClick}>
                <img className="assistant-icon" src={assistant.icon_url} alt={assistant.name} />
                <div className="assistant-info">
                    <h2 className="assistant-name">{assistant.name}</h2>
                    <p className="assistant-description">{assistant.description}</p>
                </div>
            </div>
            {showPopup && (
                <Popup
                    message="You have an active conversation with this assistant. Do you want to resume it?"
                    onContinue={handleContinue}
                    onNewChat={handleNewChat}
                    onClose={() => setShowPopup(false)}
                />
            )}
        </div>
    );
}

export default AssistantCard;