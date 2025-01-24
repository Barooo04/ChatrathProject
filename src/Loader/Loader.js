import React, { useState, useEffect } from 'react';
import './Loader.css';
import logo from '../Images/logonick.png'; // Sostituisci con il percorso del tuo logo

function Loader() {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(true); // Stato per controllare la visibilità del loader

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev < 100) return prev + 1;
                clearInterval(interval);
                return 100;
            });
        }, 10); // Incremento della percentuale ogni 20ms

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (progress === 100) {
            const timer = setTimeout(() => {
                setIsVisible(false); // Rimuove il loader dopo 1 secondo
            }, 1000);

            return () => clearTimeout(timer); // Pulisce il timer al dismount del componente
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