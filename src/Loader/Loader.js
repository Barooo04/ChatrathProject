import React, { useState, useEffect } from 'react';
import './Loader.css';
import logo from '../Images/logonick.png'; // Sostituisci con il percorso del tuo logo

function Loader() {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(true); // Stato per controllare la visibilità del loader

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev < 98) return prev + 2; // Incremento fino a 98
                clearInterval(interval);
                return 100; // Forza il valore a 100 quando raggiunge 98
            });
        }, 10); // Incremento ogni 10ms

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (progress === 100) {
            const timer = setTimeout(() => {
                setIsVisible(false); // Ridotto il delay dopo il completamento
            }, 100); // Ridotto il delay dopo il completamento

            return () => clearTimeout(timer);
        }
    }, [progress]);

    if (!isVisible) return null; // Rimuove il componente dal DOM quando `isVisible` è `false`

    return (
        <div className="loader-overlay">
            <div className="loader">
                <img src={logo} alt="Logo" className="loader-logo" />
                <div className="loader-percentage">{progress}%</div>
                <div className="loader-progress-bar">
                    <div
                        className="loader-progress"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}

export default Loader;