import React, { useState } from 'react';
import './AssistantCard.css';
import { useNavigate } from 'react-router-dom';
import Popup from './Popup';

import leadself from "../Images/IconCard/leadself.png";
import leadorganization from "../Images/IconCard/leadorganization.png";
import leadothers from "../Images/IconCard/leadothers.png";
import overarching from "../Images/IconCard/overarching.png";
import tailored from "../Images/IconCard/tailored.png";

function AssistantCard({ assistant, user }) {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const API_URL = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001'  // URL locale
        : 'https://chatrathbackend-kcux.onrender.com'; // URL di produzione

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
            case "tailored":
                return "linear-gradient(45deg, rgba(27, 73, 255, 1), rgba(224, 255, 51, 1))";
            default:
                return "rgb(78, 78, 78)"; // colore di default
        }
    };

    const getImageSrc = (iconUrl) => {
        switch (iconUrl) {
            case "overarching":
                return overarching;
            case "leadself":
                return leadself;
            case "leadorganization":
                return leadorganization;
            case "leadothers":
                return leadothers;
            case "tailored":
                return tailored;
            default:
                return ""; // colore di default
        }
    };

    return (
        <div>
            <div
                className="assistant-card"
                onClick={handleCardClick}
                style={{ background: getBackgroundColor(assistant.group) }}
            >
                <img className="assistant-icon" src={getImageSrc(assistant.group)} alt={assistant.name} />
                <div className="assistant-info">
                    <h2 className="assistant-name">{assistant.name}</h2>
                    <p className="assistant-description" >{assistant.description}</p>
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