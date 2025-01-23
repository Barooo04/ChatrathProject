import React from 'react';
import './Popup.css';

function Popup({ message, onContinue, onNewChat, onClose }) {
    return (
        <div className="popup-overlay">
            <div className="popup">
                <p>{message}</p>
                <div className="popup-actions">
                    <button className="btn btn-continue" onClick={onContinue}>
                        RESUME
                    </button>
                    <button className="btn btn-new-chat" onClick={onNewChat}>
                        NEW CHAT
                    </button>
                </div>
                <button className="btn btn-close" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
}

export default Popup;