import React, { useState, useEffect } from 'react';
import './Loader.css';  

function Loader() {
    const [loading, setLoading] = useState(true);

    // Simula un caricamento di 2 secondi (adatta questo timer secondo le tue necessità)
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000); // Tempo di durata del caricamento (in ms)
        
        return () => clearTimeout(timer); // Pulisce il timer al dismount del componente
    }, []);

    if (!loading) return null; // Se non siamo in fase di caricamento, non rendiamo nulla

    return (
        <div className="loader-overlay">
            <video autoPlay loop muted className="hero-video">
                <source src={require('../Images/provaLoader.mp4')} type="video/mp4" />
                Il tuo browser non supporta i video.
            </video>
        </div>
    );
}

export default Loader;