import React, { useState } from 'react';
import './UserDashboard.css';
import { useNavigate } from 'react-router-dom';
import Popup from './Popup';

function AssistantTable({ assistant, user }) {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const API_URL = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001'  // URL locale
        : 'https://chatrathbackend-kcux.onrender.com'; // URL di produzione

        const handleRowClick = async () => {
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

        const getBackgroundColor = (group) => {
            switch (group) {
                case "overarching":
                    return "linear-gradient(to right, rgb(208, 214, 36), transparent, transparent, transparent, transparent, rgb(208, 214, 36))";
                case "leadself":
                    return "linear-gradient(to right, rgb(107, 149, 247), transparent, transparent, transparent, transparent, rgb(107, 149, 247))";
                case "leadorganization":
                    return "linear-gradient(to right, rgb(90, 196, 87), transparent, transparent, transparent, transparent, rgb(90, 196, 87))";
                case "leadothers":
                    return "linear-gradient(to right, rgb(94, 27, 136), transparent, transparent, transparent, transparent, rgb(94, 27, 136))";
                case "productmarketfit":
                    return "linear-gradient(to right, rgb(255, 87, 51), transparent, transparent, transparent, transparent, rgb(255, 87, 51))";
                case "growthengine":
                    return "linear-gradient(to right, rgb(147, 51, 255), transparent, transparent, transparent, transparent, rgb(147, 51, 255))";
                case "scaling":
                    return "linear-gradient(to right, rgb(51, 255, 189), transparent, transparent, transparent, transparent, rgb(51, 255, 189))";
                default:
                    return "rgb(78, 78, 78)"; // colore di default
            }
        };

    return (
        <>
            <tr 
                id={assistant.group}
                key={assistant.id} 
                onClick={handleRowClick}
                className="assistant-row"
                style={{ background: getBackgroundColor(assistant.group) }}
            >
                <td>{assistant.name}</td>
                <td>{assistant.description}</td>
            </tr>
            {showPopup && (
                <Popup
                    message="You have an active conversation with this assistant. Do you want to resume it?"
                    onContinue={handleContinue}
                    onNewChat={handleNewChat}
                    onClose={() => setShowPopup(false)}
                />
            )}
        </>
    );
}

export default AssistantTable;
