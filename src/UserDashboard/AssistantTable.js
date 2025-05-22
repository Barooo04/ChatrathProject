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

    const useAnthropic = localStorage.getItem('chatService') === 'anthropic';

    const handleRowClick = async () => {
        if (useAnthropic) {
            // Con Anthropic, crea sempre una nuova sessione senza popup
            await createNewSession();
            return;
        }

        try {
            // Prima controlla nel database
            const checkResponse = await fetch(`${API_URL}/api/metadata/check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    assistantId: assistant.id
                })
            });

            const checkData = await checkResponse.json();
            
            if (checkData.exists && checkData.threadId) {
                // Se esiste nel database, mostra il popup
                setShowPopup(true);
            } else {
                // Se non esiste nel database, crea una nuova sessione
                await createNewSession();
            }
        } catch (error) {
            console.error('Errore nel controllo della sessione:', error);
            // In caso di errore, procedi con una nuova sessione
            await createNewSession();
        }
    };

    const createNewSession = async () => {
        try {
            if (useAnthropic) {
                // Per Anthropic, non creiamo i metadata qui, verranno creati in Chat.js
                navigate(`/chat/${assistant.token}`);
                return;
            }

            const metadataResponse = await fetch(`${API_URL}/api/metadata`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    assistantId: assistant.id,
                    assistantName: assistant.name,
                    isAnthropic: false
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
                return "linear-gradient(to right, rgb(165, 86, 226), transparent, transparent, transparent, transparent, rgb(165, 86, 226))";
            case "productmarketfit":
                return "linear-gradient(to right, rgb(255, 87, 51), transparent, transparent, transparent, transparent, rgb(255, 87, 51))";
            case "growthengine":
                return "linear-gradient(to right, rgb(251, 142, 209), transparent, transparent, transparent, transparent, rgb(251, 142, 209))";
            case "scaling":
                return "linear-gradient(to right, rgb(101, 235, 204), transparent, transparent, transparent, transparent, rgb(101, 235, 204))";
            case "tailored":
                return "linear-gradient(to right, rgba(27, 73, 255, 1), rgba(224, 255, 51, 1))";
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
