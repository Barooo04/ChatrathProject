import React from 'react';
import './AssistantCard.css';
import { useNavigate } from 'react-router-dom';

function AssistantCard({ assistant, user }) {
    const navigate = useNavigate();
    const API_URL = 'https://chatrathbackenddeployments.vercel.app/';
    const handleCardClick = async () => {
        try {
            // Prima salva i metadata
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

            // Poi naviga alla chat
            navigate(`/chat/${assistant.token}`);
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