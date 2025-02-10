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
                    return "rgb(208, 214, 36)";
                case "leadself":
                    return "rgb(107, 149, 247)";
                case "leadorganization":
                    return "rgb(90, 196, 87)";
                case "leadothers":
                    return "rgb(94, 27, 136)";
                default:
                    return "rgb(78, 78, 78)"; // colore di default
            }
        };

    return (
        <>
            <tr 
                key={assistant.id} 
                onClick={handleRowClick}
                className="assistant-row"
                style={{ background: `linear-gradient(to right, ${getBackgroundColor(assistant.group)}, transparent, transparent, transparent, transparent, ${getBackgroundColor(assistant.group)})` }}
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
