import React, { useState } from 'react';
import './AssistantCard.css';
import { useNavigate } from 'react-router-dom';
import Popup from './Popup';

import leadself from "../Images/IconCard/leadself.png";
import leadorganization from "../Images/IconCard/leadorganization.png";
import leadothers from "../Images/IconCard/leadothers.png";
import overarching from "../Images/IconCard/overarching.png";
import tailored from "../Images/IconCard/tailored.png";
import growthengine from "../Images/IconCard/growthengine.png";
import scaling from "../Images/IconCard/scaling.png";
import productmarketfit from "../Images/IconCard/productmarketfit.png";

function AssistantCard({ assistant, user }) {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const useAnthropic = localStorage.getItem('chatService') === 'anthropic';
    const API_URL = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001'  // URL locale
        : 'https://chatrathbackend-kcux.onrender.com'; // URL di produzione

    const handleCardClick = async () => {
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
            console.log('📤 Creazione metadata per la sessione');
            
            if (useAnthropic) {
                // Per Anthropic, non creiamo i metadata qui, verranno creati in Chat.js
                console.log('✅ Navigazione alla chat Anthropic');
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

            console.log('✅ Sessione creata con successo');
            navigate(`/chat/${assistant.token}`, { state: { threadId: data.threadId } });
        } catch (error) {
            console.error('❌ Errore nella creazione della sessione:', error);
        }
    };

    const handleContinue = () => {
        const sessionKey = `chat_session_${user.id}_${assistant.id}`;
        const sessionData = JSON.parse(localStorage.getItem(sessionKey));
        console.log('🔄 Ripresa sessione esistente');
        setShowPopup(false);
        navigate(`/chat/${assistant.token}`, { state: { threadId: sessionData.threadId } });
    };

    const handleNewChat = () => {
        const sessionKey = `chat_session_${user.id}_${assistant.id}`;
        localStorage.removeItem(sessionKey);
        localStorage.removeItem(`chat_${assistant.token}`);
        console.log('🆕 Inizio nuova chat');
        setShowPopup(false);
        createNewSession();
    };

    const getBackgroundColor = (group) => {
        switch (group) {
            case "overarching":
                return "rgb(208, 214, 36)";
            case "leadself":
                return "rgb(123, 155, 231)";
            case "leadorganization":
                return "rgb(90, 196, 87)";
            case "leadothers":
                return "rgb(165, 86, 226)";
            case "productmarketfit":
                return "rgb(255, 87, 51)";  // Arancione acceso
            case "growthengine":
                return "rgb(251, 142, 209)";  // Viola brillante
            case "scaling":
                return "rgb(101, 235, 204)";  // Turchese
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
            case "productmarketfit":
                return productmarketfit;
            case "growthengine":
                return growthengine;
            case "scaling":
                return scaling;
            case "tailored":
                return tailored;
            default:
                return ""; // colore di default
        }
    };

    return (
        <div>
            <div
                className={`assistant-card ${assistant.group === 'tailored' ? 'tailored' : ''}`}
                onClick={handleCardClick}
                style={{ backgroundColor: assistant.group !== 'tailored' ? getBackgroundColor(assistant.group) : 'transparent' }}
                id={assistant.group}
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